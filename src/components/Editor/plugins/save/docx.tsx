import {
  Document,
  Packer,
  HeadingLevel,
  Paragraph,
  TextRun,
  AlignmentType,
  ShadingType,
} from 'docx';
import _ from 'lodash';
import { Descendant, Element } from 'slate';
import { useSlate } from 'slate-react';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin } from '../base';
import { ToolbarItem } from '../types';

const HEADING_MAPPING = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

const ALIGN_MAPPING = {
  start: AlignmentType.START,
  center: AlignmentType.CENTER,
  end: AlignmentType.END,
  justify: AlignmentType.BOTH,
};

const serializeParagraph = (value: Element) => {
  return new Paragraph({
    heading: HEADING_MAPPING[value.heading],
    alignment: ALIGN_MAPPING[value.align],
    indent: value.indent ? { start: value.indent * 2 + 'pc' } : undefined,
    children: value.children.map(
      (x) =>
        new TextRun({
          text: x.text,
          bold: x.bold,
          size: x.fontSize,
          italics: x.italic,
          underline: x.underline ? {} : undefined,
          shading: x.backgroundColor
            ? {
                type: ShadingType.SOLID,
                color: x.backgroundColor,
              }
            : undefined,
          color: x.foregroundColor,
          strike: x.strikethrough,
          superScript: x.superscript,
          subScript: x.subscript,
        }),
    ),
  });
};

const serialize = (value: Descendant[]) => {
  return new Document({
    sections: [
      {
        children: value
          .map((x) => {
            switch (x.type) {
              case 'paragraph':
                return serializeParagraph(x);
            }
            return null;
          })
          .filter((x) => x !== null),
      },
    ],
  });
};

const SaveDocxButton: React.FC = () => {
  const editor = useSlate();

  return (
    <ToolbarButton
      onClick={async () => {
        const doc = serialize(editor.children);

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
      }}
    >
      导出
    </ToolbarButton>
  );
};

export class SaveDocxPlugin extends EditorPlugin {
  key: string = 'save-docx';
  toolbarItem: ToolbarItem = {
    title: '导出为DOCX文档',
    renderReadonly: () => <SaveDocxButton />,
    renderWriteable: () => <SaveDocxButton />,
  };
}
