/* eslint-disable react/button-has-type */
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import { Box } from '@mui/material';
import { modalType } from '_mock/defines';
import Picker from 'emoji-picker-react';
import React, { useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill-emoji/dist/quill-emoji.css';
import 'react-quill/dist/quill.snow.css';
import LinkModal from '../../campaign/LinkModal';
import './style.css';

export const formats = [
  'size',
  'font',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];
export const modules = {
  toolbar: {
    container: '#toolbar',
  },
};
const TextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const [openModal, setOpenModal] = useState('');
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [position, setPosition] = useState();

  const Font = Quill.import('formats/font');
  Font.whitelist = ['arial', 'comicsans', 'couriernew', 'georgia', 'helvetica', 'lucida'];
  Quill.register(Font, true);
  const Size = Quill.import('formats/size');
  Size.whitelist = ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '40', '48', '60', '72', '96'];
  Quill.register(Size, true);

  const [picker, setPicker] = useState(false);
  const onEmojiClick = (event) => {
    const { emoji } = event;
    const quill = quillRef.current.getEditor();
    if (quill) {
      const cursorPosition = position;
      if (cursorPosition !== null && cursorPosition !== undefined) {
        quill.insertText(cursorPosition, emoji, 'emoji'); // Insert the emoji at the cursor position
      } else {
        quill.insertText(quill.getLength(), emoji, 'emoji'); // Insert the emoji at the end of the text
      }
      setPicker(false);
    }
  };

  const handleLink = (text, link) => {
    const quill = quillRef.current.getEditor();
    if (position) {
      const cursorPosition = position;
      const urlText = text;

      if (cursorPosition !== null && cursorPosition !== undefined) {
        quill.insertText(cursorPosition, urlText, 'link', link);
      } else {
        quill.insertText(quill.getLength(), urlText, 'link', link);
      }
    }
  };

  const handlePosition = () => {
    const quill = quillRef.current.getEditor();
    if (quill) {
      const cursorPosition = quill.getSelection()?.index;
      setPosition(cursorPosition);
    }
  };

  const handlePositionLink = () => {
    const quill = quillRef.current.getEditor();
    if (quill) {
      const cursorPosition = quill.getSelection()?.index;
      setPosition(cursorPosition);
      const range = quill.getSelection();
      if (range) {
        const selectedText = quill.getText(range.index, range.length);
        quill.deleteText(range.index, range.length);
        setText(selectedText);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const colors = Array.from(
    new Set([
      '#000000',
      '#FF3F8E',
      '#FF8F7D',
      '#FFC970',
      '#FFEE70',
      '#C1FF70',
      '#6BFF70',
      '#70FFA2',
      '#70FFEE',
      '#70C9FF',
      '#7091FF',
      '#956CFF',
      '#C56CFF',
      '#FF6CFF',
      '#FF6CC4',
      '#FF6C8A',
      '#FF6C6C',
      '#000033',
      '#000066',
      '#000099',
      '#0000CC',
      '#0000FF',
      '#330033',
      '#330066',
      '#330099',
      '#3300CC',
      '#3300FF',
      '#660000',
      '#660033',
      '#660066',
      '#660099',
      '#6600CC',
      '#6600FF',
      '#990000',
      '#990033',
      '#990066',
      '#990099',
      '#9900CC',
      '#9900FF',
      '#CC0000',
      '#CC0033',
      '#CC0066',
      '#CC0099',
      '#CC00CC',
      '#CC00FF',
      '#333366',
      '#333399',
      '#3333CC',
      '#3333FF',
      '#666666',
      '#666699',
      '#6666CC',
      '#6666FF',
      '#999999',
      '#9999CC',
      '#9999FF',
      '#CCCCCC',
      '#CCCCFF',
      '#333333',
      '#333366',
      '#333399',
      '#3333CC',
      '#3333FF',
      '#666666',
      '#666699',
      '#6666CC',
      '#6666FF',
      '#999999',
      '#9999CC',
      '#9999FF',
      '#CCCCCC',
      '#CCCCFF',
      '#336699',
      '#3366CC',
      '#3366FF',
      '#6699CC',
      '#6699FF',
      '#66CCFF',
      '#336699',
      '#3366CC',
      '#3366FF',
      '#6699CC',
      '#6699FF',
      '#66CCFF',
      '#663399',
      '#CC0000',
      '#CC0033',
      '#CC0066',
      '#CC0099',
      '#CC00CC',
      '#CC00FF',
      '#003300',
      '#003333',
      '#006600',
      '#006633',
      '#006666',
      '#006699',
      '#009900',
      '#009933',
      '#009966',
      '#009999',
      '#0099CC',
      '#0099FF',
    ])
  );

  return (
    <Box sx={{ height: '100%' }}>
      <div id="toolbar" style={{ display: 'flex', width: '100%', height: '10%', gap: '5px' }}>
        {/* <select className="ql-size" size={7} style={{ width: '50px' }} className="dev">
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18" selected>
            18
          </option>
          <option value="20">20</option>
          <option value="24">24</option>
          <option value="30">30</option>
          <option value="36">36</option>
          <option value="40">40</option>
          <option value="48">48</option>
          <option value="60">60</option>
          <option value="72">72</option>
          <option value="96">96</option>
        </select> */}
        <select className="ql-font" value={'arial'} id="ql-font-family">
          <option value="arial">Arial</option>
          <option value="comicsans">Comic Sans</option>
          <option value="couriernew">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="lucida">Lucida</option>
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        {/* <select className="ql-color">
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select> */}
        <button
          onClick={() => {
            setOpenModal(modalType.links);
            setText('');
            setLink('');
            handlePositionLink();
          }}
        >
          <InsertLinkIcon sx={{ width: '20px', height: '20px' }} />
        </button>
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button
          onClick={() => {
            setPicker(!picker);
            handlePosition();
          }}
        >
          <SentimentSatisfiedOutlinedIcon sx={{ width: '20px', height: '20px' }} />
        </button>
        {picker && (
          <div className="picker-container" style={{ zIndex: 10 }}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <button
          onClick={() => {
            setOpenModal(modalType.links);
            setText('Click here to unsubscribe');
            setLink('#unsubscribe');
            handlePosition();
          }}
        >
          <PersonRemoveIcon sx={{ width: '20px', height: '20px' }} />
        </button>
      </div>
      {/* onBlur={(previousRange, source, editor) => handleChange(editor.getHTML())} */}
      <div style={{ height: '90%' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value.body}
          onChange={(value) => onChange('body', value)}
          modules={modules}
          style={{ background: 'white', height: '100%' }}
          formats={formats}
        />
      </div>
      <LinkModal
        isOpen={openModal === modalType.links}
        setOpenModal={setOpenModal}
        onSubmit={handleLink}
        onClose={() => setOpenModal(modalType.Close)}
        link={link}
        setLink={setLink}
        text={text}
        setText={setText}
      />
    </Box>
  );
};

export default React.memo(TextEditor);
