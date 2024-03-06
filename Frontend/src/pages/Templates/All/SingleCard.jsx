import React from 'react';
import copy from 'copy-to-clipboard';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Chip, Divider } from '@mui/material';
import { BiCopy } from 'react-icons/bi';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { useUser } from 'context/UserContext';

import { modalType } from '_mock/defines';
import { useTemplate } from 'context/TemplateContext';
import { useNotification } from 'context/NotificationContext';
import Api from 'api/Api';

const SingleCard = ({ template, setOpenModal }) => {
  const { setSingleTem, setEditAble } = useTemplate();
  const { sendNotification } = useNotification();

  const { user } = useUser();

  const copyToClipboard = (message) => {
    const regex = /(<([^>]+)>)/gi;
    const _mesage = message.replace(regex, '');
    copy(_mesage);
    sendNotification({
      open: true,
      message: 'Copied to Clipboard',
      alert: 'success',
    });
  };

  const handleDeleteTemplate = () => {
    // eslint-disable-next-line no-unreachable
    Api.template
      .removeTemplate(user?.tenant_id, {
        id: template.id,
      })
      .then(() => {
        sendNotification({
          open: true,
          message: 'Template deleted successfully',
          alert: 'warning',
        });
      })
      .finally(() => {
        window.location.reload();

        setOpenModal(false);
      });

    // reload the page

    // onClose();
  };

  return (
    <Box
      sx={{
        height: '100%',
        background: '#FFFFFF',
        boxShadow: '0px 8px 24px rgba(189, 206, 212, 0.25)',
        borderRadius: '10px',
      }}
    >
      <CardContent sx={{ padding: '0 !important' }}>
        {/* subject */}
        <Box sx={{ p: 1, paddingY: 2, height: '70px', overflow: 'hidden' }}>
          <Typography gutterBottom variant="body1" fontWeight={'bold'} component="span">
            {template.subject}
          </Typography>
        </Box>

        <Divider sx={{ border: '1px solid rgba(185, 190, 199, 0.6)' }} />

        <Box
          sx={{ m: '10px', overflow: 'hidden' }}
          // onClick={() => handleSelectTemplate(template)}
        >
          <Box
            className="simple-email-editor"
            dangerouslySetInnerHTML={{ __html: template.content }}
            sx={{ height: '10rem', paddingBottom: '1rem' }}
          />
        </Box>

        <Divider sx={{ border: '1px solid rgba(185, 190, 199, 0.6)' }} />

        <Box
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: {
              sm: 'column',
              lg: 'row',
            },
          }}
        >
          <Box sx={{ p: 1, display: 'flex', flex: '1', flexWrap: 'wrap' }}>
            {template?.tags?.map((tag, key) => (
              <Chip key={key} label={tag} sx={{ margin: '2px', borderRadius: '.3rem' }} clickable />
            ))}
          </Box>

          <Box
            sx={{
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: {
                sm: 'center',
              },
            }}
          >
            <Box
              mx={1}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              <BiCopy
                onClick={() => copyToClipboard(template.content)}
                style={{ fontSize: '25px', marginTop: '5px' }}
              />
            </Box>
            <Box
              component="span"
              onClick={() => {
                setOpenModal(modalType.EditTemplates);
                setSingleTem(template);
                setEditAble(template.id);
              }}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: '15px',
                borderRadius: '50%',
                padding: '5px 10px',
                cursor: 'pointer',
                marginRight: '5px',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <FaRegEdit style={{ margin: '4px 0 0 2px' }} />
            </Box>

            {/* // ! */}

            {template.can_delete === 1 && (
              <Box
                component="span"
                onClick={handleDeleteTemplate}
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '15px',
                  borderRadius: '50%',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <FaTrashAlt style={{ margin: '4px 0 0 2px' }} />
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Box>
  );
};

export default SingleCard;
