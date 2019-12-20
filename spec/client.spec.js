const MaventaBankApi = require('../index');
require('dotenv').config();

describe('Maventa WDLS client tests', function() {
  beforeAll(async function() {
    const vendorApiKey = process.env.VENDOR_API_KEY;
    const userApiKey = process.env.USER_API_KEY;
    const companyUuid = process.env.COMPANY_UUID;

    if (!vendorApiKey || !userApiKey || !companyUuid || !process.env.TEST_MESSAGE_ID) {
      console.error(`\nApi keys are missing. Check your .env variables.\n`);
      process.exit(1);
    }
    this.maventaClient = await new MaventaBankApi(vendorApiKey, userApiKey, companyUuid, true);
  });

  it('Should return Hello World', async function() {
    const res = await this.maventaClient.helloWorld();
    expect(res).toContain('Hello from Bank API v1.0');
  });

  it('Should return a list of error messages', async function() {
    const res = await this.maventaClient.errorMessageList(
      new Date(1550828295449),
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    );
    expect(res).toEqual([]);
  });

  it('Should return an error on invalid message id', async function() {
    const res = await this.maventaClient.errorMessageShow('message');
    expect(res).toContain('ERROR: MESSAGE NOT FOUND OR NO RIGHTS');
  });

  it('Should try and fail to send a message', async function() {
    const res = await this.maventaClient.messageSend('message');
    expect(res).toBeTruthy();
  });

  it('Should return an empty list of RI messages', async function() {
    const res = await this.maventaClient.RIMessageList(
      new Date(1550828295449),
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    );
    expect(res.length).toEqual(2);
  });

  it('Should load a test RI-Message with id TEST_MESSAGE_ID', async function() {
    const res = await this.maventaClient.RIMessageShow(process.env.TEST_MESSAGE_ID);
    expect(res).toBeTruthy();
  });

  it('Should try to show an empty message', async function() {
    const res = await this.maventaClient.messageStatus('message');
    expect(res).toContain('ERROR: MESSAGE NOT FOUND OR NO RIGHTS');
  });
});
