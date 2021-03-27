import { Content, Footer, Header, Sidebar } from 'components/Layout';
import React, {
  lazy,
  Suspense,
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  MdImportantDevices,
  // MdCardGiftcard,
  MdLoyalty,
} from 'react-icons/md';
import LoadingOverlay from 'react-loading-overlay';

import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import PageSpinner from '../PageSpinner';
import NotificationSystem from 'react-notification-system';
import { get } from 'components/axios';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
const AlertPage = React.lazy(() => import('../../pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('../../pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('../../pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('../../pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('../../pages/ButtonPage'));
const CardPage = React.lazy(() => import('../../pages/CardPage'));
const ChartPage = React.lazy(() => import('../../pages/ChartPage'));
const DashboardPage = React.lazy(() => import('../../pages/DashboardPage'));
const DropdownPage = React.lazy(() => import('../../pages/DropdownPage'));
const FormPage = React.lazy(() => import('../../pages/FormPage'));
const InputGroupPage = React.lazy(() => import('../../pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('../../pages/ModalPage'));
const ProgressPage = React.lazy(() => import('../../pages/ProgressPage'));
const TablePage = React.lazy(() => import('../../pages/TablePage'));
const TypographyPage = React.lazy(() => import('../../pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('../../pages/WidgetPage'));
const EmployerSetup = React.lazy(() => import('../../pages/EmployerSetup'));
const LenderSetup = React.lazy(() => import('../../pages/LenderSetup'));
const UploadDeductions = React.lazy(() =>
  import('../../pages/UploadDeductions'),
);
const SearchDeductions = React.lazy(() =>
  import('../../pages/SearchDeductions'),
);
class MainLayout extends React.Component {
  state = { pageInit: true, user: {}, loading: false };

  changeLoading = () => {
    this.setState(prevState => {
      const loading = prevState.loading;

      return {
        loading,
      };
    });
  };
  static isSidebarOpen() {
    return document
      .querySelector('.cr-sidebar')
      .classList.contains('cr-sidebar--open');
  }
  async componentDidMount() {
    try {
      let url = `${process.env.REACT_APP_API}users/ck`;

      const {
        data: { data },
      } = await get(url);
      this.setState({ user: data, pageInit: false });
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }
  handleNotification = (
    title,
    message,
    level = 'info',
    autoDismiss = 5,
    action,
  ) => {
    if (!this.notificationSystem) {
      return;
    }
    //console.log(this.state)
    //  success, error, warning and info
    this.notificationSystem.addNotification({
      title,
      message: <React.Fragment>{message}</React.Fragment>,
      level,
      position: 'tr',
      autoDismiss,
      ...(action && {
        action: {
          label: action.label,
          callback: action.function,
        },
      }),
    });
  };

  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === 'xs' ||
        this.props.breakpoint === 'sm' ||
        this.props.breakpoint === 'md')
    ) {
      this.openSidebar('close');
    }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
        return this.openSidebar('close');

      case 'lg':
      case 'xl':
      default:
        return this.openSidebar('open');
    }
  }

  openSidebar(openOrClose) {
    if (openOrClose === 'open') {
      return document
        .querySelector('.cr-sidebar')
        .classList.add('cr-sidebar--open');
    }
    document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  render() {
    const { children } = this.props;
    return (
      <LoadingOverlay
        active={this.state.pageInit || this.state.loading}
        styles={{
          overlay: base => ({
            ...base,
            zIndex: 9999,
            // background: 'rgba(255,255,255,0.8)',
          }),
        }}
        spinner={<PageSpinner />}
      >
        <main className="cr-app bg-light">
          {!this.state.pageInit && <Sidebar user={this.state.user} />}
          <Content fluid onClick={this.handleContentClick}>
            <Header />
            {/* {children} */}
            {!this.state.pageInit && (
              <Suspense fallback={<PageSpinner />}>
                <Switch>
                  <Route
                    exact
                    path="/dashboard/home"
                    render={props => (
                      <DashboardPage
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/employers"
                    render={props => (
                      <EmployerSetup
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/deductions"
                    render={props => (
                      <UploadDeductions
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />

                  <Route
                    exact
                    path="/dashboard/searchdeductions"
                    render={props => (
                      <SearchDeductions
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/lenders"
                    render={props => (
                      <LenderSetup
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/login-modal"
                    render={props => (
                      <AuthModalPage
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/buttons"
                    render={props => <ButtonPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/cards"
                    render={props => <CardPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/widgets"
                    render={props => <WidgetPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/typography"
                    render={props => <TypographyPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/alerts"
                    render={props => <AlertPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/tables"
                    render={props => <TablePage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/badges"
                    render={props => <BadgePage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/button-groups"
                    render={props => <ButtonGroupPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/dropdowns"
                    render={props => <DropdownPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/progress"
                    render={props => <ProgressPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/modals"
                    render={props => <ModalPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/forms"
                    render={props => <FormPage {...props} />}
                  />
                  <Route
                    exact
                    path="/dashboard/input-groups"
                    render={props => <InputGroupPage {...props} />}
                  />

                  <Route
                    exact
                    path="/dashboard/charts"
                    render={props => <ChartPage {...props} />}
                  />
                  <Redirect to="/404" />
                </Switch>
              </Suspense>
            )}
            <Footer />
          </Content>

          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
        </main>
      </LoadingOverlay>
    );
  }
}

export default MainLayout;
