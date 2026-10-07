import NavBar from '../components/NavBar';
import TaskList from '../components/TaskList';

export default function DashboardPage() {

  return (
   <div>
    <div style={{ backgroundColor: '##5d6060' }}>
    <NavBar />
    </div>
    <div>
    <TaskList />
    </div>
   </div>
  );
};