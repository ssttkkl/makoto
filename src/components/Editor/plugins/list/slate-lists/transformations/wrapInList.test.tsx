/** @jsx jsx */

import {
  Anchor,
  Divider,
  Editor,
  Focus,
  jsx,
  ListItem,
  ListItemText,
  Paragraph,
  Text,
  UnorderedList,
} from '../jsx';
import type { ListsEditor } from '../types';
import { ListType } from '../types';

import { wrapInList } from './wrapInList';

describe('wrapInList - no selection', () => {
  it('Does nothing when there is no selection', () => {
    const editor = (
      <Editor>
        <Paragraph>
          <Text>aaa</Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>bbb</Text>
        </Paragraph>
      </Editor>
    ) as unknown as ListsEditor;

    const expected = (
      <Editor>
        <Paragraph>
          <Text>aaa</Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>bbb</Text>
        </Paragraph>
      </Editor>
    ) as unknown as ListsEditor;

    wrapInList(editor, ListType.UNORDERED);

    expect(editor.children).toEqual(expected.children);
    expect(editor.selection).toEqual(expected.selection);
  });
});

describe('wrapInList - selection with wrappable nodes', () => {
  it('Converts wrappable node into list', () => {
    const editor = (
      <Editor>
        <Paragraph>
          <Text>
            <Anchor />
            aaa
            <Focus />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as ListsEditor;

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Anchor />
                aaa
                <Focus />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as ListsEditor;

    wrapInList(editor, ListType.UNORDERED);

    expect(editor.children).toEqual(expected.children);
    expect(editor.selection).toEqual(expected.selection);
  });
});

describe('wrapInList - selection with lists and wrappable nodes', () => {
  it('Converts wrappable nodes into lists items and merges them together', () => {
    const editor = (
      <Editor>
        <Paragraph>
          <Text>
            <Anchor />
            aaa
          </Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            bbb
            <Focus />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as ListsEditor;

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Anchor />
                aaa
              </Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                bbb
                <Focus />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as ListsEditor;

    wrapInList(editor, ListType.UNORDERED);

    expect(editor.children).toEqual(expected.children);
    expect(editor.selection).toEqual(expected.selection);
  });
});

describe('wrapInList - selection with lists, wrappable & unwrappable nodes', () => {
  it('Converts wrappable nodes into lists items and merges them together, but leaves out unwrappable nodes', () => {
    const editor = (
      <Editor>
        <Paragraph>
          <Text>
            <Anchor />
            aaa
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>bbb</Text>
        </Paragraph>
        <Divider>
          <Text>
            ccc
            <Focus />
          </Text>
        </Divider>
      </Editor>
    ) as unknown as ListsEditor;

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Anchor />
                aaa
              </Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>bbb</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Divider>
          <Text>
            ccc
            <Focus />
          </Text>
        </Divider>
      </Editor>
    ) as unknown as ListsEditor;

    wrapInList(editor, ListType.UNORDERED);

    expect(editor.children).toEqual(expected.children);
    expect(editor.selection).toEqual(expected.selection);
  });
});
