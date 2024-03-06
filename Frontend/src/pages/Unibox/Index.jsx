import React, { useRef, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  Tooltip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { BiCopy } from 'react-icons/bi';
import { LoadingButton } from '@mui/lab';
import { CgMailForward } from 'react-icons/cg';
import { MdOutlineMarkAsUnread } from 'react-icons/md';

import copy from 'copy-to-clipboard';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

import { useUser } from 'context/UserContext';
import { useNotification } from 'context/NotificationContext';

import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import Loading from 'components/Loading';
import RemoveLead from './RemoveLoad';
import Forward from './Forward';
import Reply from './Reply';

export default function Index() {
  const { user, setUnread } = useUser();
  const { sendNotification } = useNotification();
  const theme = useTheme();

  const rightContainer = useRef(null);

  const [isLoading, setIsLoading] = useState({ getunibox: true, showMore: true });
  const [replyForward, setReplyForward] = useState(false);
  const [messages, setMessages] = useState([]);

  console.log("messages", messages)

  const [detail, setDetail] = useState({
    messageDetail: '',
    userDetail: '',
  });

  const [filter, setFilter] = useState({
    status: 'all',
    searchByEmail: '',
    filteredMessage: [],

    page: 0,
    hasMoreData: false,
    // pageSize: 3,
  });

  // initial fetch
  useEffect(() => {
    getUnibox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // !filter by status
  useEffect(() => {
    if (filter.status === 'all') {
      setFilter((prev) => ({ ...prev, filteredMessage: messages }));
    } else {
      const newArray = messages.filter((item) => {
        if (item.lead_status === filter.status) {
          return true;
        }

        return false;
      });

      setFilter((prev) => ({ ...prev, filteredMessage: newArray }));
    }
  }, [filter.status, messages]);

  // !filter by email
  useEffect(() => {
    if (filter.searchByEmail === '') {
      Api.unibox
        .getUnibox(user?.tenant_id, {
          page: filter.page,
        })
        .then((response) => {
          setMessages(response?.data?.replies);
          setFilter((prev) => ({
            ...prev,
            hasMoreData: response?.data?.has_more_data,
          }));
        });
    } else {
      setFilter((prev) => ({ ...prev, page: 0 }));

      Api.unibox
        .getUniboxByEmail(user?.tenant_id, {
          q: filter.searchByEmail,
          page: filter.page,
        })
        .then((response) => {
          setMessages(response?.data?.replies);
          setFilter((prev) => ({ ...prev, hasMoreData: response?.data?.has_more_data }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.searchByEmail]);

  const ReadUnread = (message, _value) => {
    Api.unibox
      .readUnread(user?.tenant_id, { id: message.id, value: _value, email: message.email })
      .then((response) => {
        setDetail({ messageDetail: response.data, userDetail: message });
        const newArray = messages?.map((item) => {
          if (item.id === message.id) {
            return { ...item, status: _value };
          }
          return item;
        });
        setMessages(newArray);
        unreadEmail();

        // let _status = 0;
        // newArray.forEach((item) => {
        //   if (item.status === 0) {
        //     _status += 1;
        //   }
        // });
        // setUnread(_status);
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      });
  };

  const getUnibox = () => {
    setIsLoading((prev) => ({ ...prev, getunibox: true }));
    Api.unibox
      .getUnibox(user?.tenant_id, {
        page: filter.page,
      })
      .then((response) => {
        setMessages(response?.data?.replies);
        setFilter((prev) => ({
          ...prev,
          hasMoreData: response.data?.has_more_data,
        }));
        // setValue2(response.data.replies[0]?.lead_status);
      })
      .catch(() => {
        // ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, getunibox: false }));
      });
  };

  const copyToClipboard = (message) => {
    copy(message);
    sendNotification({
      open: true,
      message: 'Copied!',
      alert: 'success',
    });
  };

  const handleFilterChange = (value) => {
    setFilter((prev) => ({ ...prev, status: value }));
  };

  const handleLeadStatus = (event) => {
    if (!user?.tenant_id || !detail.messageDetail?.id) {
      sendNotification({
        open: true,
        message: 'Something went wrong',
        alert: 'error',
      });
      return;
    }

    Api.unibox
      .leadStatus(user?.tenant_id, { id: detail.messageDetail.id, status: event.target.value })
      .then((res) => {
        sendNotification({
          open: true,
          message: res.data.message,
          alert: 'success',
        });

        setDetail((prev) => ({ ...prev, userDetail: { ...prev.messageDetail, lead_status: event.target.value } }));
        setMessages((prev) => {
          const newArray = prev?.map((item) => {
            if (item.id === detail.userDetail.id) {
              return { ...item, lead_status: event.target.value };
            }
            return item;
          });
          return newArray;
        });

        // setValue({ name: 'all', data: updatedArray });
      })
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  const handleDelete = (id) => {
    if (!id || !user?.tenant_id) {
      sendNotification({
        open: true,
        message: 'Something went wrong',
        alert: 'error',
      });
      return;
    }

    Api.unibox
      .uniboxDelete(user?.tenant_id, id)
      .then((res) => {
        sendNotification({
          open: true,
          message: res.data?.message,
          alert: 'success',
        });

        setDetail({ messageDetail: '', userDetail: '' });
        getUnibox();
      })
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  const unreadEmail = () => {
    Api.unibox
      .unreadMail(user?.tenant_id)
      .then((res) => {
        setUnread(res.data.unread_replies);
      })
      .catch((e) => ErrorHandling({ e, sendNotification }));
  };

  const sendEmail = (data) => {
    setIsLoading((prev) => ({ ...prev, sendMail: true }));
    Api.unibox
      .sendMail(user?.tenant_id, data)
      .then((res) => {
        sendNotification({
          open: true,
          message: res.data.success,
          alert: 'success',
        });
        setDetail((prev) => ({ ...prev, messageDetail: res.data }));
        setReplyForward(false);
      })
      .catch((e) => {
        ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, sendMail: false }));
      });
  };

  const handleShowMore = () => {
    setIsLoading((prev) => ({ ...prev, showMore: true }));
    Api.unibox
      .getUnibox(user?.tenant_id, {
        page: filter.page + 1,
        // pageSize: filter.pageSize,
      })
      .then((response) => {
        setMessages((prev) => [...prev, ...response?.data?.replies]);
        setFilter((prev) => ({ ...prev, page: filter.page + 1, hasMoreData: response?.data?.has_more_data }));
      })
      .catch(() => {
        // ErrorHandling({ e, sendNotification });
      })
      .finally(() => {
        setIsLoading((prev) => ({ ...prev, showMore: false }));
      });
  };

  const infoTitle = (
    <Box display="flex" alignItems="center">
      <BiCopy
        sx={{
          border: '2px solid red',
          display: 'flex',
          cursor: 'pointer',
        }}
        onClick={() => copyToClipboard(detail.messageDetail?.emails[0]?.email)}
        style={{ fontSize: '25px', marginTop: '5px', color: 'primary.light', cursor: 'pointer' }}
      />
      {/* <Typography>{true ? 'Copied!' : 'Copy'}</Typography> */}
      <Box flexGrow={1} />
      <Typography>{detail.messageDetail && detail.messageDetail?.emails[0]?.email}</Typography>
    </Box>
  );

  if (isLoading.getunibox) return <Loading />;

  return (
    <>
      <Typography variant="h4">All Inboxes</Typography>
      <Grid
        container
        sx={{
          height: 'calc(100vh - 125px)',
        }}
      >
        {/* left */}
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            height: 'calc(100vh - 126px)',
            overflow: 'auto',
          }}
        >
          {/* search */}
          <Box mb={1} p={1} bgcolor={'white'} borderRadius={2}>
            <Box sx={{}}>
              <TextField
                size="small"
                sx={{
                  fontSize: 1,
                  '& input::placeholder': {
                    fontSize: '16px',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src="/assets/images/loupe1.png" alt="search" height="20px" width="25px" />
                    </InputAdornment>
                  ),
                }}
                placeholder={'Search by email'}
                value={filter.searchByEmail}
                onChange={(e) => setFilter((prev) => ({ ...prev, searchByEmail: e.target.value }))}
                fullWidth
              />
            </Box>
          </Box>

          {/* status  */}
          <Box mb={1} p={1} bgcolor={'white'} borderRadius={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <FilterAltSharpIcon sx={{ height: '1.5rem', width: '1.5rem' }} />
              <Typography fontSize={'18px'}>Status</Typography>
            </Box>
          </Box>

          {/* filter */}
          <Box mb={1} p={1}>
            <Select
              // mb={1}
              // p={1}
              sx={{
                // padding: "1px",
                // margin: "10px",
                boxSizing: 'border-box',
              }}
              size="small"
              value={filter.status || 'all'}
              onChange={(e) => handleFilterChange(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value={'all'}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                  <img src="/assets/images/lead.png" alt="icon" style={{ marginRight: '9px', height: 18, width: 18 }} />
                  All
                </Grid>
              </MenuItem>
              {status?.map((obj, index) => (
                <MenuItem value={obj.value} key={index}>
                  <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                    <img src={obj.img} alt="icon" style={{ marginRight: '9px', height: 18, width: 18 }} />
                    {obj.name}
                  </Grid>
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* messages */}
          <Box
            sx={{
              height: 'calc(100vh - 306px)',
              overflow: 'auto',
            }}
          >
            {filter.filteredMessage?.map((message, index) => (
              <Box
                key={index}
                onClick={() => {
                  ReadUnread(message, 1);
                  setTimeout(() => {
                    rightContainer.current.scrollTo(0, 0);
                  }, 1000);
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem',
                  paddingBottom: '2rem',
                  cursor: 'pointer',
                  backgroundColor: detail.userDetail?.id === message.id ? theme.palette.grey[300] : null,

                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                  },
                }}
              >
                {/* icon/email/date  */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.3rem',
                  }}
                >
                  <Box
                    className="dev"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <img
                      src={`/assets/images/${message.lead_status}.png`}
                      alt="icon"
                      style={{ marginRight: '9px', height: 18, width: 18 }}
                      // className="dev"
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: message.status === 0 ? '800' : '',
                        color: message.status === 0 ? 'rgb(85, 26, 139)' : 'rgb(139, 139, 139)',
                      }}
                    >
                      {message.email}
                    </Typography>
                  </Box>

                  <Typography color={'#7C828D'} fontSize={'14px'} title={message.date}>
                    {formatDateStringForChat(message.date)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginBottom: '0.5rem',
                    fontWeight: message.status === 0 ? '800' : '',
                    color: message.status === 0 ? 'rgb(85, 26, 139)' : 'rgb(139, 139, 139)',
                  }}
                >
                  {message.Re}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: message.status === 0 ? '800' : '',
                    color: message.status === 0 ? 'rgb(85, 26, 139)' : 'rgb(139, 139, 139)',
                  }}
                >
                  {truncateString(extractTextFromHtml(message.emailBody))}
                  {/* {extractTextFromHtml(message.emailBody)} */}
                </Typography>
              </Box>
            ))}

            {/* show more */}
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              {filter.hasMoreData && (
                <LoadingButton loading={isLoading.showMore} variant="contained" onClick={handleShowMore}>
                  Show More
                </LoadingButton>
              )}
            </Box>
          </Box>
        </Grid>

        {/* right */}
        <Grid
          item
          md={8}
          xs={12}
          sx={{
            height: 'calc(100vh - 126px)',
            overflow: 'auto',
            paddingBottom: '3rem',
            backgroundColor:"white"
          }}
          ref={rightContainer}
        >
          {/* topbar */}
          {detail.messageDetail && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                background: 'white',
                zIndex: 999,
              }}
            >
              {/* left top bar */}
              <Box
                display={'flex'}
                alignItems={'flex-start'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {replyForward === false ? (
                  <>
                    <Tooltip title="Reply" arrow>
                      <IconButton
                        component={'span'}
                        onClick={() => {
                          setReplyForward('reply');
                        }}
                      >
                        <CgMailForward style={{ transform: 'scaleX(-1)', fontSize: '30px', cursor: 'pointer' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Forward" arrow>
                      <IconButton
                        component={'span'}
                        onClick={() => {
                          setReplyForward('forward');
                        }}
                      >
                        <CgMailForward style={{ fontSize: '30px', cursor: 'pointer' }} />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="Close" arrow>
                    <IconButton
                      onClick={() => {
                        setReplyForward(false);
                      }}
                    >
                      <CloseIcon style={{ fontSize: '30px', cursor: 'pointer' }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* <button type="button">Back</button> */}
                {/* <button type="button">Forward</button> */}

                {/* status dropdown */}

                <Select
                  // mb={1}
                  // p={1}
                  sx={{
                    // padding: "1px",
                    // margin: "10px",
                    boxSizing: 'border-box',
                  }}
                  size="small"
                  value={detail.userDetail?.lead_status}
                  onChange={(e) => handleLeadStatus(e)}
                  displayEmpty
                  fullWidth
                >
                  {status?.map((obj, index) => (
                    <MenuItem value={obj.value} key={index}>
                      <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                        <img src={obj.img} alt="icon" style={{ marginRight: '9px', height: 18, width: 18 }} />
                        {obj.name}
                      </Grid>
                    </MenuItem>
                  ))}

                  {/* {[].map((obj, index) => (
                <MenuItem value={obj.value} key={index}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <img
                      src={obj.img}
                      alt="icon"
                      style={{ marginRight: "9px", height: 18, width: 18 }}
                    />
                    {obj.name}
                  </Grid>
                </MenuItem>
              ))} */}
                </Select>
              </Box>

              {/* right top bar  */}
              <Box alignItems={'flex-end'}>
                <Tooltip title={infoTitle} arrow>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={() => handleDelete(detail.messageDetail?.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Mark as unread" arrow>
                  <IconButton onClick={() => ReadUnread(detail.userDetail, 0)}>
                    <MdOutlineMarkAsUnread />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Forward lead" arrow>
                  <IconButton
                    // onClick={handleClick}
                    onClick={() => {
                      setReplyForward('forward');
                    }}
                    // aria-controls={isOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    // aria-expanded={isOpen ? 'true' : undefined}
                  >
                    <DriveFileMoveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove lead" arrow>
                  <IconButton
                    onClick={() => {
                      setReplyForward('remove_lead');
                    }}
                  >
                    <PersonOffIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {replyForward === 'reply' && (
            <Reply
              onSubmit={sendEmail}
              onClose={() => setReplyForward(false)}
              userDetail={detail.userDetail}
              messageDetail={detail.messageDetail}
              isLoading={isLoading}
            />
          )}
          {replyForward === 'forward' && (
            <Forward
              onSubmit={sendEmail}
              onClose={() => setReplyForward(false)}
              messageDetail={detail.messageDetail}
              isLoading={isLoading}
            />
          )}

          {/* message */}
          <Box>{detail?.messageDetail && <MessageDetails messageDetail={detail.messageDetail?.emails} />}</Box>
        </Grid>

        <RemoveLead
          isOpen={replyForward === 'remove_lead'}
          setOpenModal={setReplyForward}
          onSubmit={() => {}}
          onClose={() => {
            setReplyForward(false);
          }}
          messageDetail={detail.messageDetail}
          to="tarrabayley@growtoro.com"
        />
      </Grid>
    </>
  );
}

function MessageDetails({ messageDetail }) {
  const [_messageDetail, _setMessageDetail] = useState('');

  console.log("_messageDetail", _messageDetail)

  useEffect(() => {
    const newData = messageDetail?.map((item) => {
      const formattedHTML = item.emailBody.replace(/\\n/g, '<br/>');
      const str = formattedHTML.replace(/<!--(?!>)[\S\s]*?-->/g, '');
      return { ...item, emailBody: str };
    });
    _setMessageDetail(newData);
  }, [messageDetail]);

  return (
    <Box bgcolor={'white'} height={'100vh'}>
      {_messageDetail &&
        _messageDetail?.map((message, index) => (
          <React.Fragment key={index}>
            <Box
              style={{
                padding: '2rem 1rem',
                display: 'flex',
              }}
            >
              <Box>
                <Avatar
                  sx={{
                    backgroundColor: `${message.avatarBg}.main`,
                    mr: 2,
                    color: 'light',
                  }}
                >
                  {message.avatarCapital}
                </Avatar>
              </Box>
              <Box
                style={{
                  flex: 1,
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  {message.email}
                  {/* john@example.com */}
                </Typography>
                <Typography>
                  {/* rernjnsjnfjsfn */}
                  {message.Re}
                </Typography>
                <Typography>To: {message.to_email}</Typography>
                {/* {message.cc && <Typography>cc: {message.cc}</Typography>}
          {message.bcc && <Typography>bcc: {message.bcc}</Typography>} */}
              </Box>
              <Box>
                <Typography color={'#7C828D'} fontSize={'14px'} textAlign="end">
                  {message.body_date}
                  {/* Fri, Aug 25, 2023 06:24 AM */}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              {/* eslint-disable-next-line react/no-danger, react/self-closing-comp */}

              {/* <IframeResizer
                srcDoc={message.emailBody}
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                scrolling="no"
                allowFullScreen
              /> */}

              <div
                style={{
                  padding: '1rem',
                }}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: manuallyHandleMessageBody(message.emailBody),
                }}
              />
              <div style={{"display": "flex", "alignItems": "center", "justifyContent": "center", "listStyle": "none"}}>
                {message.attachments === null ? "" : (
                  <ul style={{"listStyle": "none"}}>
                    {message.attachments?.map((attachment, index) => {
                        const fileExtension = attachment.split('.').pop();

                        return (
                          <li key={index} style={{"display":"flex", "alignItems":"center", "justifyContent":"center", "flexDirection":"column","border": "1px solid #999997","borderRadius":"4px", "color": "black", "textDecoration": "none", "padding": "4px 6px", "width": "80px"}}>
                            <a href={`https://services.growtoro.com/${attachment}`} target="_blank" rel="noreferrer" download={attachment} 
                              style={{"color": "black", "textDecoration": "none",}}
                            >
                              <img src={`https://services.growtoro.com/${attachment}`} alt='imgaes' width={25}/>
                              {`.${fileExtension}..`}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                )}
              </div>
            </Box>
          </React.Fragment>
        ))}

      {/* message */}
    </Box>
  );
}

function manuallyHandleMessageBody(content) {
  const withoutBootstrapLink = removeBootstrapLink(content);
  const withoutStyleTags = removeStyleTags(withoutBootstrapLink);

  return withoutStyleTags;
}

function removeBootstrapLink(content) {
  const withoutBootstrapLink = content.replace(
    /<link\s+rel="stylesheet"\s+href="http:\/\/services.growtoro.com\/assets\/dashboard\/dist\/css\/bootstrap\.min\.css">/g,
    ''
  );
  return withoutBootstrapLink;
}

function removeStyleTags(content) {
  const withoutStyles = content.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/g, '');
  return withoutStyles;
}

function truncateString(str, num = 80) {
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
}

function extractTextFromHtml(htmlString) {
  // Replace <br> or <br/> with a space
  const modifiedHtmlString = htmlString.replace(/<br\s*\/?>/g, ' ');

  const parser = new DOMParser();
  const doc = parser.parseFromString(modifiedHtmlString, 'text/html');
  const textContent = doc.body.textContent || '';

  return textContent;
}
// const extractedText = extractTextFromHtml(yourHtmlString);
// console.log(extractedText);

function formatDateStringForChat(input) {
  const date = new Date(input);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export const status = [
  {
    img: '/assets/images/lead.png',
    name: 'Leads',
    value: 'lead',
  },
  {
    img: '/assets/images/hot_lead.png',
    name: 'Hot Lead',
    value: 'hot_lead',
  },
  {
    img: '/assets/images/interested.png',
    name: 'Interested',
    value: 'interested',
  },
  {
    img: '/assets/images/not_interested.png',
    name: 'Not Interested',
    value: 'not_interested',
  },
  {
    img: '/assets/images/out_or_away.png',
    name: 'Out or Away',
    value: 'out_or_away',
  },
  {
    img: '/assets/images/do_not_contact.png',
    name: 'Do not contact',
    value: 'do_not_contact',
  },
  {
    img: '/assets/images/sale.png',
    name: 'Sale',
    value: 'sale',
  },
  {
    img: '/assets/images/wrong_person.png',
    name: 'Wrong Person',
    value: 'wrong_person',
  },
];
