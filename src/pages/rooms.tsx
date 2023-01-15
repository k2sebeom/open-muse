import { NextPage } from 'next';
import Header from '../components/Header';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InputField from '../components/InputField';
import RoundButton from '../components/RoundButton';
import { useRouter } from 'next/router';

type CellProps = {
  children?: React.ReactNode;
};

const Cell = ({ children }: CellProps) => {
  return (
    <TableCell
      sx={{
        borderLeft: '1px solid #BE92FF',
        borderRight: '1px solid #BE92FF',
        color: '#FFF',
      }}
    >
      {children}
    </TableCell>
  );
};

const Rooms: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <Header />
      <div className='tableHeader'>
        <InputField width='300px' placeholder='search' />
        <div style={{ width: 10 }}></div>
        <RoundButton title='Create' width={120}  onClick={() => {
          router.push('/create');
        }}/>
      </div>
      <div className="tableContainer">
        <Table
          sx={{
            width: '100%',
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#6700FF',
              }}
            >
              <Cell>Room Title</Cell>
              <Cell>Description</Cell>
              <Cell>Mode</Cell>
              <TableCell>
                <PeopleAltIcon
                  sx={{
                    color: '#FFF',
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </div>
      <style jsx>{`
        .tableContainer {
          margin-left: 10px;
          margin-right: 10px;
        }

        .tableHeader {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-left: 10px;
            margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Rooms;
