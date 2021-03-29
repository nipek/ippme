import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-7.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navComponents = [
  {
    to: '/dashboard/buttons',
    name: 'buttons',
    exact: false,
    Icon: MdRadioButtonChecked,
  },
  {
    to: '/dashboard/button-groups',
    name: 'button groups',
    exact: false,
    Icon: MdGroupWork,
  },
  {
    to: '/dashboard/forms',
    name: 'forms',
    exact: false,
    Icon: MdChromeReaderMode,
  },
  {
    to: '/dashboard/input-groups',
    name: 'input groups',
    exact: false,
    Icon: MdViewList,
  },
  {
    to: '/dashboard/dropdowns',
    name: 'dropdowns',
    exact: false,
    Icon: MdArrowDropDownCircle,
  },
  { to: '/dashboard/badges', name: 'badges', exact: false, Icon: MdStar },
  {
    to: '/dashboard/alerts',
    name: 'alerts',
    exact: false,
    Icon: MdNotificationsActive,
  },
  { to: '/dashboard/progress', name: 'progress', exact: false, Icon: MdBrush },
  { to: '/dashboard/modals', name: 'modals', exact: false, Icon: MdViewDay },
];

const navContents = [
  {
    to: '/dashboard/typography',
    name: 'typography',
    exact: false,
    Icon: MdTextFields,
  },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const navSetups = [
  {
    to: '/dashboard/addaccount',
    name: 'Add Account',
    exact: false,
    Icon: MdAccountCircle,
    isLender: true,
    isForSubAccount: false,
  },
  {
    to: '/dashboard/employers',
    name: 'Setup Employers',
    exact: false,
    Icon: MdAccountCircle,
    isLender: false,
    isForSubAccount: false,
  },
  {
    to: '/dashboard/lenders',
    name: 'Setup Lenders',
    exact: false,
    Icon: MdViewCarousel,
    isLender: false,
    isForSubAccount: false,
  },
];
const pageContents = [
  { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  {
    to: '/login-modal',
    name: 'login modal',
    exact: false,
    Icon: MdViewCarousel,
  },
];

const navDeductions = [
  {
    to: '/dashboard/deductions',
    name: 'Upload',
    exact: false,
    Icon: MdGroupWork,
    isLender: true,
  },
  {
    to: '/dashboard/searchdeductions',
    name: 'Search',
    exact: false,
    Icon: MdAccountCircle,
    isLender: true,
  },
];

const navItems = [
  {
    to: '/dashboard/home',
    name: 'dashboard',
    exact: true,
    Icon: MdDashboard,
    isLender: 'all',
  },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
    isOpenSetup: true,
    isOpenDeductions: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                //  width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              {/* <span className="text-white">
                Reduction <FaGithub />
              </span> */}
            </SourceLink>
          </Navbar>
          <Nav vertical>
            {navItems.map(
              ({ to, name, exact, Icon, isLender }, index) =>
                (isLender === 'all' ||
                  this.props.user.isLender === isLender) && (
                  <NavItem key={index} className={bem.e('nav-item')}>
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                    >
                      <Icon className={bem.e('nav-item-icon')} />
                      <span className="">{name}</span>
                    </BSNavLink>
                  </NavItem>
                ),
            )}
            {this.props.user.isLender && (
              <>
                <NavItem
                  className={bem.e('nav-item')}
                  onClick={this.handleClick('Deductions')}
                >
                  <BSNavLink className={bem.e('nav-item-collapse')}>
                    <div className="d-flex">
                      <MdExtension className={bem.e('nav-item-icon')} />
                      <span className=" align-self-start">Deductions</span>
                    </div>
                    <MdKeyboardArrowDown
                      className={bem.e('nav-item-icon')}
                      style={{
                        padding: 0,
                        transform: this.state.isOpenDeductions
                          ? 'rotate(0deg)'
                          : 'rotate(-90deg)',
                        transitionDuration: '0.3s',
                        transitionProperty: 'transform',
                      }}
                    />
                  </BSNavLink>
                </NavItem>
                <Collapse isOpen={this.state.isOpenDeductions}>
                  {navDeductions.map(
                    ({ to, name, exact, Icon, isLender }, index) =>
                      (isLender === 'all' ||
                        this.props.user.isLender === isLender) && (
                        <NavItem key={index} className={bem.e('nav-item')}>
                          <BSNavLink
                            id={`navItem-${name}-${index}`}
                            className="text-uppercase"
                            tag={NavLink}
                            to={to}
                            activeClassName="active"
                            exact={exact}
                          >
                            <Icon className={bem.e('nav-item-icon')} />
                            <span className="">{name}</span>
                          </BSNavLink>
                        </NavItem>
                      ),
                  )}
                </Collapse>
              </>
            )}

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Setup')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Setup</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenSetup
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenSetup}>
              {navSetups.map(
                ({ to, name, exact, Icon, isLender, isForSubAccount }, index) =>
                  (isLender === 'all' ||
                    (this.props.user.isLender === isLender &&
                      this.props.user.isSubAccount === isForSubAccount)) && (
                    <NavItem key={index} className={bem.e('nav-item')}>
                      <BSNavLink
                        id={`navItem-${name}-${index}`}
                        className="text-uppercase"
                        tag={NavLink}
                        to={to}
                        activeClassName="active"
                        exact={exact}
                      >
                        <Icon className={bem.e('nav-item-icon')} />
                        <span className="">{name}</span>
                      </BSNavLink>
                    </NavItem>
                  ),
              )}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
