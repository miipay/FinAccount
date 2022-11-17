import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PERMISSIONS } from '../../src/accounts/constants';
import { JWTPayload } from '../../src/shared/interfaces';
import { Account } from '../../src/accounts/entities';
import { createFakeJWT } from '../utils';

const ALL_PERMISSIONS: JWTPayload = {
  sub: 'test',
  username: 'test',
  iss: 'MiiGuard',
  permissions: [
    PERMISSIONS.AccountCreate,
    PERMISSIONS.AccountDelete,
    PERMISSIONS.AccountEnable,
    PERMISSIONS.AccountListAll,
    PERMISSIONS.AccountTransfer,
    PERMISSIONS.AccountUpdate,
    PERMISSIONS.AccountWithdrawDeposit,
  ],
};

const RO_PERMISSIONS: JWTPayload = {
  sub: 'test',
  username: 'test',
  iss: 'MiiGuard',
  permissions: [PERMISSIONS.AccountListAll],
};

describe('AccountController (e2e)', () => {
  let app: INestApplication;
  let accessTokenAll: string;
  let accessTokenRO: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, JwtModule.register({})],
    }).compile();
    const jwtService = moduleFixture.get<JwtService>(JwtService);
    accessTokenAll = createFakeJWT(jwtService, ALL_PERMISSIONS);
    accessTokenRO = createFakeJWT(jwtService, RO_PERMISSIONS);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/accounts (GET) no token -> 401', () => {
    return request(app.getHttpServer()).get('/accounts').expect(401);
  });

  it('/accounts (GET) with readonly token -> 200', () => {
    return request(app.getHttpServer()).get('/accounts').set('Authorization', `Bearer ${accessTokenRO}`).expect(200);
  });

  it('/accounts (POST) with all token -> 201', () => {
    return request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${accessTokenAll}`)
      .send({
        name: 'test account1',
        currency: 'USD',
        type: 0,
      })
      .expect(201);
  });

  describe('Update account', () => {
    let testAccount: Account;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          name: 'test account1',
          currency: 'USD',
          type: 0,
        })
        .expect(201);
      testAccount = res.body;
    });

    it('/accounts/:id/name (PUT) with all token -> 200', async () => {
      const res = await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/name`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({ name: 'renamed' })
        .expect(200);
      expect(res.body.name).toEqual('renamed');
    });

    it('/accounts/:id/name (PUT) with RO token -> 403', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/name`)
        .set('Authorization', `Bearer ${accessTokenRO}`)
        .send({ name: 'renamed' })
        .expect(403);
    });

    it('/accounts/:id/enabled (PUT) with all token -> 200', async () => {
      expect(testAccount.enabled).toEqual(true);
      const res = await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/enabled`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({ enabled: false })
        .expect(200);
      expect(res.body.enabled).toEqual(false);
    });

    it('/accounts/:id/enabled (PUT) with RO token -> 403', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/enabled`)
        .set('Authorization', `Bearer ${accessTokenRO}`)
        .send({ enabled: false })
        .expect(403);
    });

    it('/accounts/:id/(deposit|withdraw) (PUT) with all token -> 200', async () => {
      expect(testAccount.balance).toEqual('0');
      const resDeposit = await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/deposit`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          amount: '100',
          note: '+100',
        })
        .expect(200);
      expect(resDeposit.body.account.balance).toEqual('100');
      const resWithdraw = await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/withdraw`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          amount: '100',
          note: '-100',
        })
        .expect(200);
      expect(resWithdraw.body.account.balance).toEqual('0');
    });

    it('/accounts/:id/(deposit|withdraw) (PUT) with RO token -> 403', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/deposit`)
        .set('Authorization', `Bearer ${accessTokenRO}`)
        .send({
          amount: '100',
          note: '+100',
        })
        .expect(403);
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount.id}/withdraw`)
        .set('Authorization', `Bearer ${accessTokenRO}`)
        .send({
          amount: '100',
          note: '-100',
        })
        .expect(403);
    });
  });

  describe('Transfer account', () => {
    let testAccount1: Account;
    let testAccount2: Account;

    beforeEach(async () => {
      testAccount1 = (
        await request(app.getHttpServer())
          .post('/accounts')
          .set('Authorization', `Bearer ${accessTokenAll}`)
          .send({
            name: 'test account1',
            currency: 'USD',
            type: 0,
          })
          .expect(201)
      ).body;
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount1.id}/deposit`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          amount: '100',
          note: '+100',
        })
        .expect(200);
      testAccount2 = (
        await request(app.getHttpServer())
          .post('/accounts')
          .set('Authorization', `Bearer ${accessTokenAll}`)
          .send({
            name: 'test account1',
            currency: 'USD',
            type: 0,
          })
          .expect(201)
      ).body;
    });

    it('/accounts/:id/transfer/:id (PUT) with all token -> 200', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount1.id}/transfer/${testAccount2.id}`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          amount: '100',
          note: 'pay back',
        })
        .expect(200);
    });

    it('/accounts/:id/transfer/:id (PUT) with RO token -> 403', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount1.id}/transfer/${testAccount2.id}`)
        .set('Authorization', `Bearer ${accessTokenRO}`)
        .send({
          amount: '100',
          note: 'pay back',
        })
        .expect(403);
    });

    it('/accounts/:id/transfer/:id (PUT) with all token -> 400, oversend', async () => {
      await request(app.getHttpServer())
        .put(`/accounts/${testAccount1.id}/transfer/${testAccount2.id}`)
        .set('Authorization', `Bearer ${accessTokenAll}`)
        .send({
          amount: '1000',
          note: 'pay back',
        })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
