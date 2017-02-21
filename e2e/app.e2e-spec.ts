import { V1Page } from './app.po';

describe('v1 App', function() {
  let page: V1Page;

  beforeEach(() => {
    page = new V1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
