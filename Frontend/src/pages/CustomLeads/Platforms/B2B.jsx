import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import Api from 'api/Api';
import ErrorHandling from 'utils/ErrorHandling';
import FaqModal from 'components/modal/customLeads/FaqModal';
import { useNotification } from 'context/NotificationContext';
import { useUser } from 'context/UserContext';
import { useState } from 'react';



const options = ['0.1M', '0.5M', '1M', '5M', '10M', '25M', '50M', '100M', '500M', '1B', '5B', '10B'];

const industry = [
  "Accounting",
  "Airlines/Aviation",
  "Alternative Dispute Resolution",
  "Alternative Medicine",
  "Animation",
  "Apparel & Fashion",
  "Architecture & Planning",
  "Arts & Crafts",
  "Automotive",
  "Aviation & Aerospace",
  "Banking",
  "Biotechnology",
  "Broadcast Media",
  "Building Materials",
  "Business Supplies & Equipment",
  "Capital Markets",
  "Chemicals",
  "Civic & Social Organization",
  "Civil Engineering",
  "Commercial Real Estate",
  "Computer & Network Security",
  "Computer Games",
  "Computer Hardware",
  "Computer Networking",
  "Computer Software",
  "Construction",
  "Consumer Electronics",
  "Consumer Goods",
  "Consumer Services",
  "Cosmetics",
  "Dairy",
  "Defense & Space",
  "Design",
  "Education Management",
  "E-learning",
  "Electrical & Electronic Manufacturing",
  "Entertainment",
  "Environmental Services",
  "Events Services",
  "Executive Office",
  "Facilities Services",
  "Farming",
  "Financial Services",
  "Fine Art",
  "Fishery",
  "Food & Beverages",
  "Food Production",
  "Fundraising",
  "Furniture",
  "Gambling & Casinos",
  "Glass, Ceramics & Concrete",
  "Government Administration",
  "Government Relations",
  "Graphic Design",
  "Health, Wellness & Fitness",
  "Higher Education",
  "Hospital & Health Care",
  "Hospitality",
  "Human Resources",
  "Import & Export",
  "Individual & Family Services",
  "Industrial Automation",
  "Information Services",
  "Information Technology & Services",
  "Insurance",
  "International Affairs",
  "International Trade & Development",
  "Internet",
  "Investment Banking/Venture",
  "Investment Management",
  "Judiciary",
  "Law Enforcement",
  "Law Practice",
  "Legal Services",
  "Legislative Office",
  "Leisure & Travel",
  "Libraries",
  "Logistics & Supply Chain",
  "Luxury Goods & Jewelry",
  "Machinery",
  "Management Consulting",
  "Maritime",
  "Marketing & Advertising",
  "Market Research",
  "Mechanical or Industrial Engineering",
  "Media Production",
  "Medical Device",
  "Medical Practice",
  "Mental Health Care",
  "Military",
  "Mining & Metals",
  "Motion Pictures & Film",
  "Museums & Institutions",
  "Music",
  "Nanotechnology",
  "Newspapers",
  "Nonprofit Organization Management",
  "Oil & Energy",
  "Online Publishing",
  "Outsourcing/Offshoring",
  "Package/Freight Delivery",
  "Packaging & Containers",
  "Paper & Forest Products",
  "Performing Arts",
  "Pharmaceuticals",
  "Philanthropy",
  "Photography",
  "Plastics",
  "Political Organization",
  "Primary/Secondary",
  "Printing",
  "Professional Training",
  "Program Development",
  "Public Policy",
  "Public Relations",
  "Public Safety",
  "Publishing",
  "Railroad Manufacture",
  "Ranching",
  "Real Estate",
  "Recreational",
  "Facilities & Services",
  "Religious Institutions",
  "Renewables & Environment",
  "Research",
  "Restaurants",
  "Retail",
  "Security & Investigations",
  "Semiconductors",
  "Shipbuilding",
  "Sporting Goods",
  "Sports",
  "Staffing & Recruiting",
  "Supermarkets",
  "Telecommunications",
  "Textiles",
  "Think Tanks",
  "Tobacco",
  "Translation & Localization",
  "Transportation/Trucking/Railroad",
  "Utilities",
  "Venture Capital",
  "Veterinary",
  "Warehousing",
  "Wholesale",
  "Wine & Spirits",
  "Wireless",
  "Writing & Editing"
]
const JobTitles = ['CEO', 'Founder', 'Director of Marketing', 'Developer', 'Designer'];

