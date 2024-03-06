import Api from 'api/Api';
import { createContext, useCallback, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';

const TemplateContext = createContext();

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({ children }) => {
  const { sendNotification } = useNotification();

  const [singleTem, setSingleTem] = useState({});
  const [message, setMessage] = useState();
  const [isTemplateLoading, setIsTemplateLoading] = useState([]);

  const [editAble, setEditAble] = useState();
  const [templates, setTemplates] = useState([]);
  const [filterOption, setFilterOption] = useState('all');

  const [rowCount, setRowCount] = useState(0);
  const [tags, setTags] = useState([]); // ['tag1', 'tag2', 'tag3'
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 8,
    q: '',
    tag: '',
  });

  const onNewTemplateInputChange = (_updatedValues) => {
    setSingleTem(_updatedValues);
  };

  const getAllTemplates = useCallback((credential, params) => {
    setIsTemplateLoading((prev) => ({ ...prev, getAllTemplates: true }));
    Api.template
      .getAllTemplates(credential, params)
      .then((response) => {
        const data = response.data.data.map((element) => {
          element.tags = JSON.parse(element.tags);
          return element;
        });
        setTags(response.data.tags);
        setTemplates(data);
        setRowCount(response.data.total_rows);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsTemplateLoading((prev) => ({ ...prev, getAllTemplates: false }));
      });
  }, []);

  const getMoreTemplates = useCallback((credential, params) => {
    setIsTemplateLoading((prev) => ({ ...prev, loadMore: true }));
    Api.template
      .getAllTemplates(credential, params)
      .then((response) => {
        const data = response.data.data.map((element) => {
          element.tags = JSON.parse(element.tags);
          return element;
        });
        setTemplates((prev) => [...prev, ...data]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsTemplateLoading((prev) => ({ ...prev, loadMore: false }));
      });
  }, []);

  const createTemplate = (tenantId, params) => {
    setIsTemplateLoading((prev) => ({ ...prev, createTemplate: true }));
    Api.template
      .createTemplate(tenantId, params)
      .then(() => {
        getAllTemplates(tenantId, {
          page: 0,
          pageSize: 8,
        });
        sendNotification({
          open: true,
          message: 'Template Created',
          alert: 'success',
        });
        setMessage('Success');
      })
      .catch((e) => {
        sendNotification({
          open: true,
          message: e.message,
          alert: 'error',
        });
        setMessage('Error');
      })
      .finally(() => {
        setIsTemplateLoading((prev) => ({ ...prev, createTemplate: false }));
      });
  };

  const updateTemplate = (tenantId, params) => {
    setIsTemplateLoading((prev) => ({ ...prev, updateTemplate: true }));
    Api.template
      .updateTemplate(tenantId, params)
      .then(() => {
        getAllTemplates(tenantId, {
          page: 0,
          pageSize: 8 * paginationModel.page,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsTemplateLoading((prev) => ({ ...prev, updateTemplate: false }));
      });
  };

  const value = {
    templates,
    tags,
    setTags,
    setTemplates,
    filterOption,
    setFilterOption,
    singleTem,
    setSingleTem,
    onNewTemplateInputChange,
    getAllTemplates,
    createTemplate,
    updateTemplate,
    isTemplateLoading,
    editAble,
    setEditAble,
    message,
    rowCount,
    getMoreTemplates,
    paginationModel,
    setPaginationModel,
  };

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
