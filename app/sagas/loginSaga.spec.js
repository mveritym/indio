import { expect } from 'chai';
import { put, call, take, fork } from 'redux-saga/effects';
import { DO_LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/constants';
import loginListener, { login } from './loginSaga';
import api from '../api/api';

describe('Login saga', () => {
  describe('loginListener', () => {
    it('listens to all DO_LOGIN actions', () => {
      const loginListenerSaga = loginListener();
      const step1 = loginListenerSaga.next().value;
      const step2 = loginListenerSaga.next().value;
      expect(step1).to.deep.eq(take(DO_LOGIN));
      expect(step2).to.deep.eq(fork(login, undefined));
    });
  });

  describe('login', () => {
    let loginSaga;
    let step1;

    beforeEach(() => {
      loginSaga = login();
      step1 = loginSaga.next().value;
    });

    it('calls api.login', () => {
      expect(step1).to.deep.eq(call(api.login));
    });

    it('calls LOGIN_SUCCESS action if login succeeds', () => {
      const step2 = loginSaga.next(true).value;
      expect(step2).to.deep.eq(put(LOGIN_SUCCESS));
    });

    it('calls LOGIN_FAILURE action if login fails', () => {
      const step2 = loginSaga.next(false).value;
      expect(step2).to.deep.eq(put(LOGIN_FAILURE));
    });
  });
});