const employees = [
  '1-10',
  '11-20',
  '21-50',
  '51-100',
  '101-200',
  '201-500',
  '501-1000',
  '1001-2000',
  '2001-5000',
  '5000+',
];

const CustomLeadB2B = ({ faqData }) => {
  const { sendNotification } = useNotification();
  const { user, data } = useUser();

  const [_accordData, setAccordData] = useState([]);
  const [info, setInfo] = useState({
    company: [],
    job: [],
    location: [],
    revenue: ['', ''],
    employee: [employees[0]],
    emails: '',
  });
  const [open, setOpen] = useState({
    openModal: '',
    isOpen: false,
    loading: false,
  });
  const [formErrors, setFormErrors] = useState({
    emails: '',
  });

  const handleClick = (value, object) => {
    setInfo((prev) => ({ ...prev, [object]: value }));
  };

  console.log("info", info)

  const submit = (e) => {
    e.preventDefault();

    if (formErrors.emails.length === 0) {
      setOpen((prev) => ({ ...prev, loading: true }));
      Api.leads
        .b2bRequest(user?.tenant_id, info)
        .then((res) => {
          sendNotification({
            open: true,
            message: res.data.message,
            alert: 'success',
          });

          setInfo({
            company: [],
            job: [],
            location: [],
            revenue: ['', ''],
            employee: [employees[0]],
            emails: '',
          });
        })
        .catch((e) => {
          ErrorHandling({ e, sendNotification });
        })
        .finally(() => {
          setOpen((prev) => ({ ...prev, loading: false }));
        });
    }
  };

  const handleButtonClick = () => {
    setOpen((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseMenu = () => {
    setOpen((prev) => ({ ...prev, isOpen: false }));
  };

  const handleToggleMenu = () => {
    setOpen((prev) => ({ ...prev, isOpen: !open.isOpen }));
  };

  return (
    <Box sx={{ padding: '8px 10px' }}>
      <form onSubmit={submit}>
        <Typography variant="h7" fontWeight={800} mb={1}>
          Industry
        </Typography>
        <IconButton
          onClick={() => {
            setOpen((prev) => ({ ...prev, openModal: 'faq' }));
            setAccordData(faqData.company_faqs);
          }}
          sx={{
            width: 20,
            height: 20,
            ml: 1,
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>

        <Autocomplete
          multiple
          id="standard"
          options={industry}
          freeSolo
          sx={{
            background: '#FFFFFF',
            borderRadius: '5px',
            mt: '5px',
            maxHeight: '80px',
            overflowY: 'auto',
            mb: 2,
          }}
          value={info.company}
          onChange={(e, v) => handleClick(v, 'company')}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="ex. Apparel, Software, Consumer services" />
          )}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h7" fontWeight={800}>
            Job Titles
          </Typography>
          <IconButton
            onClick={() => {
              setOpen((prev) => ({ ...prev, openModal: 'faq' }));
              setAccordData(faqData.job_faqs);
            }}
            sx={{
              width: 20,
              height: 20,
              ml: 1,
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Autocomplete
          multiple
          id="standard"
          options={JobTitles}
          freeSolo
          sx={{
            background: '#FFFFFF',
            borderRadius: '5px',
            mt: '5px',
            maxHeight: '80px',
            overflowY: 'auto',
            mb: 2,
          }}
          value={info.job}
          onChange={(e, v) => handleClick(v, 'job')}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="ex. CEO, Founder, Director of Marketing" />
          )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h7" fontWeight={800}>
            Locations
          </Typography>
          <IconButton
            onClick={() => {
              setOpen((prev) => ({ ...prev, openModal: 'faq' }));
              setAccordData(faqData.location_faqs);
            }}
            sx={{
              width: 20,
              height: 20,
              ml: 1,
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Autocomplete
          multiple
          id="standard"
          options={[]}
          freeSolo
          value={info.location}
          onChange={(e, v) => handleClick(v, 'location')}
          sx={{
            background: '#FFFFFF',
            borderRadius: '5px',
            mt: '5px',
            maxHeight: '80px',
            overflowY: 'auto',
            mb: 2,
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} size="small" placeholder="" />}
        />

        <Typography variant="h7" fontWeight={800}>
          Company Size
        </Typography>
        <Typography sx={{ fontSize: '14px', mt: 2, mb: 1 }}>Revenue</Typography>
        <Grid container sx={{ mb: 1.5 }}>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options}
              sx={{ mr: 0.5 }}
              value={info.revenue[0]}
              onChange={(e, value) => setInfo((prev) => ({ ...prev, revenue: [value, prev.revenue[1]] }))}
              renderInput={(params) => <TextField {...params} label="Min(MM)" size="small" />}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options}
              sx={{ ml: 0.5 }}
              value={info.revenue[1]}
              onChange={(e, value) => setInfo((prev) => ({ ...prev, revenue: [prev.revenue[0], value] }))}
              renderInput={(params) => <TextField {...params} label="Max(MM)" size="small" />}
            />
          </Grid>
        </Grid>
        <Typography sx={{ fontSize: '14px' }}>Employees</Typography>
        <Box sx={{ display: 'flex', mt: 1, mb: 2 }}>
          <Select
            multiple
            value={info.employee}
            onChange={(e) => handleClick(e.target.value, 'employee')}
            style={{ height: '35px', width: '100%', overflow: 'hidden' }}
            renderValue={(value) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SvgIcon color="primary">
                  <GroupOutlinedIcon sx={{ marginRight: '0.5rem', color: '##7B68EE' }} />
                </SvgIcon>
                {value.join(', ')}
              </Box>
            )}
            MenuProps={{
              open: open.isOpen,
              onClose: handleCloseMenu,
            }}
            onOpen={handleToggleMenu}
          >
            {/* <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}> */}
            {employees.map((item, index) => (
              <MenuItem key={index} value={item}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Checkbox checked={info.employee.includes(item)} />
                  <ListItemText primary={item} />
                </div>
              </MenuItem>
            ))}
            {/* </Box> */}
            <Button
              onClick={handleButtonClick}
              sx={{ zIndex: 99, ml: 'auto', mr: 'auto', display: 'flex' }}
              variant="outlined"
            >
              Select
            </Button>
          </Select>
        </Box>
        <Typography variant="h7" fontWeight={800}>
          Number of emails
        </Typography>
        <TextField
          sx={{
            background: '#FFFFFF',
            border: '1px solid rgba(185, 190, 199, 0.6)',
            borderRadius: '5px',
            mt: '5px',
          }}
          type="number"
          value={info.emails}
          onChange={(e) => handleClick(e.target.value, 'emails')}
          fullWidth
          placeholder="Number of emails"
          onBlur={(e) => {
            const emailsCount = parseInt(info.emails, 10);
            const totalCredit = parseInt(data.total_credits?.replace(',', ''), 10);
            if (emailsCount >= totalCredit) {
              setFormErrors((prev) => ({
                ...prev,
                emails: `Value must be less than ${data.total_credits}`,
              }));
              handleClick(e.target.value, 'emails');
            } else {
              setFormErrors((prev) => ({
                ...prev,
                emails: '',
              }));
            }
          }}
        />
        {formErrors.emails && (
          <div style={{ textAlign: 'left', marginTop: '0.2rem', color: 'red', mb: 2 }}>
            <small>{formErrors.emails}</small>
          </div>
        )}
        <Button
          variant="contained"
          sx={{
            height: 40,
            width: '50%',
            mt: 3,
            ml: 'auto',
            mr: 'auto',
            display: 'flex',
          }}
          type="submit"
          disabled={open.loading}
        >
          {open.loading ? 'Loading...' : 'SUBMIT'}
        </Button>
      </form>

      <FaqModal
        isOpen={open.openModal === 'faq'}
        setOpen={setOpen}
        onSubmit={() => {}}
        onClose={() => setOpen((prev) => ({ ...prev, openModal: '' }))}
        accordData={_accordData}
      />
    </Box>
  );
};

export default CustomLeadB2B;
