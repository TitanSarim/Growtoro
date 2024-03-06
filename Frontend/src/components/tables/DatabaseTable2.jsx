import { Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const datas = [
  {
    id: 1,
    names: 'Andrew Johnson',
    titles: 'HR Operations Manager',
    company: 'Uniqlo',
    email: 'test@gmail.com',
    location: 'London, United Kingdom',
    phone: '(516) 234-3456',
  },
  {
    id: 2,
    names: 'Andrew Johnson',
    titles: 'HR Operations Manager',
    company: 'Uniqlo',
    email: 'test@gmail.com',
    location: 'London, United Kingdom',
    phone: '(516) 234-3456',
  },
  {
    id: 3,
    names: 'Andrew Johnson',
    titles: 'HR Operations Manager',
    company: 'Uniqlo',
    email: 'test@gmail.com',
    location: 'London, United Kingdom',
    phone: '(516) 234-3456',
  },
  {
    id: 4,
    names: 'Andrew Johnson',
    titles: 'HR Operations Manager',
    company: 'Uniqlo',
    email: 'test@gmail.com',
    location: 'London, United Kingdom',
    phone: '(516) 234-3456',
  },
  {
    id: 5,
    names: 'Andrew Johnson',
    titles: 'HR Operations Manager',
    company: 'Uniqlo',
    email: 'test@gmail.com',
    location: 'London, United Kingdom',
    phone: '(516) 234-3456',
  },
];

export const header = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Titles', key: 'titles' },
  { label: 'Company', key: 'company' },
  { label: 'Email', key: 'email' },
  { label: 'Location', key: 'location' },
  { label: 'Phone', key: 'phone' },
];

export default function DatabaseTable2({ height, numOfRow }) {
  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'names',
      headerName: 'Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'titles', headerName: 'Titles', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      // format: (value) => value.toLocaleString('en-US'),
    },
    {
      field: 'location',
      headerName: 'Contact Location',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      // format: (value) => value.toFixed(2),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  const rows = datas.map((row) => ({
    id: row.id,
    names: row.names,
    titles: row.titles,
    company: row.company,
    email: row.email,
    location: row.location,
    phone: row.phone,
  }));

  return (
    <Card sx={{ height: { height }, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: numOfRow,
            },
          },
        }}
        columnVisibilityModel={{
          id: false,
        }}
        pageSizeOptions={[numOfRow]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Card>
  );
}
