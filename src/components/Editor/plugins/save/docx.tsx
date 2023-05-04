import { getAsset } from '@/services/assets';
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
  ImageRun,
} from 'docx';
import imageSize from '@coderosh/image-size';
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

const serializeImage = async (value: Element): Promise<[any, ImageRun]> => {
  const { assetId } = value;
  const data = await getAsset({ assetId });

  // 100px == 2.65cm
  // 页宽21cm，页间距2.54cm，故页可用宽度为15.92cm === 600px

  let { height, width } = await imageSize(data);
  if (width > 600) {
    const ratio = 600 / width;
    height *= ratio;
    width *= ratio;
  }

  const plain = omitNil({
    transformation: { width, height },
  });

  return [{ ...plain, type: 'ImageRun' }, new ImageRun({ data, ...plain })];
};

const serializeParagraphOrHeading = async (
  value: Element,
): Promise<[any, Paragraph]> => {
  const plainChildren = [];
  const children = [];

  for (const x of value.children) {
    if (Text.isText(x)) {
      const [plain, serialized] = serializeText(x);
      plainChildren.push(plain);
      children.push(serialized);
    } else if (x.type === 'image') {
      const [plain, serialized] = await serializeImage(x);
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

const serializeListItemText = async (
  value: Element,
  listType: ListType,
  level: number,
): Promise<[any, Paragraph]> => {
  const plainChildren = [];
  const children = [];

  for (const x of value.children) {
    if (Text.isText(x)) {
      const [plain, serialized] = serializeText(x);
      plainChildren.push(plain);
      children.push(serialized);
    } else if (x.type === 'image') {
      const [plain, serialized] = await serializeImage(x);
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

const serializeList = async (
  value: Element,
  listType: ListType,
  baseLevel: number = 0,
): Promise<[any[], Paragraph[]]> => {
  const plain = [];
  const serialized = [];

  for (const x of value.children) {
    if (Element.isElement(x) && x.type === 'list-item') {
      for (const y of x.children) {
        if (y.type === 'unordered-list') {
          const [plain2, serialized2] = await serializeList(
            y,
            ListType.UNORDERED,
            baseLevel + 1,
          );
          plain.push(...plain2);
          serialized.push(...serialized2);
        } else if (y.type === 'ordered-list') {
          const [plain2, serialized2] = await serializeList(
            y,
            ListType.ORDERED,
            baseLevel + 1,
          );
          plain.push(...plain2);
          serialized.push(...serialized2);
        } else if (y.type === 'list-item-text') {
          const [plain2, serialized2] = await serializeListItemText(
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

const serializeRoot = async (value: Descendant[]) => {
  const plainChildren = [];
  const children = [];

  for (const x of value) {
    if (HEADING_VALUES.findIndex((y) => x.type === y) !== -1) {
      const [plain, serialized] = await serializeParagraphOrHeading(x);
      plainChildren.push(plain);
      children.push(serialized);
    } else if (x.type === 'unordered-list') {
      const [plain, serialized] = await serializeList(x, ListType.UNORDERED);
      plainChildren.push(...plain);
      children.push(...serialized);
    } else if (x.type === 'ordered-list') {
      const [plain, serialized] = await serializeList(x, ListType.ORDERED);
      plainChildren.push(...plain);
      children.push(...serialized);
    }
  }

  console.log(plainChildren);

  return [plainChildren, children];
};

const serialize = async (value: Descendant[]) => {
  const [, serializedRoot] = await serializeRoot(value);
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

export const saveAsDocx = async (filename: string, value: Descendant[]) => {
  const doc = await serialize(value);

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const fileSaver = document.createElement('a');
  fileSaver.href = URL.createObjectURL(blob);
  fileSaver.download = filename;
  document.body.appendChild(fileSaver);
  fileSaver.click();
  document.body.removeChild(fileSaver);
};
