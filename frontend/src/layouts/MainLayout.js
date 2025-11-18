import React, { useState, useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import Logo from '../components/common/Logo';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '../components/common/Avatar';

const patientNavigation = [
  { name: 'Overview', to: '/dashboard', icon: HomeIcon },
  { name: 'My Appointments', to: '/appointments', icon: CalendarIcon },
  { name: 'Telehealth', to: '/telehealth', icon: VideoCameraIcon },
  { name: 'Billing & Payments', to: '/billing', icon: CreditCardIcon },
];

const getNavigation = (role = 'doctor') => {
  if (role === 'patient') {
    return patientNavigation;
  }

  const baseNavigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Appointments', to: '/appointments', icon: CalendarIcon },
    { name: 'Patients', to: '/patients', icon: DocumentTextIcon },
    { name: 'Telehealth', to: '/telehealth', icon: VideoCameraIcon },
    { name: 'Billing', to: '/billing', icon: CreditCardIcon },
  ];

  if (role === 'admin') {
    baseNavigation.splice(1, 0, { name: 'Users', to: '/users', icon: UsersIcon });
  }

  if (role === 'admin' || role === 'doctor') {
    baseNavigation.push({ name: 'Analytics', to: '/analytics', icon: ChartBarIcon });
  }

  return baseNavigation;
};

const getDisplayName = (payload) => {
  if (!payload) return 'User';
  if (payload.firstName || payload.lastName) {
    const first = payload.firstName || '';
    const last = payload.lastName || '';
    const combined = `${first} ${last}`.trim();
    if (combined) return combined;
  }
  if (payload.name) return payload.name;
  if (payload.email) return payload.email.split('@')[0];
  return 'User';
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const resolvedUser = useMemo(() => {
    if (!user) return null;
    if (user.role) return user;
    if (user.data?.user) return { ...user.data.user, token: user.token };
    if (user.user) return { ...user.user, token: user.token };
    return user;
  }, [user]);

  const role = resolvedUser?.role || 'patient';
  const navigation = useMemo(() => getNavigation(role), [role]);
  const displayName = getDisplayName(resolvedUser);
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const avatarSrc = resolvedUser?.avatar;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`h-screen flex overflow-hidden ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      <div className={`md:hidden ${sidebarOpen ? 'fixed inset-0 z-40 flex' : ''}`}>
        <div
          className={`${
            sidebarOpen ? 'fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ease-linear duration-300' : 'hidden'
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>

        <div
          className={`${
            sidebarOpen
              ? 'relative flex-1 flex flex-col max-w-xs w-full ease-in-out duration-300 transform ' +
                (isDark ? 'bg-gray-800 text-white' : 'bg-white')
              : 'hidden'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-primary-600">EzyOlive</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`${
                    location.pathname.startsWith(item.to)
                      ? isDark
                        ? 'bg-indigo-900 bg-opacity-50 text-indigo-300'
                        : 'bg-primary-50 text-primary-600'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                >
                  <item.icon
                    className={`${
                      location.pathname.startsWith(item.to)
                        ? isDark
                          ? 'text-indigo-300'
                          : 'text-primary-500'
                        : isDark
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className={`flex-shrink-0 flex border-t p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div>
                  <Avatar name={displayName} size="sm" src={avatarSrc} />
                </div>
                <div className="ml-3">
                  <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>{displayName}</p>
                  <button
                    onClick={handleLogout}
                    className={`text-sm font-medium ${
                      isDark ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-500 hover:text-primary-500'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div
            className={`flex-1 flex flex-col min-h-0 border-r ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo className="h-8 w-auto" />
                <span className={`ml-2 text-xl font-bold ${isDark ? 'text-indigo-400' : 'text-primary-600'}`}>
                  EzyOlive
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`${
                      location.pathname.startsWith(item.to)
                        ? isDark
                          ? 'bg-indigo-900 bg-opacity-50 text-indigo-300'
                          : 'bg-primary-50 text-primary-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <item.icon
                      className={`${
                        location.pathname.startsWith(item.to)
                          ? isDark
                            ? 'text-indigo-300'
                            : 'text-primary-500'
                          : isDark
                            ? 'text-gray-400 group-hover:text-gray-300'
                            : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={`flex-shrink-0 flex border-t p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Menu as="div" className="relative inline-block text-left w-full">
                <div className="flex items-center justify-between w-full">
                  <Menu.Button className="group flex items-center text-left focus:outline-none">
                    <Avatar name={displayName} size="sm" src={avatarSrc} />
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {displayName}
                      </p>
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {roleLabel}
                      </p>
                    </div>
                  </Menu.Button>
                  <ThemeSwitcher className="ml-2" />
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className={`absolute bottom-full left-0 w-56 mt-2 mb-2 origin-bottom-right ${
                      isDark ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-100'
                    } rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/users/${resolvedUser?._id || ''}`}
                            className={`${
                              isDark
                                ? active
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300'
                                : active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            <UsersIcon
                              className={`mr-3 h-5 w-5 ${
                                isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
                              }`}
                              aria-hidden="true"
                            />
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            className={`${
                              isDark
                                ? active
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300'
                                : active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            <Cog6ToothIcon
                              className={`mr-3 h-5 w-5 ${
                                isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
                              }`}
                              aria-hidden="true"
                            />
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              isDark
                                ? active
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300'
                                : active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col w-0 flex-1 overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500`}
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div
            className={`border-b px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 md:px-8 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
                {navigation.find((item) => location.pathname.startsWith(item.to))?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="mt-4 flex sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:order-0 sm:ml-0"
              >
                <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Notifications
              </button>
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
