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
import { useEffect, useState } from 'react';
import { Room } from '../@types/rooms';
import { getRoomList } from '../lib/api';
import Link from 'next/link';

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
      align="center"
    >
      {children}
    </TableCell>
  );
};

const RoomTableHead = () => {
  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: '#6700FF',
        }}
      >
        <Cell>Room Title</Cell>
        <Cell>Description</Cell>
        <Cell>Mode</Cell>
        <Cell>
          <PeopleAltIcon
            sx={{
              color: '#FFF',
            }}
          />
        </Cell>
        <Cell></Cell>
      </TableRow>
    </TableHead>
  );
};

type RoomTableRowProps = {
  room: Room;
};

const RoomTableRow = ({ room }: RoomTableRowProps) => {
  const router = useRouter();
  return (
    <TableRow
      sx={{
        backgroundColor: '#6700FF',
        opacity: '70%',
      }}
    >
      <Cell>{room.title}</Cell>
      <Cell>{room.description}</Cell>
      <Cell>{room.mode}</Cell>
      <Cell>{room.members}</Cell>
      <Cell>
        <RoundButton
          title="Join"
          onClick={() => {
            router.push(`/${room.id}`);
          }}
          backgroundColor="blue"
        />
      </Cell>
    </TableRow>
  );
};

const Rooms: NextPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.replace('/');
    } else {
      setUsername(username);
    }
    getRoomList().then((data) => {
      setRooms(data.data);
    });
  }, []);

  return (
    <div>
      <Header username={username} />
      <div className="tableHeader">
        <InputField width="300px" placeholder="search" />
        <div style={{ width: 10 }}></div>
        <RoundButton
          title="Create"
          width={120}
          onClick={() => {
            router.push('/create');
          }}
        />
      </div>
      <div className="tableContainer">
        <Table
          sx={{
            width: '100%',
          }}
        >
          <RoomTableHead />
          <TableBody>
            {rooms.map((room: Room, idx: number) => {
              return <RoomTableRow room={room} key={`room-row-${idx}`} />;
            })}
          </TableBody>
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
