import { omitNil } from '@/utils/obj-map';
import {
  Document,
  Packer,
  HeadingLevel,
  Paragraph,
  TextRun,
  AlignmentType,
  ShadingType,
  LevelFormat,
} from 'docx';
import { Descendant, Element, Text } from 'slate';
import { HEADING_VALUES } from '../heading';
import { ListType } from '../list/slate-lists';

const HEADING_MAPPING = {
  'heading-one': HeadingLevel.HEADING_1,
  'heading-two': HeadingLevel.HEADING_2,
  'heading-three': HeadingLevel.HEADING_3,
  'heading-four': HeadingLevel.HEADING_4,
  'heading-five': HeadingLevel.HEADING_5,
  'heading-six': HeadingLevel.HEADING_6,
};

const ALIGN_MAPPING = {
  start: AlignmentType.START,
  center: AlignmentType.CENTER,
  end: AlignmentType.END,
  justify: AlignmentType.BOTH,
};

const serializeText = (value: Text): [any, TextRun] => {
  const plain = omitNil({
    text: value.text,
    bold: value.bold,
    size: value.fontSize,
    italics: value.italic,
    underline: value.underline ? {} : undefined,
    shading: value.backgroundColor
      ? {
          type: ShadingType.SOLID,
          color: value.backgroundColor,
        }
      : undefined,
    color: value.foregroundColor,
    strike: value.strikethrough,
    superScript: value.superscript,
    subScript: value.subscript,
  });

  return [{ ...plain, type: 'TextRun' }, new TextRun(plain)];
};

const serializeParagraphOrHeading = (value: Element): [any, Paragraph] => {
  const plainChildren = [];
  const children = [];

  for (const x of value.children) {
    if (Text.isText(x)) {
      const [plain, serialized] = serializeText(x);
      plainChildren.push(plain);
      children.push(serialized);
    } else if (
      x.type === 'paragraph' ||
      HEADING_VALUES.findIndex((y) => x.type === y) !== -1
    ) {
      const [plain, serialized] = serializeParagraphOrHeading(x);
      plainChildren.push(plain);
      children.push(serialized);
    }
  }

  const plain = omitNil({
    heading: HEADING_MAPPING[value.type],
    alignment: ALIGN_MAPPING[value.align],
    indent: value.indent ? { start: value.indent * 2 + 'pc' } : undefined,
    children: plainChildren,
  });

  return [
    { ...plain, type: 'Paragraph' },
    new Paragraph({ ...plain, children }),
  ];
};

const serializeListItemText = (
  value: Element,
  listType: ListType,
  level: number,
): [any, Paragraph] => {
  const plainChildren = [];
  const children = [];

  for (const x of value.children) {
    if (Text.isText(x)) {
      const [plain, serialized] = serializeText(x);
      plainChildren.push(plain);
      children.push(serialized);
    }
  }

  const plain = omitNil({
    numbering:
      listType === ListType.ORDERED
        ? {
            reference: 'my-crazy-numbering',
            level: level,
          }
        : undefined,
    bullet:
      listType === ListType.UNORDERED
        ? {
            level: level,
          }
        : undefined,
    alignment: ALIGN_MAPPING[value.align],
    indent: value.indent ? { start: value.indent * 2 + 'pc' } : undefined,
    children: plainChildren,
  });

  return [
    { ...plain, type: 'Paragraph' },
    new Paragraph({ ...plain, children }),
  ];
};

const serializeList = (
  value: Element,
  listType: ListType,
  baseLevel: number = 0,
): [any[], Paragraph[]] => {
  const plain = [];
  const serialized = [];

  for (const x of value.children) {
    if (Element.isElement(x) && x.type === 'list-item') {
      for (const y of x.children) {
        if (y.type === 'unordered-list') {
          const [plain2, serialized2] = serializeList(
            y,
            ListType.UNORDERED,
            baseLevel + 1,
          );
          plain.push(...plain2);
          serialized.push(...serialized2);
        } else if (y.type === 'ordered-list') {
          const [plain2, serialized2] = serializeList(
            y,
            ListType.ORDERED,
            baseLevel + 1,
          );
          plain.push(...plain2);
          serialized.push(...serialized2);
        } else if (y.type === 'list-item-text') {
          const [plain2, serialized2] = serializeListItemText(
            y,
            listType,
            baseLevel,
          );
          plain.push(plain2);
          serialized.push(serialized2);
        }
      }
    }
  }
  return [plain, serialized];
};

const serializeRoot = (value: Descendant[]) => {
  const plainChildren = [];
  const children = [];

  for (const x of value) {
    if (HEADING_VALUES.findIndex((y) => x.type === y) !== -1) {
      const [plain, serialized] = serializeParagraphOrHeading(x);
      plainChildren.push(plain);
      children.push(serialized);
    } else if (x.type === 'unordered-list') {
      const [plain, serialized] = serializeList(x, ListType.UNORDERED);
      plainChildren.push(...plain);
      children.push(...serialized);
    } else if (x.type === 'ordered-list') {
      const [plain, serialized] = serializeList(x, ListType.ORDERED);
      plainChildren.push(...plain);
      children.push(...serialized);
    }
  }

  console.log(plainChildren);

  return [plainChildren, children];
};

const serialize = (value: Descendant[]) => {
  const [, serializedRoot] = serializeRoot(value);
  return new Document({
    numbering: {
      config: [
        {
          reference: 'my-crazy-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 260 },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: '%2)',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 1440, hanging: 980 },
                },
              },
            },
            {
              level: 2,
              format: LevelFormat.LOWER_ROMAN,
              text: '%3.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 2160, hanging: 1700 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [{ children: serializedRoot }],
  });
};

export const saveAsDocx = async (value: Descendant[]) => {
  const doc = serialize(value);

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const fileSaver = document.createElement('a');
  fileSaver.href = URL.createObjectURL(blob);
  fileSaver.download = 'docx.docx';
  document.body.appendChild(fileSaver);
  fileSaver.click();
  document.body.removeChild(fileSaver);
};
