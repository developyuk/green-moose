import { GreenMoosePage } from './app.po';

describe('green-moose App', () => {
  let page: GreenMoosePage;

  beforeEach(() => {
    page = new GreenMoosePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
