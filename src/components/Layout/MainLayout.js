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
const DashboardPage = React.lazy(() => import('../../pages/DashboardPage'));
const EmployerSetup = React.lazy(() => import('../../pages/EmployerSetup'));
const LenderSetup = React.lazy(() => import('../../pages/LenderSetup'));
const UploadDeductions = React.lazy(() =>
  import('../../pages/UploadDeductions'),
);
const SearchDeductions = React.lazy(() =>
  import('../../pages/SearchDeductions'),
);
const AddLenderAccount = React.lazy(() =>
  import('../../pages/AddLenderAccount'),
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
      let userr = sessionStorage.getItem('zer');
      if (!userr) return this.props.history.push('/login');
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
  unsafe_componentWillReceiveProps({ breakpoint }) {
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
                    path="/dashboard/addaccount"
                    render={props => (
                      <AddLenderAccount
                        changeLoading={this.changeLoading}
                        user={this.state.user}
                        notify={this.handleNotification}
                        {...props}
                      />
                    )}
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
