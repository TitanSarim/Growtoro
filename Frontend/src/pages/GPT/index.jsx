import copy from 'copy-to-clipboard';
import CachedIcon from '@mui/icons-material/Cached';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useEffect, useRef, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { BiCopy } from 'react-icons/bi';
import ThreeDots from './ThreeDots';

const useStyles = makeStyles({
  customButton: {
    background: 'purple',
    color: 'white',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      // backgroundColor: 'transparent !important',
      // backgroundColor: 'secondary.main',
      // color: 'black',
    },
  },

  activeButton: {
    backgroundColor: 'purple', // Apply this style when the button is active
    color: 'white',
  },
});

const GPT = () => {
  const classes = useStyles();
  const chatRef = useRef();
  const { user } = useUser();
  const { sendNotification } = useNotification();

  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [prevInput, setPrevInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    // apiKey: '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',
    apiKey: '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',
  });

  const openai = new OpenAIApi(configuration);

  const options = {
    model: 'gpt-4',
    temperature: 0,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['/'],
  };

  const copyToClipboard = (message) => {
    copy(message);
    sendNotification({
      open: true,
      message: 'Copied to Clipboard',
      alert: 'success',
    });
  };

  async function submit(e) {
    e.preventDefault();
    if (input.length > 0) {
      const newChat = [...chat, { role: 'user', content: `${input}` }];
      setChat(newChat);
      setPrevInput(input);
      setInput('');
      const completeOptions = {
        ...options,
        messages: newChat,
      };
      try {
        setLoading(true);
        const response = await openai.createChatCompletion(completeOptions);
        if (response.data.choices[0].message.content.length > 0)
          setChat([...newChat, response.data.choices[0].message]);
        else console.log('No Response ', response.data.choices[0].message);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleRegenerate = async () => {
    if (chat[chat.length - 1].role === 'assistant' && chat.length > 0) {
      chat.pop();
    }
    const completeOptions = {
      ...options,
      messages: chat,
    };

    try {
      setLoading(true);
      const response = await openai.createChatCompletion(completeOptions);
      if (response.data.choices[0].message.content.length > 0) setChat([...chat, response.data.choices[0].message]);
      else console.log('No Response ', response.data.choices[0].message);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(e);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        {/* response messages */}
        <Grid
          item
          sx={{
            height: { xs: '70vh' },
            width: '100%',
            overflow: 'auto',
            alignItems: 'center',
          }}
          ref={messagesEndRef}
        >
          {chat.length === 0 ? (
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h1" fontWeight="bolder" sx={{ color: '#E2DCDA' }}>
                GrowtoroGPT
              </Typography>
            </Box>
          ) : (
            ''
          )}

          {chat.map((message, index) => (
            <Grid
              container
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 3,
                px: '6%',
                backgroundColor: message.role === 'assistant' ? 'white' : '#f7f7f8',
              }}
              ref={chatRef}
            >
              <Grid
                item
                xs={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  height: '5vh',
                  flexBasis: '3.333333% !important',
                  mr: 3,
                }}
              >
                <div style={{ float: 'left', clear: 'both' }}>
                  {message.role === 'user' ? (
                    <img src={user.user.profile_image} alt="" />
                  ) : (
                    <img src="/assets/icons/Chatgpt.svg" alt="" style={{ background: '#0d8266' }} />
                  )}
                </div>
              </Grid>
              <Grid item xs={10}>
                {message.content
                  .trim()
                  .split('\n')
                  .map((item, key) => (
                    <p key={key} style={{ marginTop: '0', fontSize: '18px' }}>
                      {item}
                    </p>
                  ))}
                {message.role === 'assistant' && (
                  <Box
                    mx={1}
                    sx={{
                      cursor: 'pointer',
                      background: '#E2E1E1',
                      width: '40px',
                      color: 'black',
                      display: 'flex',
                      p: 0.5,
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 0,
                    }}
                  >
                    <BiCopy
                      onClick={() => copyToClipboard(message.content)}
                      style={{ fontSize: '25px', marginTop: '2px' }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          ))}

          {loading ? (
            <Grid
              container
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 4,
                px: '6%',
                // backgroundColor: '#f7f7f8',
              }}
            >
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  height: '5vh',
                  flexBasis: '3.333333% !important',
                  mr: 3,
                }}
              >
                <div style={{ float: 'left', clear: 'both' }}>
                  <img src="/assets/icons/Chatgpt.svg" alt="" style={{ background: '#0d8266' }} />
                </div>
              </Grid>
              <Grid item xs={10}>
                <ThreeDots />
              </Grid>
            </Grid>
          ) : (
            ''
          )}
        </Grid>

        {/* message input */}
        <Grid
          item
          sx={{
            width: '100%',
            height: { xs: '30vh' },
          }}
        >
          <Grid container direction="column" justifyContent={'center'}>
            {/* regenerate button */}
            <Grid item sx={{ textAlign: 'center' }}>
              {prevInput ? (
                <Button
                  sx={{ backgroundColor: '#FFFFFF', my: 2 }}
                  variant="outlined"
                  startIcon={<CachedIcon />}
                  className="growtoro-gpt-regenerate-button"
                  onClick={handleRegenerate}
                >
                  Regenerate Response
                </Button>
              ) : (
                <div style={{ height: '4rem' }}>&nbsp;</div>
              )}
            </Grid>

            {/* input */}
            <Grid item sx={{ width: '70%', margin: '0 auto' }}>
              <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box className="growtoro-gpt-input">
                  {/* message input */}
                  <TextField
                    id="outlined-multiline-flexible"
                    multiline
                    type="text"
                    maxRows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    inputProps={{ style: { width: '94%', padding: 0 } }}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      boxShadow: 12,
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    }}
                  />

                  {/* icon */}
                  <div style={{ position: 'absolute', right: 10 }}>
                    <IconButton
                      type="submit"
                      className={
                        input.length > 0 ? classes.customButton : `${classes.customButton}${classes.activeButton}`
                      }
                    >
                      <SendRoundedIcon sx={{ transform: 'rotate(-45deg)' }} />
                    </IconButton>
                  </div>
                </Box>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default GPT;
