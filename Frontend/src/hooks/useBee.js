import { useCallback, useEffect, useMemo, useState } from 'react';
import BeePlugin from '@mailupinc/bee-plugin';
import { useTemplate } from 'context/TemplateContext';
// import { v4 as uuidv4 } from 'uuid';
import { useUser } from 'context/UserContext';

const CLIENT_ID = '0b92bdbe-9202-4050-89e4-4c9ac0467fef';
const CLIENT_SECRET = 'ytP0NM3OXQ3OxNCnutwUhDormETjbIcs3KxweHzaWldSzZ76uCOf';

const useBee = () => {
  const [bee, setBee] = useState();
  // eslint-disable-next-line no-unused-vars
  const { setTemplates, createTemplate } = useTemplate();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleTemplateSave = useCallback(
    (filename, json, html) => {
      // setTemplates((prev) => [
      //   {
      //     id: uuidv4(),
      //     type: 'builder',
      //     heading: 'Checking On',
      //     Subject: 'New Template',
      //     headingTheme: 'info',
      //     body: html,
      //     content: json,
      //   },
      //   ...prev,
      // ]);
      const info = {
        name: 'New Template',
        content: html,
      };
      createTemplate(user.tenant_id, info);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
    // [setTemplates]
  );

  const beeConfig = useMemo(
    () => ({
      uid: 'growtoro',
      container: '',
      language: 'en-US',
      trackChanges: true,
      onSave: (jsonFile, htmlFile) => {
        handleTemplateSave('new-template', JSON.parse(jsonFile), htmlFile);
      },
      onError: (errorMessage) => {
        console.log('onError ', errorMessage);
      },
    }),
    [handleTemplateSave]
  );

  const template = useMemo(
    () => ({
      page: {
        title: '',
        description: '',
        template: {
          name: 'template-base',
          type: 'basic',
          version: '0.0.1',
        },
        body: {
          type: 'mailup-bee-page-proprerties',
          container: {
            style: {
              'background-color': '#FFFFFF',
            },
          },
          content: {
            style: {
              'font-family': "Arial, 'Helvetica Neue', Helvetica, sans-serif",
              color: '#000000',
            },
            computedStyle: {
              linkColor: '#0000FF',
              messageBackgroundColor: 'transparent',
              messageWidth: '500px',
            },
          },
        },
      },
    }),
    []
  );

  const onFetchBeeToken = useCallback(
    (clientId, clientSecret, beeEditor) => beeEditor.getToken(clientId, clientSecret),
    []
  );

  const start = useCallback(
    (container) => {
      bee?.start({ ...beeConfig, container }, template);
    },
    [bee, beeConfig, template]
  );

  const preview = useCallback((_template) => bee?.preview(_template), [bee]);

  useEffect(() => {
    setLoading(true);
    const beeEditor = new BeePlugin();
    onFetchBeeToken(CLIENT_ID, CLIENT_SECRET, beeEditor).then(() => {
      setBee(beeEditor);
      setLoading(false);
    });
  }, [beeConfig, onFetchBeeToken, template]);

  return {
    bee,
    loading,
    start,
    preview,
  };
};

export default useBee;
