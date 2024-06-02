import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';

import { useAppDispatch } from './store/hooks';
import { fetchStockList } from './store/stock-slice';

import Register from './page/auth/register';
import Login from './page/auth/login';
import Home from './page/home';
import StockDetail from './page/stock-detail';
import UserCenter from './page/user-center';
import './app.css';

// type MenuItem = Required<MenuProps>['items'][number];

// enum Keys {
//   Check,
//   Compare,
//   Trade,
//   Analyze,
//   Person,
// }

// const RouterMap: Record<string, string> = {
//   default: String(Keys.Check),
//   compare: String(Keys.Compare),
// };

// const items: MenuItem[] = [
//   {
//     key: Keys.Check,
//     label: <Link to="/">股票走势查看</Link>,
//   },
//   {
//     key: Keys.Compare,
//     label: <Link to="/compare">股票对比</Link>,
//   },
//   {
//     key: Keys.Trade,
//     label: '模拟交易中心',
//   },
//   {
//     key: Keys.Analyze,
//     label: '股票分析与推荐',
//   },
//   {
//     key: Keys.Person,
//     label: '个人中心',
//   },
// ];

function App() {
  const dispatch = useAppDispatch();

  dispatch(fetchStockList());
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="home/*" element={<Home></Home>}></Route>
        <Route path="detail/:id" element={<StockDetail></StockDetail>}></Route>
        <Route path="register" element={<Register></Register>}></Route>
        <Route path="Login" element={<Login></Login>}></Route>
        <Route path="user" element={<UserCenter></UserCenter>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
