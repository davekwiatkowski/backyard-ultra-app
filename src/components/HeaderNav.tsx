import { Menu, MenuProps } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { SettingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router';

const menuItems: MenuProps['items'] = [
  {
    label: 'Race',
    key: 'race',
    icon: <ClockCircleOutlined />,
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: <SettingOutlined />,
  },
];

const HeaderNav: FC = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname.substring(1));
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: any) => {
      setCurrent(e.key);
      console.log(e.key);
      navigate('/' + e.key);
    },
    [navigate]
  );

  useEffect(() => {
    setCurrent(location.pathname.substring(1));
  }, [location.pathname]);

  return (
    <Header>
      <Menu
        selectedKeys={[current]}
        onClick={handleClick}
        theme='dark'
        items={menuItems}
        mode='horizontal'
      />
    </Header>
  );
};

export default HeaderNav;
