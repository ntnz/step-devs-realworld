'use strict';

define("ember-realworld/tests/acceptance/article-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | article', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _user.setupLoggedInUser)(hooks);
    let user;
    hooks.beforeEach(function () {
      user = this.server.create('user', {
        email: 'bob@example.com',
        password: 'password123'
      });
      this.server.get('/user', schema => {
        return schema.users.first();
      });
    });
    (0, _qunit.test)('visiting /articles/:slug', async function (assert) {
      const profile = await this.server.create('profile');
      const article = await this.server.create('article', {
        author: profile
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      assert.equal((0, _testHelpers.currentURL)(), `/articles/${article.slug}`);
    });
    (0, _qunit.test)('favorite article', async function (assert) {
      const profile = await this.server.create('profile');
      const article = await this.server.create('article', {
        author: profile,
        favorited: false
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      await (0, _testHelpers.click)('[data-test-favorite-article-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

      await (0, _testHelpers.settled)();
      assert.ok(article.favorited, 'Expected article to be favorited');
      await (0, _testHelpers.click)('[data-test-favorite-article-button]');
      assert.notOk(article.favorited, 'Expected article to be unfavorited');
    });
    (0, _qunit.test)('follow author', async function (assert) {
      const profile = await this.server.create('profile', {
        following: false
      });
      const article = await this.server.create('article', {
        author: profile,
        favorited: false
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      await (0, _testHelpers.click)('[data-test-follow-author-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

      await (0, _testHelpers.settled)();
      assert.dom('[data-test-follow-author-button]').hasTextContaining('Unfollow');
      await (0, _testHelpers.click)('[data-test-follow-author-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

      await (0, _testHelpers.settled)();
      assert.dom('[data-test-follow-author-button]').hasTextContaining('Follow');
    });
    (0, _qunit.test)('edit article', async function (assert) {
      const userProfile = await this.server.schema.profiles.findBy({
        username: user.username
      });
      const article = await this.server.create('article', {
        author: userProfile
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      await (0, _testHelpers.click)('[data-test-edit-article-button]');
      assert.equal((0, _testHelpers.currentRouteName)(), 'editor.edit', 'Expect to transition to `editor.article` page to edit the article');
      assert.dom('[data-test-article-form-input-title]').hasValue(article.title);
    });
    (0, _qunit.test)('delete article', async function (assert) {
      assert.expect(1);
      const userProfile = await this.server.schema.profiles.findBy({
        username: user.username
      });
      const article = await this.server.create('article', {
        author: userProfile
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      await (0, _testHelpers.click)('[data-test-delete-article-button]');
      assert.equal((0, _testHelpers.currentRouteName)(), 'index', 'Expected to transition to index when article is deleted');
    });
    (0, _qunit.test)('post comment', async function (assert) {
      assert.expect(3);
      const profile = await this.server.create('profile');
      const article = await this.server.create('article', {
        author: profile
      });
      const message = 'foo!';
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      assert.dom('[data-test-article-comment]').doesNotExist();
      await (0, _testHelpers.fillIn)('[data-test-article-comment-textarea]', message);
      await (0, _testHelpers.click)('[data-test-article-comment-button]');
      assert.dom('[data-test-article-comment]').exists({
        count: 1
      });
      assert.dom('[data-test-article-comment-body]').hasText('foo!');
    });
    (0, _qunit.test)('delete comment', async function (assert) {
      assert.expect(2);
      const profile = await this.server.create('profile');
      const userProfile = await this.server.schema.profiles.findBy({
        username: user.username
      });
      const article = await this.server.create('article', {
        author: profile
      });
      await this.server.createList('comment', 1, {
        article,
        author: userProfile
      });
      await (0, _testHelpers.visit)(`/articles/${article.slug}`);
      assert.dom('[data-test-article-comment]').exists({
        count: 1
      });
      await (0, _testHelpers.click)('[data-test-article-comment-delete-button]');
      assert.dom('[data-test-article-comment]').doesNotExist();
    });
  });
});
define("ember-realworld/tests/acceptance/editor/article-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user", "sinon"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user, _sinon) {
  "use strict";

  (0, _qunit.module)('Acceptance | editor/edit', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    hooks.before(function () {
      _sinon.default.stub(window, 'confirm');
    });
    hooks.after(function () {
      _sinon.default.restore();
    });
    (0, _qunit.module)('anonymous user', function (hooks) {
      (0, _user.setupLoggedOutUser)(hooks);
      (0, _qunit.test)('is transitioned to login', async function (assert) {
        await (0, _testHelpers.visit)('/editor/foo');
        assert.equal((0, _testHelpers.currentURL)(), '/login');
      });
    });
    (0, _qunit.module)('logged-in user', function (hooks) {
      (0, _user.setupLoggedInUser)(hooks);
      let user;
      let userProfile;
      let article;
      hooks.beforeEach(function () {
        user = this.server.create('user');
        userProfile = this.server.schema.profiles.findBy({
          username: user.username
        });
        article = this.server.create('article', {
          author: userProfile
        });
      });
      (0, _qunit.test)('can edit their own article', async function (assert) {
        await (0, _testHelpers.visit)(`/editor/${article.slug}`);
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-title]', 'Test Title');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-description]', 'Test Description');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-body]', 'Test Body');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-tags]', 'test-tag');
        await (0, _testHelpers.triggerKeyEvent)('[data-test-article-form-input-tags]', 'keydown', 'Enter');
        await (0, _testHelpers.click)('[data-test-article-form-submit-button]');
        assert.equal((0, _testHelpers.currentRouteName)(), 'articles.article');
        assert.dom('[data-test-article-title]').hasText('Test Title');
        assert.dom('[data-test-article-body]').hasText('Test Body');
      });
      (0, _qunit.test)('shows article errors from server', async function (assert) {
        await (0, _testHelpers.visit)(`/editor/${article.slug}`);
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-title]', 'Test Title');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-description]', 'Test Description');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-body]', '');
        await (0, _testHelpers.click)('[data-test-article-form-submit-button]');
        assert.dom('[data-test-article-form-error-item]').exists({
          count: 1
        }, 'A single error exists');
        assert.dom('[data-test-article-form-error-item]').hasText("body can't be blank");
        assert.equal((0, _testHelpers.currentRouteName)(), 'editor.edit', 'Should not navigate away from the page when there are errors');
      });
    });
  });
});
define("ember-realworld/tests/acceptance/editor/new-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user", "sinon"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user, _sinon) {
  "use strict";

  (0, _qunit.module)('Acceptance | editor', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    hooks.before(function () {
      _sinon.default.stub(window, 'confirm');
    });
    hooks.after(function () {
      _sinon.default.restore();
    });
    (0, _qunit.module)('anonymous user', function (hooks) {
      (0, _user.setupLoggedOutUser)(hooks);
      (0, _qunit.test)('is transitioned to login', async function (assert) {
        await (0, _testHelpers.visit)('/editor');
        assert.equal((0, _testHelpers.currentURL)(), '/login');
      });
    });
    (0, _qunit.module)('logged-in user', function (hooks) {
      (0, _user.setupLoggedInUser)(hooks);
      hooks.beforeEach(function () {
        this.server.create('user', {
          email: 'bob@example.com',
          password: 'password123'
        });
      });
      (0, _qunit.test)('can create an article', async function (assert) {
        await (0, _testHelpers.visit)('/editor');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-title]', 'Test Title');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-description]', 'Test Description');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-body]', 'Test Body');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-tags]', 'test-tag');
        await (0, _testHelpers.triggerKeyEvent)('[data-test-article-form-input-tags]', 'keydown', 'Enter');
        await (0, _testHelpers.click)('[data-test-article-form-submit-button]');
        assert.equal((0, _testHelpers.currentRouteName)(), 'articles.article');
        assert.dom('[data-test-article-title]').hasText('Test Title');
        assert.dom('[data-test-article-body]').hasText('Test Body');
      });
      (0, _qunit.test)('shows article errors from server', async function (assert) {
        await (0, _testHelpers.visit)('/editor');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-title]', 'Test Title');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-description]', 'Test Description');
        await (0, _testHelpers.fillIn)('[data-test-article-form-input-body]', '');
        await (0, _testHelpers.click)('[data-test-article-form-submit-button]');
        assert.dom('[data-test-article-form-error-item]').exists({
          count: 1
        }, 'A single error exists');
        assert.dom('[data-test-article-form-error-item]').hasText("body can't be blank");
        assert.equal((0, _testHelpers.currentRouteName)(), 'editor.index', 'Should not navigate away from the page when there are errors');
      });
    });
  });
});
define("ember-realworld/tests/acceptance/error-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | Error', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _user.setupLoggedOutUser)(hooks);
    (0, _qunit.test)('visiting /error', async function (assert) {
      await (0, _testHelpers.visit)('/some-BODY-once-told-me');
      assert.dom('[data-test-error-page]').exists('displays error page content for invalid URLs');
    });
  });
});
define("ember-realworld/tests/acceptance/index-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | index', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _user.setupLoggedOutUser)(hooks);
    (0, _qunit.test)('visiting /', async function (assert) {
      this.server.createList('article', 20);
      await (0, _testHelpers.visit)('/');
      assert.equal((0, _testHelpers.currentURL)(), '/', 'The home URL is correct');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'The correct number of articles appear in the list');
      assert.dom('[data-test-tag]').exists({
        count: 7
      }, 'The correct number of tags appear in the sidebar');
      assert.dom('[data-test-page-item]').exists({
        count: 2
      }, 'The correct number of pages appear in the pagination list');
      assert.dom('[data-test-tab]').exists({
        count: 1
      }, 'The correct number of feed tabs appear');
      assert.dom('[data-test-feed="your"]').doesNotExist('Your feed is not shown when logged out');
      assert.dom('[data-test-tab="global"]').hasClass('active', 'The global tag is active');
      assert.dom('[data-test-page-item="1"]').hasClass('active', 'The active page is correct in the pagination list');
    });
    (0, _qunit.test)('clicking a page', async function (assert) {
      await this.server.createList('article', 20);
      await (0, _testHelpers.visit)('/');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'The correct number of articles appear in the list');
      await (0, _testHelpers.click)('[data-test-page-item-link="2"]');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'After changing page the correct number of articles appear in the list');
      assert.equal((0, _testHelpers.currentURL)(), '/?page=2');
      assert.dom('[data-test-page-item="2"]').hasClass('active', 'The active page is correct in the pagination list');
    });
    (0, _qunit.test)('clicking a tag', async function (assert) {
      await this.server.createList('article', 20);
      await (0, _testHelpers.visit)('/');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'The correct number of articles appear in the list');
      await (0, _testHelpers.click)('[data-test-tag="emberjs"]');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'After changing page the correct number of articles appear in the list');
      assert.equal((0, _testHelpers.currentURL)(), '/?tag=emberjs', 'The URL has the correct tag as a query param');
      assert.dom('.feed-toggle a.nav-link').exists({
        count: 2
      }, 'The correct number of feed tabs appear');
      assert.dom('[data-test-tab="tag"]').hasClass('active', 'The tag feed toggle is active');
      assert.dom('[data-test-tab="tag"]').hasText('#emberjs', 'The active feed toggle has the correct tag name');
    });
    (0, _qunit.test)('resetting to the main list', async function (assert) {
      await this.server.createList('article', 20);
      await (0, _testHelpers.visit)('/?page=2&tag=emberjs');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'The correct number of articles appear in the list');
      await (0, _testHelpers.click)('[data-test-tab="global"]');
      assert.equal((0, _testHelpers.currentURL)(), '/');
      assert.dom('[data-test-article-preview]').exists({
        count: 10
      }, 'After changing page the correct number of articles appear in the list');
      assert.dom('[data-test-tab="global"]').hasClass('active', 'The global tag is active');
      assert.dom('[data-test-page-item="1"]').hasClass('active', 'The first page is active');
    });
    (0, _qunit.module)('logged in user', function (hooks) {
      (0, _user.setupLoggedInUser)(hooks);
      hooks.beforeEach(function () {
        this.server.create('user', {
          email: 'bob@example.com',
          password: 'password123'
        });
        this.server.get('/user', schema => {
          return schema.users.first();
        });
      });
      (0, _qunit.test)('Your feed', async function (assert) {
        await this.server.createList('article', 20);
        this.server.get('/articles/feed', schema => {
          return {
            articles: [schema.articles.first()],
            articlesCount: 1
          };
        });
        await (0, _testHelpers.visit)('/');
        assert.equal((0, _testHelpers.currentURL)(), '/', 'Lands on the home page');
        assert.dom('[data-test-tab="global"]').hasClass('active', 'Global feed is selected by default');
        assert.dom('[data-test-article-preview]').exists({
          count: 10
        }, 'The correct articles are shown in the list');
        await (0, _testHelpers.click)('[data-test-tab="your"]'); // eslint-disable-next-line ember/no-settled-after-test-helper

        await (0, _testHelpers.settled)();
        assert.equal((0, _testHelpers.currentURL)(), '/?feed=your', 'Lands on the "Your feed" page');
        assert.dom('[data-test-article-preview]').exists({
          count: 1
        }, 'One article is loaded on "Your feed"');
        assert.dom('[data-test-tab="your"]').hasClass('active', 'Your feed is selected');
      });
    });
  });
});
define("ember-realworld/tests/acceptance/login-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | login', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _user.setupLoggedOutUser)(hooks);
    (0, _qunit.test)('visiting /login', async function (assert) {
      const user = this.server.create('user', {
        email: 'bob@example.com',
        password: 'password123'
      });
      await (0, _testHelpers.visit)('/login');
      await (0, _testHelpers.fillIn)('[data-test-login-email]', user.email);
      await (0, _testHelpers.fillIn)('[data-test-login-password]', user.password);
      await (0, _testHelpers.click)('[data-test-login-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

      await (0, _testHelpers.settled)();
      assert.equal((0, _testHelpers.currentURL)(), '/', 'URL after login is Home');
      assert.dom('[data-test-nav-username]').hasText(user.username, 'Logged in username is shown');
      assert.dom('[data-test-nav-new-post]').exists('Logged in nav is shown');
      assert.dom('[data-test-nav-sign-up]').doesNotExist('Logged out nav is not shown');
    });
    (0, _qunit.test)('visiting /login has link to /register', async function (assert) {
      await (0, _testHelpers.visit)('/login');
      await (0, _testHelpers.click)('[data-test-register-link]');
      assert.equal((0, _testHelpers.currentURL)(), '/register', 'URL after click is Register');
    });
  });
});
define("ember-realworld/tests/acceptance/profile-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | profile', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _qunit.module)('logged out user', function (hooks) {
      (0, _user.setupLoggedOutUser)(hooks);
      (0, _qunit.test)('visiting /profile/username', async function (assert) {
        const profileOwner = this.server.create('profile');
        await (0, _testHelpers.visit)(`/profile/${profileOwner.username}`);
        assert.dom('[data-test-edit-profile-button]').doesNotExist('A logged-out user does not show the edit profile button');
      });
      (0, _qunit.test)('visiting any user profile will see a link to follow the profile owner but links to login', async function (assert) {
        const profileOwner = this.server.create('profile');
        await (0, _testHelpers.visit)(`/profile/${profileOwner.username}`);
        await (0, _testHelpers.click)('[data-test-follow-author-button]');
        assert.equal((0, _testHelpers.currentURL)(), '/login');
      });
      (0, _qunit.test)('sees a tab navigation to articles written by and favorited by the profile owner', async function (assert) {
        const profileOwner = this.server.create('profile');
        const otherUser = this.server.create('profile');
        /**
         * Articles written by profile owner.
         */

        this.server.createList('article', 2, {
          author: profileOwner,
          favorited: false
        });
        /**
         * Articles favorited by profile owner, not written by profile owner.
         */

        this.server.createList('article', 3, {
          author: otherUser,
          favorited: true
        });
        await (0, _testHelpers.visit)(`/profile/${profileOwner.username}`);
        await (0, _testHelpers.click)('[data-test-profile-tab="favorite-articles"]');
        assert.equal((0, _testHelpers.currentURL)(), `/profile/${profileOwner.username}/favorites`);
        assert.dom('[data-test-article-title]').exists({
          count: 3
        }, 'Expected a list of 3 articles favorited by profile owner');
        await (0, _testHelpers.click)('[data-test-profile-tab="my-articles"]');
        assert.dom('[data-test-article-title]').exists({
          count: 2
        }, 'Expected a list of 2 articles created by profile owner');
        assert.equal((0, _testHelpers.currentURL)(), `/profile/${profileOwner.username}`);
      });
      (0, _qunit.test)("clicking on an article's favorite button redirects user to login page", async function (assert) {
        const profileOwner = this.server.create('profile');
        /**
         * Articles written by profile owner.
         */

        this.server.create('article', 1, {
          author: profileOwner,
          favorited: false
        });
        await (0, _testHelpers.visit)(`/profile/${profileOwner.username}`);
        await (0, _testHelpers.click)('[data-test-favorite-article-button]');
        assert.equal((0, _testHelpers.currentURL)(), '/login');
      });
    });
    (0, _qunit.module)('logged in user', function (hooks) {
      (0, _user.setupLoggedInUser)(hooks, 'token');
      let user;
      hooks.beforeEach(function () {
        user = this.server.create('user', {
          email: 'bob@example.com',
          password: 'password123'
        });
        this.server.get('/user', schema => {
          return schema.users.first();
        });
      });
      (0, _qunit.test)('visiting their own profile sees a link to edit profile', async function (assert) {
        assert.expect(1);
        await (0, _testHelpers.visit)(`/profile/${user.username}`);
        await (0, _testHelpers.click)('[data-test-edit-profile-button]');
        assert.equal((0, _testHelpers.currentURL)(), `/settings`);
      });
      (0, _qunit.test)('visiting another user profile sees a link to follow the profile owner', async function (assert) {
        const otherUser = this.server.create('profile', {
          following: false
        });
        await (0, _testHelpers.visit)(`/profile/${otherUser.username}`);
        assert.dom('[data-test-follow-author-button]').includesText(`Follow ${otherUser.username}`, 'The profile is initially unfollowed');
        await (0, _testHelpers.click)('[data-test-follow-author-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

        await (0, _testHelpers.settled)();
        assert.dom('[data-test-follow-author-button]').includesText(`Unfollow ${otherUser.username}`, 'The profile is followed');
        await (0, _testHelpers.click)('[data-test-follow-author-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

        await (0, _testHelpers.settled)();
        assert.dom('[data-test-follow-author-button]').includesText(`Follow ${otherUser.username}`, 'The profile is unfollowed');
      });
      (0, _qunit.test)('favorite an article by the user', async function (assert) {
        const profileOwner = this.server.create('profile');
        this.server.create('article', 1, {
          author: profileOwner,
          favorited: false
        });
        await (0, _testHelpers.visit)(`/profile/${profileOwner.username}`);
        await (0, _testHelpers.click)('[data-test-favorite-article-button]'); // eslint-disable-next-line ember/no-settled-after-test-helper

        await (0, _testHelpers.settled)();
        assert.dom('[data-test-favorite-article-button="favorited"]').exists('Article should be favorited');
      });
    });
  });
});
define("ember-realworld/tests/acceptance/register-test", ["qunit", "faker", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _faker, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | register', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _user.setupLoggedOutUser)(hooks);
    (0, _qunit.test)('successful registration', async function (assert) {
      const user = this.server.create('user', {
        name: 'Test User',
        username: 'test_user',
        email: _faker.default.internet.email(),
        password: 'password123'
      });
      await (0, _testHelpers.visit)('/register');
      await (0, _testHelpers.fillIn)('[data-test-register-username]', user.username);
      await (0, _testHelpers.fillIn)('[data-test-register-email]', user.email);
      await (0, _testHelpers.fillIn)('[data-test-register-password]', user.password);
      await (0, _testHelpers.click)('[data-test-register-button]');
      assert.equal((0, _testHelpers.currentURL)(), '/', 'URL after login is Home');
      assert.dom('[data-test-nav-username]').hasText(user.username, 'Logged in username is shown');
      assert.dom('[data-test-nav-new-post]').exists('Logged in nav is shown');
      assert.dom('[data-test-nav-sign-up]').doesNotExist('Logged out nav is not shown');
    });
    (0, _qunit.test)('visiting /register has link to /login', async function (assert) {
      await (0, _testHelpers.visit)('/register');
      await (0, _testHelpers.click)('[data-test-login-link]');
      assert.equal((0, _testHelpers.currentURL)(), '/login', 'URL after click is Login');
    });
  });
});
define("ember-realworld/tests/acceptance/settings-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support/setup-mirage", "ember-realworld/tests/helpers/user"], function (_qunit, _testHelpers, _emberQunit, _setupMirage, _user) {
  "use strict";

  (0, _qunit.module)('Acceptance | settings', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _setupMirage.default)(hooks);
    (0, _qunit.module)('logged-out user', function () {
      (0, _user.setupLoggedOutUser)(hooks);
      (0, _qunit.test)('visiting /settings redirects to login', async function (assert) {
        await (0, _testHelpers.visit)('/settings');
        assert.equal((0, _testHelpers.currentURL)(), '/login');
      });
    });
    (0, _qunit.module)('logged-in user', function (hooks) {
      (0, _user.setupLoggedInUser)(hooks, 'token');
      hooks.beforeEach(function () {
        this.server.create('user', {
          email: 'bob@example.com',
          password: 'password123'
        });
        this.server.get('/user', schema => {
          return schema.users.first();
        });
      });
      (0, _qunit.test)('can edit their settings', async function (assert) {
        await (0, _testHelpers.visit)('/settings');
        const newSettings = {
          image: 'image',
          bio: 'bio',
          username: 'username',
          password: 'password',
          email: 'email@email.com'
        };
        assert.notEqual((0, _testHelpers.find)('[data-test-settings-form-input-image]').value, newSettings.image, 'Settings image input should be different');
        assert.notEqual((0, _testHelpers.find)('[data-test-settings-form-input-bio]').value, newSettings.bio, 'Settings bio input should be different');
        assert.notEqual((0, _testHelpers.find)('[data-test-settings-form-input-username]').value, newSettings.username, 'Settings username input should be different');
        assert.notEqual((0, _testHelpers.find)('[data-test-settings-form-input-password]').value, newSettings.password, 'Settings password input should be different');
        assert.notEqual((0, _testHelpers.find)('[data-test-settings-form-input-email]').value, newSettings.email, 'Settings email input should be different');
        const newSettingsEntries = Object.entries(newSettings);
        await Ember.RSVP.all(newSettingsEntries.map(([key, value]) => {
          return (0, _testHelpers.fillIn)(`[data-test-settings-form-input-${key}]`, value);
        }));
        await (0, _testHelpers.click)('[data-test-settings-form-button]');
        assert.dom('[data-test-settings-form-input-image]').hasValue(newSettings.image, 'Settings image input should be updated');
        assert.dom('[data-test-settings-form-input-bio]').hasValue(newSettings.bio, 'Settings bio input should be updated');
        assert.dom('[data-test-settings-form-input-username]').hasValue(newSettings.username, 'Settings username input should be updated');
        assert.dom('[data-test-settings-form-input-password]').hasValue(newSettings.password, 'Settings password input should be updated');
        assert.dom('[data-test-settings-form-input-email]').hasValue(newSettings.email, 'Settings email input should be updated');
      });
      (0, _qunit.test)('shows settings errors from server', async function (assert) {
        await (0, _testHelpers.visit)('/settings');
        await (0, _testHelpers.fillIn)('[data-test-settings-form-input-username]', Array(22).join('a'));
        await (0, _testHelpers.fillIn)('[data-test-settings-form-input-email]', '');
        await (0, _testHelpers.click)('[data-test-settings-form-button]');
        assert.dom('[data-test-settings-form-error-item]').exists({
          count: 2
        }, 'Two errors are visible');
        assert.dom('[data-test-settings-form-error-item="0"]').hasText('username is too long (maximum is 20 characters)');
        assert.dom('[data-test-settings-form-error-item="1"]').hasText("email can't be blank");
        assert.equal((0, _testHelpers.currentRouteName)(), 'settings', 'Should not navigate away from the page when there are errors');
      });
    });
  });
});
define("ember-realworld/tests/helpers/user", ["exports", "ember-realworld/services/session"], function (_exports, _session) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setupLoggedInUser = setupLoggedInUser;
  _exports.setupLoggedOutUser = setupLoggedOutUser;
  _exports.TOKEN = void 0;
  const TOKEN = 'auth-token';
  _exports.TOKEN = TOKEN;

  function setupLoggedInUser(hooks, token = TOKEN) {
    const originalToken = localStorage.getItem(_session.default.STORAGE_KEY);
    hooks.beforeEach(function () {
      localStorage.setItem(_session.default.STORAGE_KEY, token || '');
    });
    hooks.afterEach(function () {
      localStorage.setItem(_session.default.STORAGE_KEY, originalToken || '');
    });
  }

  function setupLoggedOutUser(hooks) {
    const originalToken = localStorage.getItem(_session.default.STORAGE_KEY);
    hooks.beforeEach(function () {
      localStorage.removeItem(_session.default.STORAGE_KEY);
    });
    hooks.afterEach(function () {
      localStorage.setItem(_session.default.STORAGE_KEY, originalToken || '');
    });
  }
});
define("ember-realworld/tests/integration/helpers/format-date-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | format-date', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it correctly formats the date', async function (assert) {
      this.set('inputValue', '2019-03-27T17:41:33.076Z');
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{format-date inputValue}}
      */
      {
        "id": "Z7sn+3U5",
        "block": "{\"symbols\":[],\"statements\":[[1,[30,[36,1],[[35,0]],null]]],\"hasEval\":false,\"upvars\":[\"inputValue\",\"format-date\"]}",
        "moduleName": "(unknown template module)"
      }));
      assert.dom(this.element).hasText('March 27, 2019');
    });
    (0, _qunit.test)('it handles invalid inputs', async function (assert) {
      this.set('inputValue', null);
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{format-date inputValue}}
      */
      {
        "id": "Z7sn+3U5",
        "block": "{\"symbols\":[],\"statements\":[[1,[30,[36,1],[[35,0]],null]]],\"hasEval\":false,\"upvars\":[\"inputValue\",\"format-date\"]}",
        "moduleName": "(unknown template module)"
      }));
      assert.dom(this.element).hasText('');
    });
  });
});
define("ember-realworld/tests/test-helper", ["ember-realworld/app", "ember-realworld/config/environment", "qunit", "@ember/test-helpers", "qunit-dom", "ember-qunit"], function (_app, _environment, QUnit, _testHelpers, _qunitDom, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _qunitDom.setup)(QUnit.assert);
  (0, _emberQunit.start)();
});
define('ember-realworld/config/environment', [], function() {
  var prefix = 'ember-realworld';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('ember-realworld/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
