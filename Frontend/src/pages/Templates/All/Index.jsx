import { useEffect, useState } from 'react';
import { Box, Chip, Grid, Stack } from '@mui/material';

import { useTemplate } from 'context/TemplateContext';
import { useUser } from 'context/UserContext';

import { modalType } from '_mock/defines';

import Api from 'api/Api';
import { AddButton } from 'components/button/buttons';
import { HeaderTitle } from 'utils/typography';
import Loading from 'components/Loading';
import NewTemplateModal from 'components/modal/templates/NewTemplateModal';
import { LoadingButton } from '@mui/lab';
import EditTemplateModal from 'components/modal/templates/EditTemplateModal';
import BuilderPreview from 'components/modal/templates/BuilderPreview';

import SingleCard from './SingleCard';
// import SearchInput from 'components/input/SearchInput';
// import TemplatesCards from './TemplatesCards';

const Index = () => {
  const [selectedTag, setSelectedTag] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);

  const { user } = useUser();
  const {
    getAllTemplates,
    templates,
    isTemplateLoading,
    paginationModel,
    setPaginationModel,
    setFilterOption,
    tags,
    // filterOption,
  } = useTemplate();

  useEffect(() => {
    getAllTemplates(user?.tenant_id, paginationModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllTemplates, user?.tenant_id, selectedTag]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleTag = (e) => {
    const chipElement = e.currentTarget; // Use currentTarget instead of target
    const value = chipElement.getAttribute('value');

    setPaginationModel((prev) => ({ ...prev, tag: value, page: 0 }));

    setSelectedTag(value);
    setFilterOption(value);
  };

  if (isTemplateLoading.getAllTemplates) {
    return (
      <Box sx={{ width: '100%', height: '150%', display: 'flex' }}>
        <Loading />
      </Box>
    );
  }

  return (
    <>
      <HeaderTitle>Templates</HeaderTitle>

      <Stack direction={{ xs: 'column', md: 'row' }}>
        {/* tags */}
        <Box sx={{ flex: '1', justifyContent: 'center', padding: '.5rem' }}>
          <Chip
            label="All"
            value="all"
            sx={{
              margin: '2px',
              borderRadius: '.3rem',
              cursor: 'pointer',
            }}
            variant={selectedTag === 'all' ? 'filled' : 'outlined'}
            clickable
            onClick={handleTag}
          />

          {tags &&
            tags.map((tag) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                label={tag}
                value={tag}
                sx={{
                  margin: '2px',
                  borderRadius: '.3rem',
                  cursor: 'pointer',
                }}
                variant={selectedTag === tag ? 'filled' : 'outlined'}
                clickable
                onClick={handleTag}
              />
            ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', padding: '.5rem' }}>
          {/* <SearchInput
            placeholder="Search by email or template"
            sx={{ display: 'flex', flex: '1', padding: 0, marginRight: '.3rem' }}
          /> */}
          <AddButton onClick={handleOpen} sx={{ justifyContent: 'center', alignItems: 'center' }} />
        </Box>
        {/* </Stack> */}
      </Stack>

      {templates && <TemplatesCards paginationModel={paginationModel} setPaginationModel={setPaginationModel} />}

      <NewTemplateModal data={{ openModal, handleClose, setOpenModal }} />
    </>
  );
};

const TemplatesCards = () => {
  const { user } = useUser();
  const {
    singleTem,
    rowCount,
    templates,
    isTemplateLoading,
    getMoreTemplates,
    paginationModel,
    setPaginationModel,
    filterOption,
  } = useTemplate();
  const [openModal, setOpenModal] = useState('');

  const [selectedTemplate, setSelectedTemplate] = useState({
    open: false,
    type: null,
    template: null,
  });

  const loadMore = () => {
    setPaginationModel((prev) => ({ ...prev, page: paginationModel.page + 1 }));
    getMoreTemplates(user?.tenant_id, {
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      tag: filterOption,
    });
  };

  const handleSelectedTemplate = (_template) => {
    setSelectedTemplate({
      open: true,
      type: _template.type,
      template: _template,
    });
  };

  // function filterTemplates() {
  //   // Check if filterOption is null or undefined
  //   if (filterOption === null || filterOption === undefined || filterOption === 'all') {
  //     return templates;
  //   }

  //   return templates.filter((template) =>
  //     // Assuming template.tags is an array of tags
  //     // Convert each tag to lowercase and check for case-insensitive inclusion
  //     template?.tags?.some((tag) => tag.toLowerCase() === filterOption.toLowerCase())
  //   );
  // }

  return (
    <Box
      mb="1vh"
      overflow={'auto'}
      sx={{
        height: 'calc(100vh - 220px)',
        // media query
        // '@media (max-height: 1300px)': {
        //   background: 'red',
        //   height: '85vh',
        // },
        // '@media (max-height: 600px)': {
        //   background: 'green',
        //   height: '65vh',
        // },
      }}
    >
      <Grid container spacing={1}>
        {templates.map((template, index) => (
          <Grid item md={3} xs={12} key={index} mb={1}>
            <SingleCard template={template} setOpenModal={setOpenModal} onSelectTemplate={handleSelectedTemplate} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', my: 1 }}>
        {templates.length < rowCount && (
          <LoadingButton loading={isTemplateLoading.loadMore} variant="contained" onClick={loadMore}>
            Show More
          </LoadingButton>
        )}
      </Box>

      {singleTem && (
        <EditTemplateModal
          isOpen={openModal === modalType.EditTemplates}
          onSubmit={() => {}}
          onClose={() => setOpenModal(modalType.Close)}
          setOpenModal={setOpenModal}
        />
      )}

      {selectedTemplate && selectedTemplate.type === 'builder' && selectedTemplate.template && (
        <BuilderPreview
          isOpen={selectedTemplate.open && selectedTemplate.type === 'builder'}
          onClose={() =>
            setSelectedTemplate({
              open: false,
              type: null,
              template: null,
            })
          }
          template={selectedTemplate.template}
        />
      )}
    </Box>
  );
};

export default Index;
