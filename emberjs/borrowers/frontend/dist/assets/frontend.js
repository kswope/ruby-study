/* jshint ignore:start */

/* jshint ignore:end */

define('frontend/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    namespace: "api"
  });

});
define('frontend/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'frontend/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('frontend/controllers/application', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('frontend/controllers/friends/base', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    isValid: Ember['default'].computed("model.email", "model.firstName", "model.lastName", "twitter", function () {
      return !Ember['default'].isEmpty(this.get("model.email")) && !Ember['default'].isEmpty(this.get("model.firstName")) && !Ember['default'].isEmpty(this.get("model.lastName")) && !Ember['default'].isEmpty(this.get("model.twitter"));
    }),
    actions: {
      save: function save() {
        console.log("in save");
        if (this.get("isValid")) {
          var _this = this;
          console.log("is valid");
          this.get("model").save().then(function (friend) {
            _this.transitionToRoute("friends.show", friend);
          });
        } else {
          console.log("is not valid");
          this.set("errorMessage", "You have to fill all the fields");
        }
        return false;
      },
      cancel: function cancel() {
        return true;
      }
    }

  });

});
define('frontend/controllers/friends/edit', ['exports', 'frontend/controllers/friends/base'], function (exports, FriendsBaseController) {

  'use strict';

  exports['default'] = FriendsBaseController['default'].extend({

    actions: {
      cancel: function cancel() {
        this.transitionToRoute("friends.show", this.get("model"));
        return false;
      }
    }

  });

});
define('frontend/controllers/friends/new', ['exports', 'frontend/controllers/friends/base'], function (exports, FriendsBaseController) {

  'use strict';

  exports['default'] = FriendsBaseController['default'].extend({

    actions: {
      cancel: function cancel() {
        this.transitionToRoute("friends.index");
        return false;
      }
    }

  });

});
define('frontend/initializers/app-version', ['exports', 'frontend/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('frontend/initializers/export-application-global', ['exports', 'ember', 'frontend/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('frontend/models/friend', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    firstName: DS['default'].attr("string"),
    lastName: DS['default'].attr("string"),
    email: DS['default'].attr("string"),
    twitter: DS['default'].attr("string"),
    totalArticles: DS['default'].attr("number"),

    fullName: (function () {
      return [this.get("firstName"), this.get("lastName")].join(" ");
    }).property("firstName", "lastName")

  });

});
define('frontend/router', ['exports', 'ember', 'frontend/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  exports['default'] = Router.map(function () {
    this.resource("friends", function () {
      this.route("new");
      this.route("show", { path: ":friend_id" });
      this.route("edit", { path: ":friend_id/edit" });
    });
  });

});
define('frontend/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actions: {
      save: function save() {
        console.log("+---- save action bubbled up to application route");
        return true;
      },
      cancel: function cancel() {
        console.log("+---- cancel action bubbled up to application route");
        return true;
      }
    }
  });

});
define('frontend/routes/friends', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    actions: {
      save: function save() {
        console.log("+--- save action bubbled up to friends route");
        return true;
      },
      cancel: function cancel() {
        console.log("+--- cancel action bubbled up to friends route");
        return true;
      },
      "delete": function _delete(friend) {
        var _this = this;
        friend.destroyRecord().then(function () {
          _this.transitionTo("friends.index");
        });
      }
    }

  });

});
define('frontend/routes/friends/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/friends/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.findAll("friend");
    },
    actions: {} });

  // delete: function(friend){
  //   friend.destroyRecord();
  //   return false;
  // },

});
define('frontend/routes/friends/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.createRecord("friend");
    },
    actions: {
      save: function save() {
        console.log("+-- save action bubbled up to friends new route");
        return true;
      },
      cancel: function cancel() {
        console.log("+-- cancel action bubbled up to friends new route");
        return true;
      }
    }
  });

});
define('frontend/routes/friends/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    actions: {}

  });

  // delete: function(friend) {
  //   var _this = this;
  //   friend.destroyRecord().then(function() {
  //     _this.transitionTo('friends.index');
  //   });
  // }

});
define('frontend/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("Welcome to Ember.js");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Friends route");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,3,3,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends/-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("First Name: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Last Name: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Email: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Twitter ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("Friend details");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("input");
        dom.setAttribute(el2,"type","submit");
        dom.setAttribute(el2,"value","Save");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Cancel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [11]);
        var element2 = dom.childAt(element0, [15]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5, 1]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [7, 1]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [9, 1]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element1, [3]),0,0);
        var morph6 = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
        element(env, element0, context, "action", ["save"], {"on": "submit"});
        content(env, morph0, context, "errorMessage");
        inline(env, morph1, context, "input", [], {"value": get(env, context, "model.firstName")});
        inline(env, morph2, context, "input", [], {"value": get(env, context, "model.lastName")});
        inline(env, morph3, context, "input", [], {"value": get(env, context, "model.email")});
        inline(env, morph4, context, "input", [], {"value": get(env, context, "model.twitter")});
        content(env, morph5, context, "model.firstName");
        content(env, morph6, context, "model.lastName");
        element(env, element2, context, "action", ["cancel"], {});
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Editing ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        var morph1 = dom.createMorphAt(fragment,3,3,contextualElement);
        content(env, morph0, context, "model.fullName");
        inline(env, morph1, context, "partial", ["friends/form"], {});
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","#");
          var el4 = dom.createTextNode("Delete");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3, 0]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          inline(env, morph0, context, "link-to", [get(env, context, "friend.fullName"), "friends.show", get(env, context, "friend")], {});
          element(env, element1, context, "action", ["delete", get(env, context, "friend")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Friends Index");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Friends: ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [4, 3]),1,1);
        content(env, morph0, context, "model.length");
        block(env, morph1, context, "each", [get(env, context, "model")], {"keyword": "friend"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Add a new friend");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        inline(env, morph0, context, "partial", ["friends/form"], {});
        return fragment;
      }
    };
  }()));

});
define('frontend/templates/friends/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("First Name: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Last Name: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Email: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("twitter: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","#");
        var el4 = dom.createTextNode("Delete");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [11, 0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element0, [9]),0,0);
        content(env, morph0, context, "model.firstName");
        content(env, morph1, context, "model.lastName");
        content(env, morph2, context, "model.email");
        content(env, morph3, context, "model.twitter");
        inline(env, morph4, context, "link-to", ["Edit info", "friends.edit", get(env, context, "model")], {});
        element(env, element1, context, "action", ["delete", get(env, context, "model")], {});
        return fragment;
      }
    };
  }()));

});
define('frontend/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('frontend/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/friends/base.jshint', function () {

  'use strict';

  module('JSHint - controllers/friends');
  test('controllers/friends/base.js should pass jshint', function() { 
    ok(true, 'controllers/friends/base.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/friends/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/friends');
  test('controllers/friends/edit.js should pass jshint', function() { 
    ok(true, 'controllers/friends/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/friends/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/friends');
  test('controllers/friends/new.js should pass jshint', function() { 
    ok(true, 'controllers/friends/new.js should pass jshint.'); 
  });

});
define('frontend/tests/helpers/resolver', ['exports', 'ember/resolver', 'frontend/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('frontend/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('frontend/tests/helpers/start-app', ['exports', 'ember', 'frontend/app', 'frontend/router', 'frontend/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('frontend/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('frontend/tests/models/friend.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/friend.js should pass jshint', function() { 
    ok(false, 'models/friend.js should pass jshint.\nmodels/friend.js: line 11, col 67, Missing semicolon.\n\n1 error'); 
  });

});
define('frontend/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/friends.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/friends.js should pass jshint', function() { 
    ok(true, 'routes/friends.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/friends/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/friends');
  test('routes/friends/edit.js should pass jshint', function() { 
    ok(true, 'routes/friends/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/friends/index.jshint', function () {

  'use strict';

  module('JSHint - routes/friends');
  test('routes/friends/index.js should pass jshint', function() { 
    ok(true, 'routes/friends/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/friends/new.jshint', function () {

  'use strict';

  module('JSHint - routes/friends');
  test('routes/friends/new.js should pass jshint', function() { 
    ok(true, 'routes/friends/new.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/friends/show.jshint', function () {

  'use strict';

  module('JSHint - routes/friends');
  test('routes/friends/show.js should pass jshint', function() { 
    ok(true, 'routes/friends/show.js should pass jshint.'); 
  });

});
define('frontend/tests/test-helper', ['frontend/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('frontend/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('frontend/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:application", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/controllers/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/application-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/application-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/controllers/friends/base-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:friends/base", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/controllers/friends/base-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/friends');
  test('unit/controllers/friends/base-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/friends/base-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/controllers/friends/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:friends/edit", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/controllers/friends/edit-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/friends');
  test('unit/controllers/friends/edit-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/friends/edit-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/controllers/friends/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:friends/new", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/controllers/friends/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers/friends');
  test('unit/controllers/friends/new-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/friends/new-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/models/friend-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("friend", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('frontend/tests/unit/models/friend-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/friend-test.js should pass jshint', function() { 
    ok(true, 'unit/models/friend-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:application", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/application-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/friends-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:friends", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/friends-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/friends-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/friends-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/friends/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:friends/edit", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/friends/edit-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/friends');
  test('unit/routes/friends/edit-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/friends/edit-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/friends/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:friends/index", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/friends/index-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/friends');
  test('unit/routes/friends/index-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/friends/index-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/friends/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:friends/new", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/friends/new-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/friends');
  test('unit/routes/friends/new-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/friends/new-test.js should pass jshint.'); 
  });

});
define('frontend/tests/unit/routes/friends/show-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:friends/show", {});

  ember_qunit.test("it exists", function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('frontend/tests/unit/routes/friends/show-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes/friends');
  test('unit/routes/friends/show-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/friends/show-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('frontend/config/environment', ['ember'], function(Ember) {
  var prefix = 'frontend';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("frontend/tests/test-helper");
} else {
  require("frontend/app")["default"].create({"name":"frontend","version":"0.0.0.2098a144"});
}

/* jshint ignore:end */
//# sourceMappingURL=frontend.map