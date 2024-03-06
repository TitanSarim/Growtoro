import { HeaderTitle } from 'utils/typography';
import UniversityCards from './UniversityCards';
import UniversityFilter from './UniversityFilter';

const University = () => (
  <>
    <HeaderTitle>University</HeaderTitle>
    <UniversityFilter />
    <UniversityCards />
  </>
);

export default University;
