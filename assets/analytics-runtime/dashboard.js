// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, o) => (o = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), u = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && A(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && A(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), ee = k.port2;
		k.port1.onmessage = D, O = function() {
			ee.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function A(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, A(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), d = /* @__PURE__ */ o(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ee(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var A = /\/+/g;
	function j(e, t) {
		return typeof e == "object" && e && e.key != null ? ee("" + e.key) : t.toString(36);
	}
	function M(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function N(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, N(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + j(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(A, "$&/") + "/"), N(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(A, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + j(a, u), c += N(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + j(a, u++), c += N(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return N(M(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function P(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return N(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function te(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var ne = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function re(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, ne);
		} catch (e) {
			ne(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function ie(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else re(ie.bind(null, e));
	}
	var ae = {
		map: P,
		forEach: function(e, t, n) {
			P(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return P(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return P(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ae, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = ie, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: te
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = re, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), p = /* @__PURE__ */ o(((e, t) => {
	t.exports = f();
})), m = /* @__PURE__ */ o(((e) => {
	var t = p();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), h = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = /* @__PURE__ */ o(((e) => {
	var t = d(), n = p(), r = h();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function m(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && m(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), ee = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), M = Symbol.for("react.profiler"), N = Symbol.for("react.consumer"), P = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), ie = Symbol.for("react.memo"), ae = Symbol.for("react.lazy"), F = Symbol.for("react.activity"), oe = Symbol.for("react.legacy_hidden"), se = Symbol.for("react.memo_cache_sentinel"), ce = Symbol.for("react.view_transition"), le = Symbol.for("react.recoverable"), ue = Symbol.iterator;
	function de(e) {
		return typeof e != "object" || !e ? null : (e = ue && e[ue] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var fe = Symbol.for("react.client.reference");
	function pe(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === fe ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case A: return "Fragment";
			case M: return "Profiler";
			case j: return "StrictMode";
			case ne: return "Suspense";
			case re: return "SuspenseList";
			case F: return "Activity";
			case ce: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case ee: return "Portal";
			case P: return e.displayName || "Context";
			case N: return (e._context.displayName || "Context") + ".Consumer";
			case te:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ie: return t = e.displayName || null, t === null ? pe(e.type) || "Memo" : t;
			case ae:
				t = e._payload, e = e._init;
				try {
					return pe(e(t));
				} catch {}
		}
		return null;
	}
	var me = Array.isArray, I = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, he = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ge = [], _e = -1;
	function ve(e) {
		return { current: e };
	}
	function ye(e) {
		0 > _e || (e.current = ge[_e], ge[_e] = null, _e--);
	}
	function R(e, t) {
		_e++, ge[_e] = e.current, e.current = t;
	}
	var be = ve(null), xe = ve(null), Se = ve(null), Ce = ve(null);
	function we(e, t) {
		switch (R(Se, t), R(xe, e), R(be, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? dp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = dp(t), e = fp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		ye(be), R(be, e);
	}
	function Te() {
		ye(be), ye(xe), ye(Se);
	}
	function Ee(e) {
		var t = e.memoizedState;
		t !== null && (ch._currentValue = t.memoizedState, R(Ce, e)), t = be.current;
		var n = fp(t, e.type);
		t !== n && (R(xe, e), R(be, n));
	}
	function z(e) {
		xe.current === e && (ye(be), ye(xe)), Ce.current === e && (ye(Ce), ch._currentValue = he);
	}
	var De, Oe;
	function ke(e) {
		if (De === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			De = t && t[1] || "", Oe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + De + e + Oe;
	}
	var Ae = !1;
	function je(e, t) {
		if (!e || Ae) return "";
		Ae = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ae = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? ke(n) : "";
	}
	function Me(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return ke(e.type);
			case 16: return ke("Lazy");
			case 13: return e.child !== t && t !== null ? ke("Suspense Fallback") : ke("Suspense");
			case 19: return ke("SuspenseList");
			case 0:
			case 15: return je(e.type, !1);
			case 11: return je(e.type.render, !1);
			case 1: return je(e.type, !0);
			case 31: return ke("Activity");
			case 30: return ke("ViewTransition");
			default: return "";
		}
	}
	function Ne(e) {
		try {
			var t = "", n = null;
			do
				t += Me(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Pe = Object.prototype.hasOwnProperty, Fe = t.unstable_scheduleCallback, Ie = t.unstable_cancelCallback, Le = t.unstable_shouldYield, Re = t.unstable_requestPaint, ze = t.unstable_now, Be = t.unstable_getCurrentPriorityLevel, Ve = t.unstable_ImmediatePriority, He = t.unstable_UserBlockingPriority, Ue = t.unstable_NormalPriority, We = t.unstable_LowPriority, Ge = t.unstable_IdlePriority, Ke = t.log, qe = t.unstable_setDisableYieldValue, Je = null, Ye = null;
	function Xe(e) {
		if (typeof Ke == "function" && qe(e), Ye && typeof Ye.setStrictMode == "function") try {
			Ye.setStrictMode(Je, e);
		} catch {}
	}
	var Ze = Math.clz32 ? Math.clz32 : et, Qe = Math.log, $e = Math.LN2;
	function et(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Qe(e) / $e | 0) | 0;
	}
	var tt = 256, nt = 262144, rt = 4194304;
	function it(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function at(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = it(n))) : i = it(o) : i = it(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = it(n))) : i = it(o)) : i = it(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function ot(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function st(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - Ze(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ct(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function lt() {
		var e = rt;
		return rt <<= 1, !(rt & 62914560) && (rt = 4194304), e;
	}
	function ut(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function dt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function ft(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ze(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && pt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function pt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ze(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function mt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ze(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ht(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : gt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function gt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function _t(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function vt() {
		var e = L.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : wh(e.type)) : e;
	}
	function yt(e, t) {
		var n = L.p;
		try {
			return L.p = e, t();
		} finally {
			L.p = n;
		}
	}
	var bt = Math.random().toString(36).slice(2), xt = "__reactFiber$" + bt, St = "__reactProps$" + bt, Ct = "__reactContainer$" + bt, wt = "__reactEvents$" + bt, Tt = "__reactListeners$" + bt, Et = "__reactHandles$" + bt, Dt = "__reactResources$" + bt, Ot = "__reactMarker$" + bt, kt = "__reactLoad$" + bt;
	function At(e) {
		delete e[xt], delete e[St], delete e[Tt], delete e[Et];
	}
	function jt(e) {
		var t;
		if (t = e[xt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Ct] || n[xt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = pm(e); e !== null;) {
					if (n = e[xt]) return n;
					e = pm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Mt(e) {
		if (e = e[xt] || e[Ct]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Nt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Pt(e) {
		var t = e[Dt];
		return t ||= e[Dt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ft(e) {
		e[Ot] = !0;
	}
	function It(e) {
		e[kt] = void 0;
	}
	var Lt = /* @__PURE__ */ new Set(), Rt = {};
	function zt(e, t) {
		Bt(e, t), Bt(e + "Capture", t);
	}
	function Bt(e, t) {
		for (Rt[e] = t, e = 0; e < t.length; e++) Lt.add(t[e]);
	}
	var Vt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ht = {}, Ut = {};
	function Wt(e) {
		return Pe.call(Ut, e) ? !0 : Pe.call(Ht, e) ? !1 : Vt.test(e) ? Ut[e] = !0 : (Ht[e] = !0, !1);
	}
	var B = !1;
	function Gt() {
		var e = B;
		return B = !1, e;
	}
	function Kt(e, t, n) {
		if (Wt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function qt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Jt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Yt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Xt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Zt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Qt(e) {
		if (!e._valueTracker) {
			var t = Xt(e) ? "checked" : "value";
			e._valueTracker = Zt(e, t, "" + e[t]);
		}
	}
	function $t(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Xt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var en = /[\n"\\]/g;
	function tn(e) {
		return e.replace(en, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function nn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Yt(t)) : e.value !== "" + Yt(t) && (e.value = "" + Yt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : an(e, Yt(n)) : o === "number" && e.value == t ? an(e, Yt(e.value)) : an(e, Yt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Yt(s) : e.removeAttribute("name");
	}
	function rn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Qt(e);
				return;
			}
			n = n == null ? "" : "" + Yt(n), t = t == null ? n : "" + Yt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Qt(e);
	}
	function an(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function on(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Yt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function sn(e, t, n) {
		t != null && (t = "" + Yt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Yt(n);
	}
	function cn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (me(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Yt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Qt(e);
	}
	function ln(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var un = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function dn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || un.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function fn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", B = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (dn(e, a, r), B = !0);
		} else for (var o in t) t.hasOwnProperty(o) && dn(e, o, t[o]);
	}
	function pn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var mn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), hn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function gn(e) {
		return hn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function _n() {}
	var vn = null;
	function yn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var bn = null, xn = null;
	function Sn(e) {
		var t = Mt(e);
		if (t && (e = t.stateNode)) {
			var n = e[St] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (nn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + tn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[St] || null;
								if (!a) throw Error(i(90));
								nn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && $t(r);
					}
					break a;
				case "textarea":
					sn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && on(e, !!n.multiple, t, !1);
			}
		}
	}
	var Cn = !1;
	function wn(e, t, n) {
		if (Cn) return e(t, n);
		Cn = !0;
		try {
			return e(t);
		} finally {
			if (Cn = !1, (bn !== null || xn !== null) && (zd(), bn && (t = bn, e = xn, xn = bn = null, Sn(t), e))) for (t = 0; t < e.length; t++) Sn(e[t]);
		}
	}
	function Tn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[St] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var En = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Dn = !1;
	if (En) try {
		var On = {};
		Object.defineProperty(On, "passive", { get: function() {
			Dn = !0;
		} }), window.addEventListener("test", On, On), window.removeEventListener("test", On, On);
	} catch {
		Dn = !1;
	}
	var kn = null, An = null, jn = null;
	function Mn() {
		if (jn) return jn;
		var e, t = An, n = t.length, r, i = "value" in kn ? kn.value : kn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return jn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Nn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Pn() {
		return !0;
	}
	function Fn() {
		return !1;
	}
	function In(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Pn : Fn, this.isPropagationStopped = Fn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Pn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Pn);
			},
			persist: function() {},
			isPersistent: Pn
		}), t;
	}
	var Ln = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Rn = In(Ln), zn = D({}, Ln, {
		view: 0,
		detail: 0
	}), Bn = In(zn), Vn, Hn, Un, Wn = D({}, zn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: tr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Un && (Un && e.type === "mousemove" ? (Vn = e.screenX - Un.screenX, Hn = e.screenY - Un.screenY) : Hn = Vn = 0, Un = e), Vn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Hn;
		}
	}), Gn = In(Wn), Kn = In(D({}, Wn, { dataTransfer: 0 })), qn = In(D({}, zn, { relatedTarget: 0 })), Jn = In(D({}, Ln, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Yn = In(D({}, Ln, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Xn = In(D({}, Ln, { data: 0 })), Zn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Qn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, $n = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function er(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = $n[e]) ? !!t[e] : !1;
	}
	function tr() {
		return er;
	}
	var nr = In(D({}, zn, {
		key: function(e) {
			if (e.key) {
				var t = Zn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Nn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Qn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: tr,
		charCode: function(e) {
			return e.type === "keypress" ? Nn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Nn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), rr = In(D({}, Wn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), ir = In(D({}, Ln, { submitter: 0 })), ar = In(D({}, zn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: tr
	})), or = In(D({}, Ln, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), sr = In(D({}, Wn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), cr = In(D({}, Ln, {
		newState: 0,
		oldState: 0,
		source: 0
	})), lr = [
		9,
		13,
		27,
		32
	], ur = En && "CompositionEvent" in window, dr = null;
	En && "documentMode" in document && (dr = document.documentMode);
	var fr = En && "TextEvent" in window && !dr, pr = En && (!ur || dr && 8 < dr && 11 >= dr), mr = " ", hr = !1;
	function gr(e, t) {
		switch (e) {
			case "keyup": return lr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function _r(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var vr = !1;
	function yr(e, t) {
		switch (e) {
			case "compositionend": return _r(t);
			case "keypress": return t.which === 32 ? (hr = !0, mr) : null;
			case "textInput": return e = t.data, e === mr && hr ? null : e;
			default: return null;
		}
	}
	function br(e, t) {
		if (vr) return e === "compositionend" || !ur && gr(e, t) ? (e = Mn(), jn = An = kn = null, vr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return pr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var xr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Sr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!xr[e.type] : t === "textarea";
	}
	function Cr(e, t, n, r) {
		bn ? xn ? xn.push(r) : xn = [r] : bn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Rn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var V = null, wr = null;
	function Tr(e) {
		Vf(e, 0);
	}
	function Er(e) {
		if ($t(Nt(e))) return e;
	}
	function Dr(e, t) {
		if (e === "change") return t;
	}
	var Or = !1;
	if (En) {
		var kr;
		if (En) {
			var Ar = "oninput" in document;
			if (!Ar) {
				var jr = document.createElement("div");
				jr.setAttribute("oninput", "return;"), Ar = typeof jr.oninput == "function";
			}
			kr = Ar;
		} else kr = !1;
		Or = kr && (!document.documentMode || 9 < document.documentMode);
	}
	function Mr() {
		V && (V.detachEvent("onpropertychange", Nr), wr = V = null);
	}
	function Nr(e) {
		if (e.propertyName === "value" && Er(wr)) {
			var t = [];
			Cr(t, wr, e, yn(e)), wn(Tr, t);
		}
	}
	function Pr(e, t, n) {
		e === "focusin" ? (Mr(), V = t, wr = n, V.attachEvent("onpropertychange", Nr)) : e === "focusout" && Mr();
	}
	function Fr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Er(wr);
	}
	function Ir(e, t) {
		if (e === "click") return Er(t);
	}
	function H(e, t) {
		if (e === "input" || e === "change") return Er(t);
	}
	function Lr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Rr = typeof Object.is == "function" ? Object.is : Lr;
	function zr(e, t) {
		if (Rr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Pe.call(t, i) || !Rr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Br(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Vr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Hr(e, t) {
		var n = Vr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Vr(n);
		}
	}
	function Ur(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ur(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Wr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Br(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Br(e.document);
		}
		return t;
	}
	function Gr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Kr = En && "documentMode" in document && 11 >= document.documentMode, qr = null, Jr = null, Yr = null, Xr = !1;
	function Zr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Xr || qr == null || qr !== Br(r) || (r = qr, "selectionStart" in r && Gr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Yr && zr(Yr, r) || (Yr = r, r = Jf(Jr, "onSelect"), 0 < r.length && (t = new Rn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = qr)));
	}
	function Qr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var $r = {
		animationend: Qr("Animation", "AnimationEnd"),
		animationiteration: Qr("Animation", "AnimationIteration"),
		animationstart: Qr("Animation", "AnimationStart"),
		transitionrun: Qr("Transition", "TransitionRun"),
		transitionstart: Qr("Transition", "TransitionStart"),
		transitioncancel: Qr("Transition", "TransitionCancel"),
		transitionend: Qr("Transition", "TransitionEnd")
	}, ei = {}, ti = {};
	En && (ti = document.createElement("div").style, "AnimationEvent" in window || (delete $r.animationend.animation, delete $r.animationiteration.animation, delete $r.animationstart.animation), "TransitionEvent" in window || delete $r.transitionend.transition);
	function ni(e) {
		if (ei[e]) return ei[e];
		if (!$r[e]) return e;
		var t = $r[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ti) return ei[e] = t[n];
		return e;
	}
	var ri = ni("animationend"), ii = ni("animationiteration"), ai = ni("animationstart"), oi = ni("transitionrun"), si = ni("transitionstart"), ci = ni("transitioncancel"), li = ni("transitionend"), ui = /* @__PURE__ */ new Map(), di = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	di.push("scrollEnd");
	function fi(e, t) {
		ui.set(e, t), zt(t, [e]);
	}
	var pi = 0;
	function mi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = pi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function hi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function gi(e, t) {
		return e = hi(e), t = hi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var _i = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, vi = [], yi = 0, bi = 0;
	function xi() {
		for (var e = yi, t = bi = yi = 0; t < e;) {
			var n = vi[t];
			vi[t++] = null;
			var r = vi[t];
			vi[t++] = null;
			var i = vi[t];
			vi[t++] = null;
			var a = vi[t];
			if (vi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ti(n, i, a);
		}
	}
	function Si(e, t, n, r) {
		vi[yi++] = e, vi[yi++] = t, vi[yi++] = n, vi[yi++] = r, bi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Ci(e, t, n, r) {
		return Si(e, t, n, r), Ei(e);
	}
	function wi(e, t) {
		return Si(e, null, null, t), Ei(e);
	}
	function Ti(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ze(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Ei(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Di = {};
	function Oi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ki(e, t, n, r) {
		return new Oi(e, t, n, r);
	}
	function Ai(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function ji(e, t) {
		var n = e.alternate;
		return n === null ? (n = ki(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Mi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Ni(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ai(r) && (s = 1);
		else if (typeof r == "string") s = Jm(e, n, be.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case F: return e = ki(31, n, t, a), e.elementType = F, e.lanes = o, e;
			case A: return Pi(n.children, a, o, t);
			case j:
				s = 8, a |= 24;
				break;
			case M: return e = ki(12, n, t, a | 2), e.elementType = M, e.lanes = o, e;
			case ne: return e = ki(13, n, t, a), e.elementType = ne, e.lanes = o, e;
			case re: return e = ki(19, n, t, a), e.elementType = re, e.lanes = o, e;
			case oe:
			case ce: return e = a | 32, e = ki(30, n, t, e), e.elementType = ce, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case P:
						s = 10;
						break a;
					case N:
						s = 9;
						break a;
					case te:
						s = 11;
						break a;
					case ie:
						s = 14;
						break a;
					case ae:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ki(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Pi(e, t, n, r) {
		return e = ki(7, e, r, t), e.lanes = n, e;
	}
	function Fi(e, t, n) {
		return e = ki(6, e, null, t), e.lanes = n, e;
	}
	function Ii(e) {
		var t = ki(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Li(e, t, n) {
		return t = ki(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ri = /* @__PURE__ */ new WeakMap();
	function zi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ri.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Ne(t)
			}, Ri.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Ne(t)
		};
	}
	var Bi = [], Vi = 0, Hi = null, Ui = 0, Wi = [], Gi = 0, Ki = null, qi = 1, Ji = "";
	function Yi(e, t) {
		Bi[Vi++] = Ui, Bi[Vi++] = Hi, Hi = e, Ui = t;
	}
	function Xi(e, t, n) {
		Wi[Gi++] = qi, Wi[Gi++] = Ji, Wi[Gi++] = Ki, Ki = e;
		var r = qi;
		e = Ji;
		var i = 32 - Ze(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ze(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, qi = 1 << 32 - Ze(t) + i | n << i | r, Ji = a + e;
		} else qi = 1 << a | n << i | r, Ji = e;
	}
	function Zi(e) {
		e.return !== null && (Yi(e, 1), Xi(e, 1, 0));
	}
	function Qi(e) {
		for (; e === Hi;) Hi = Bi[--Vi], Bi[Vi] = null, Ui = Bi[--Vi], Bi[Vi] = null;
		for (; e === Ki;) Ki = Wi[--Gi], Wi[Gi] = null, Ji = Wi[--Gi], Wi[Gi] = null, qi = Wi[--Gi], Wi[Gi] = null;
	}
	function $i(e, t) {
		Wi[Gi++] = qi, Wi[Gi++] = Ji, Wi[Gi++] = Ki, qi = t.id, Ji = t.overflow, Ki = e;
	}
	var ea = null, ta = null, U = !1, na = null, ra = !1, ia = Error(i(519));
	function aa(e) {
		throw da(zi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ia;
	}
	function oa(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[xt] = e, t[St] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Z.length; n++) Q(Z[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), rn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), cn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = _n), t = !0) : t = !1, t || aa(e, !0);
	}
	function sa(e) {
		for (ea = e.return; ea;) switch (ea.tag) {
			case 5:
			case 31:
			case 13:
				ra = !1;
				return;
			case 27:
			case 3:
				ra = !0;
				return;
			default: ea = ea.return;
		}
	}
	function ca(e) {
		if (e !== ea) return !1;
		if (!U) return sa(e), U = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || mp(e.type, e.memoizedProps)), n = !n), n && ta && aa(e), sa(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ta = fm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ta = fm(e);
		} else t === 27 ? (t = ta, Cp(e.type) ? (e = dm, dm = null, ta = e) : ta = t) : ta = ea ? um(e.stateNode.nextSibling) : null;
		return !0;
	}
	function la() {
		ta = ea = null, U = !1;
	}
	function ua() {
		var e = na;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), na = null), e;
	}
	function da(e) {
		na === null ? na = [e] : na.push(e);
	}
	var fa = ve(null), pa = null, ma = null;
	function ha(e, t, n) {
		R(fa, t._currentValue), t._currentValue = n;
	}
	function ga(e) {
		e._currentValue = fa.current, ye(fa);
	}
	function _a(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function va(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), _a(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), _a(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), _a(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ya(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Rr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ce.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [ch] : e.push(ch));
			}
			a = a.return;
		}
		return e !== null && va(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ba(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Rr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function xa(e) {
		pa = e, ma = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Sa(e) {
		return wa(pa, e);
	}
	function Ca(e, t) {
		return pa === null && xa(e), wa(e, t);
	}
	function wa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ma === null) {
			if (e === null) throw Error(i(308));
			ma = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ma = ma.next = t;
		return n;
	}
	var Ta = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Ea = t.unstable_scheduleCallback, Da = t.unstable_NormalPriority, Oa = {
		$$typeof: P,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ka() {
		return {
			controller: new Ta(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Aa(e) {
		e.refCount--, e.refCount === 0 && Ea(Da, function() {
			e.controller.abort();
		});
	}
	function ja(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ma = null;
	function Na(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Pa = null, Fa = 0, Ia = 0, W = null;
	function La(e, t) {
		if (Pa === null) {
			var n = Pa = [];
			Fa = 0, Ia = Ff(), W = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Fa++, t.then(Ra, Ra), t;
	}
	function Ra() {
		if (--Fa === 0 && (Ma = null, Pa !== null)) {
			W !== null && (W.status = "fulfilled");
			var e = Pa;
			Pa = null, Ia = 0, W = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function za(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ba = I.S;
	I.S = function(e, t) {
		if (hd = ze(), typeof t == "object" && t && typeof t.then == "function" && La(e, t), Ma !== null) for (var n = xf; n !== null;) ja(n, Ma), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = xf; r !== null;) ja(r, n), r = r.next;
			if (Ia !== 0) {
				r = Ma, r === null && (r = Ma = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ba !== null && Ba(e, t);
	};
	var Va = ve(null);
	function Ha() {
		var e = Va.current;
		return e === null ? Qu.pooledCache : e;
	}
	function Ua(e, t) {
		t === null ? R(Va, Va.current) : R(Va, t.pool);
	}
	function Wa() {
		var e = Ha();
		return e === null ? null : {
			parent: Oa._currentValue,
			pool: e
		};
	}
	var Ga = Error(i(460)), Ka = Error(i(474)), qa = Error(i(542)), Ja = { then: function() {} };
	function Ya(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Xa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(_n, _n), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, eo(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(_n, _n);
				else {
					if (e = Qu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, eo(e), e;
				}
				throw Qa = t, Ga;
		}
	}
	function Za(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Qa = e, Ga) : e;
		}
	}
	var Qa = null;
	function $a() {
		if (Qa === null) throw Error(i(459));
		var e = Qa;
		return Qa = null, e;
	}
	function eo(e) {
		if (e === Ga || e === qa) throw Error(i(483));
	}
	var to = null, no = 0;
	function ro(e) {
		var t = no;
		return no += 1, to === null && (to = []), Xa(to, e, t);
	}
	function io(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function ao(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function oo(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = ji(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Fi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === A ? (e = d(e, t, n.props.children, r, n.key), io(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ae && Za(i) === t.type) ? (t = a(t, n.props), io(t, n), t.return = e, t) : (t = Ni(n.type, n.key, n.props, null, e.mode, r), io(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Li(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Pi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Fi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = Ni(t.type, t.key, t.props, null, e.mode, n), io(n, t), n.return = e, n;
					case ee: return t = Li(t, e.mode, n), t.return = e, t;
					case ae: return t = Za(t), f(e, t, n);
				}
				if (me(t) || de(t)) return t = Pi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, ro(t), n);
				if (t.$$typeof === P) return f(e, Ca(e, t), n);
				ao(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case k: return n.key === i ? l(e, t, n, r) : null;
					case ee: return n.key === i ? u(e, t, n, r) : null;
					case ae: return n = Za(n), p(e, t, n, r);
				}
				if (me(n) || de(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, ro(n), r);
				if (n.$$typeof === P) return p(e, t, Ca(e, n), r);
				ao(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case ee: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ae: return r = Za(r), m(e, t, n, r, i);
				}
				if (me(r) || de(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, ro(r), i);
				if (r.$$typeof === P) return m(e, t, n, Ca(t, r), i);
				ao(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), U && Yi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return U && Yi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), U && Yi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), U && Yi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return U && Yi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), U && Yi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === A && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case k:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === A) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), io(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ae && Za(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), io(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === A ? (c = Pi(o.props.children, e.mode, c, o.key), io(c, o), c.return = e, e = c) : (c = Ni(o.type, o.key, o.props, null, e.mode, c), io(c, o), c.return = e, e = c);
						}
						return s(e);
					case ee:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Li(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ae: return o = Za(o), _(e, r, o, c);
				}
				if (me(o)) return h(e, r, o, c);
				if (de(o)) {
					if (l = de(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, ro(o), c);
				if (o.$$typeof === P) return _(e, r, Ca(e, o), c);
				ao(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Fi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				no = 0;
				var i = _(e, t, n, r);
				return to = null, i;
			} catch (t) {
				if (t === Ga || t === qa) throw t;
				var a = ki(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var so = oo(!0), co = oo(!1), lo = !1;
	function uo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function fo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function po(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function mo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, J & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Ei(e), Ti(e, null, n), t;
		}
		return Si(e, r, t, n), Ei(e);
	}
	function ho(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, mt(e, n);
		}
	}
	function go(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var _o = !1;
	function vo() {
		if (_o) {
			var e = W;
			if (e !== null) throw e;
		}
	}
	function yo(e, t, n, r) {
		_o = !1;
		var i = e.updateQueue;
		lo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (X & f) === f : (r & f) === f) {
					f !== 0 && f === Ia && (_o = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = D({}, d, f);
								break a;
							case 2: lo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function bo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function xo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) bo(n[e], t);
	}
	var So = ve(null), Co = ve(0);
	function wo(e, t) {
		e = id, R(Co, e), R(So, t), id = e | t.baseLanes;
	}
	function To() {
		R(Co, id), R(So, So.current);
	}
	function Eo() {
		id = Co.current, ye(So), ye(Co);
	}
	var Do = ve(null), Oo = null;
	function ko(e) {
		var t = e.alternate;
		R(Po, Po.current & 1), R(Do, e), Oo === null && (t === null || So.current !== null || t.memoizedState !== null) && (Oo = e);
	}
	function Ao(e) {
		R(Po, Po.current), R(Do, e), Oo === null && (Oo = e);
	}
	function jo(e) {
		e.tag === 22 ? (R(Po, Po.current), R(Do, e), Oo === null && (Oo = e)) : Mo();
	}
	function Mo() {
		R(Po, Po.current), R(Do, Do.current);
	}
	function No(e) {
		ye(Do), Oo === e && (Oo = null), ye(Po);
	}
	var Po = ve(0);
	function Fo(e, t) {
		R(Do, Do.current), R(Po, t);
	}
	function Io(e) {
		ye(Po), ye(Do), Oo === e && (Oo = null);
	}
	function Lo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || sm(n) || cm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Ro = 0, G = null, zo = null, Bo = null, Vo = !1, Ho = !1, Uo = !1, Wo = 0, Go = 0, Ko = null, qo = 0;
	function Jo() {
		throw Error(i(321));
	}
	function Yo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Rr(e[n], t[n])) return !1;
		return !0;
	}
	function Xo(e, t, n, r, i, a) {
		return Ro = a, G = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, I.H = e === null || e.memoizedState === null ? fc : pc, Uo = !1, a = n(r, i), Uo = !1, Ho && (a = Qo(t, n, r, i)), Zo(e), a;
	}
	function Zo(e) {
		I.H = dc;
		var t = zo !== null && zo.next !== null;
		if (Ro = 0, Bo = zo = G = null, Vo = !1, Go = 0, Ko = null, t) throw Error(i(300));
		e === null || Ac || (e = e.dependencies, e !== null && ba(e) && (Ac = !0));
	}
	function Qo(e, t, n, r) {
		G = e;
		var a = 0;
		do {
			if (Ho && (Ko = null), Go = 0, Ho = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Bo = zo = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			I.H = mc, o = t(n, r);
		} while (Ho);
		return o;
	}
	function $o() {
		var e = I.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? as(t) : t, e = e.useState()[0], (zo === null ? null : zo.memoizedState) !== e && (G.flags |= 1024), t;
	}
	function es() {
		var e = Wo !== 0;
		return Wo = 0, e;
	}
	function ts(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ns(e) {
		if (Vo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Vo = !1;
		}
		Ro = 0, Bo = zo = G = null, Ho = !1, Go = Wo = 0, Ko = null;
	}
	function rs() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Bo === null ? G.memoizedState = Bo = e : Bo = Bo.next = e, Bo;
	}
	function is() {
		if (zo === null) {
			var e = G.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = zo.next;
		var t = Bo === null ? G.memoizedState : Bo.next;
		if (t !== null) Bo = t, zo = e;
		else {
			if (e === null) throw G.alternate === null ? Error(i(467)) : Error(i(310));
			zo = e, e = {
				memoizedState: zo.memoizedState,
				baseState: zo.baseState,
				baseQueue: zo.baseQueue,
				queue: zo.queue,
				next: null
			}, Bo === null ? G.memoizedState = Bo = e : Bo = Bo.next = e;
		}
		return Bo;
	}
	function K() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function as(e) {
		var t = Go;
		return Go += 1, Ko === null && (Ko = []), e = Xa(Ko, e, t), t = G, (Bo === null ? t.memoizedState : Bo.next) === null && (t = t.alternate, I.H = t === null || t.memoizedState === null ? fc : pc), e;
	}
	function os(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return as(e);
			if (e.$$typeof === le) return;
			if (e.$$typeof === P) return Sa(e);
		}
		throw Error(i(438, String(e)));
	}
	function ss(e) {
		var t = null, n = G.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = G.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = K(), G.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = se;
		return t.index++, n;
	}
	function cs(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ls(e) {
		return us(is(), zo, e);
	}
	function us(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Ro & f) === f : (X & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ia && (d = !0);
					else if ((Ro & p) === p) {
						u = u.next, p === Ia && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, G.lanes |= p, od |= p;
					f = u.action, Uo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, G.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Rr(o, e.memoizedState) && (Ac = !0, d && (n = W, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ds(e) {
		var t = is(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Rr(o, t.memoizedState) || (Ac = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function fs(e, t, n) {
		var r = G, a = is(), o = U;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Rr((zo || a).memoizedState, n);
		if (s && (a.memoizedState = n, Ac = !0), a = a.queue, Ls(hs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Bo !== null && !!(Bo.memoizedState.tag & 1), Ms(e ? 9 : 8, { destroy: void 0 }, ms.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Qu === null) throw Error(i(349));
			o || Ro & 127 || ps(r, t, n);
		}
		return n;
	}
	function ps(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = G.updateQueue, t === null ? (t = K(), G.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ms(e, t, n, r) {
		t.value = n, t.getSnapshot = r, gs(t) && _s(e);
	}
	function hs(e, t, n) {
		return n(function() {
			gs(t) && _s(e);
		});
	}
	function gs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Rr(e, n);
		} catch {
			return !0;
		}
	}
	function _s(e) {
		var t = wi(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function vs(e) {
		var t = rs();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Uo) {
				Xe(!0);
				try {
					n();
				} finally {
					Xe(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: cs,
			lastRenderedState: e
		}, t;
	}
	function ys(e, t, n, r) {
		return e.baseState = n, us(e, zo, typeof r == "function" ? r : cs);
	}
	function bs(e, t, n, r, a) {
		if (cc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			I.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, xs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function xs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = I.T, o = {};
			o.types = a === null ? null : a.types, I.T = o;
			try {
				var s = n(i, r), c = I.S;
				c !== null && c(o, s), Ss(e, t, s);
			} catch (n) {
				ws(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), I.T = a;
			}
		} else try {
			a = n(i, r), Ss(e, t, a);
		} catch (n) {
			ws(e, t, n);
		}
	}
	function Ss(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Cs(e, t, n);
		}, function(n) {
			return ws(e, t, n);
		}) : Cs(e, t, n);
	}
	function Cs(e, t, n) {
		t.status = "fulfilled", t.value = n, Ts(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, xs(e, n)));
	}
	function ws(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ts(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ts(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Es(e, t) {
		return t;
	}
	function Ds(e, t) {
		if (U) {
			var n = Qu.formState;
			if (n !== null) {
				a: {
					var r = G;
					if (U) {
						if (ta) {
							b: {
								for (var i = ta, a = ra; i.nodeType !== 8;) if (!a || (i = um(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								ta = um(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						aa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = rs(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Es,
			lastRenderedState: t
		}, n.queue = r, n = ac.bind(null, G, r), r.dispatch = n, r = vs(!1), a = sc.bind(null, G, !1, r.queue), r = rs(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = bs.bind(null, G, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Os(e) {
		return ks(is(), zo, e);
	}
	function ks(e, t, n) {
		if (t = us(e, t, Es)[0], e = ls(cs)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = as(t);
		} catch (e) {
			throw e === Ga ? qa : e;
		}
		else r = t;
		t = is();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (G.flags |= 2048, Ms(9, { destroy: void 0 }, As.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function As(e, t) {
		e.action = t;
	}
	function js(e) {
		var t = is(), n = zo;
		if (n !== null) return ks(t, n, e);
		is(), t = t.memoizedState, n = is();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ms(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = G.updateQueue, t === null && (t = K(), G.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Ns() {
		return is().memoizedState;
	}
	function Ps(e, t, n, r) {
		var i = rs();
		G.flags |= e, i.memoizedState = Ms(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Fs(e, t, n, r) {
		var i = is();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		zo !== null && r !== null && Yo(r, zo.memoizedState.deps) ? i.memoizedState = Ms(t, a, n, r) : (G.flags |= e, i.memoizedState = Ms(1 | t, a, n, r));
	}
	function Is(e, t) {
		Ps(8390656, 8, e, t);
	}
	function Ls(e, t) {
		Fs(2048, 8, e, t);
	}
	function Rs(e) {
		G.flags |= 4;
		var t = G.updateQueue;
		if (t === null) t = K(), G.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function zs(e) {
		var t = is().memoizedState;
		return Rs({
			ref: t,
			nextImpl: e
		}), function() {
			if (J & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Bs(e, t) {
		return Fs(4, 2, e, t);
	}
	function Vs(e, t) {
		return Fs(4, 4, e, t);
	}
	function Hs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Us(e, t, n) {
		n = n == null ? null : n.concat([e]), Fs(4, 4, Hs.bind(null, t, e), n);
	}
	function Ws() {}
	function Gs(e, t) {
		var n = is();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Yo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ks(e, t) {
		var n = is();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Yo(t, r[1])) return r[0];
		if (r = e(), Uo) {
			Xe(!0);
			try {
				e();
			} finally {
				Xe(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function qs(e, t, n) {
		return n === void 0 || Ro & 1073741824 && !(X & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), G.lanes |= e, od |= e, n);
	}
	function Js(e, t, n, r) {
		return Rr(n, t) ? n : So.current === null ? !(Ro & 106) || Ro & 1073741824 && !(X & 261930) ? (Ac = !0, e.memoizedState = n) : (e = Md(), G.lanes |= e, od |= e, t) : (e = qs(e, n, r), Rr(e, t) || (Ac = !0), e);
	}
	function Ys(e, t, n, r, i) {
		var a = L.p;
		L.p = a !== 0 && 8 > a ? a : 8;
		var o = I.T, s = {};
		s.types = o === null ? null : o.types, I.T = s, sc(e, !1, t, n);
		try {
			var c = i(), l = I.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? oc(e, t, za(c, r), jd(e)) : oc(e, t, r, jd(e));
		} catch (n) {
			oc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			L.p = a, o !== null && s.types !== null && (o.types = s.types), I.T = o;
		}
	}
	function Xs() {}
	function Zs(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Qs(e).queue;
		Ys(e, a, t, he, n === null ? Xs : function() {
			return $s(e), n(r);
		});
	}
	function Qs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: he,
			baseState: he,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: cs,
				lastRenderedState: he
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: cs,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function $s(e) {
		var t = Qs(e);
		t.next === null && (t = e.alternate.memoizedState), oc(e, t.next.queue, {}, jd());
	}
	function ec() {
		return Sa(ch);
	}
	function tc() {
		return is().memoizedState;
	}
	function nc() {
		return is().memoizedState;
	}
	function rc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = po(n);
					var r = mo(t, e, n);
					r !== null && (Pd(r, t, n), ho(r, t, n)), t = { cache: ka() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function ic(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, cc(e) ? lc(t, n) : (n = Ci(e, t, n, r), n !== null && (Pd(n, e, r), uc(n, t, r)));
	}
	function ac(e, t, n) {
		oc(e, t, n, jd());
	}
	function oc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (cc(e)) lc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Rr(s, o)) return Si(e, t, i, 0), Qu === null && xi(), !1;
			} catch {}
			if (n = Ci(e, t, i, r), n !== null) return Pd(n, e, r), uc(n, t, r), !0;
		}
		return !1;
	}
	function sc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Ff(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, cc(e)) {
			if (t) throw Error(i(479));
		} else t = Ci(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function cc(e) {
		var t = e.alternate;
		return e === G || t !== null && t === G;
	}
	function lc(e, t) {
		Ho = Vo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function uc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, mt(e, n);
		}
	}
	var dc = {
		readContext: Sa,
		use: os,
		useCallback: Jo,
		useContext: Jo,
		useEffect: Jo,
		useImperativeHandle: Jo,
		useLayoutEffect: Jo,
		useInsertionEffect: Jo,
		useMemo: Jo,
		useReducer: Jo,
		useRef: Jo,
		useState: Jo,
		useDebugValue: Jo,
		useDeferredValue: Jo,
		useTransition: Jo,
		useSyncExternalStore: Jo,
		useId: Jo,
		useHostTransitionStatus: Jo,
		useFormState: Jo,
		useActionState: Jo,
		useOptimistic: Jo,
		useMemoCache: Jo,
		useCacheRefresh: Jo,
		useEffectEvent: Jo
	}, fc = {
		readContext: Sa,
		use: os,
		useCallback: function(e, t) {
			return rs().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Sa,
		useEffect: Is,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ps(4194308, 4, Hs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ps(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ps(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = rs();
			t = t === void 0 ? null : t;
			var r = e();
			if (Uo) {
				Xe(!0);
				try {
					e();
				} finally {
					Xe(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = rs();
			if (n !== void 0) {
				var i = n(t);
				if (Uo) {
					Xe(!0);
					try {
						n(t);
					} finally {
						Xe(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = ic.bind(null, G, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = rs();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = vs(e);
			var t = e.queue, n = ac.bind(null, G, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ws,
		useDeferredValue: function(e, t) {
			return qs(rs(), e, t);
		},
		useTransition: function() {
			var e = vs(!1);
			return e = Ys.bind(null, G, e.queue, !0, !1), rs().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = G, a = rs();
			if (U) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Qu === null) throw Error(i(349));
				X & 127 || ps(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Is(hs.bind(null, r, o, e), [e]), r.flags |= 2048, Ms(9, { destroy: void 0 }, ms.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = rs(), t = Qu.identifierPrefix;
			if (U) {
				var n = Ji, r = qi;
				n = (r & ~(1 << 32 - Ze(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Wo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = qo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: ec,
		useFormState: Ds,
		useActionState: Ds,
		useOptimistic: function(e) {
			var t = rs();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = sc.bind(null, G, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ss,
		useCacheRefresh: function() {
			return rs().memoizedState = rc.bind(null, G);
		},
		useEffectEvent: function(e) {
			var t = rs(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (J & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, pc = {
		readContext: Sa,
		use: os,
		useCallback: Gs,
		useContext: Sa,
		useEffect: Ls,
		useImperativeHandle: Us,
		useInsertionEffect: Bs,
		useLayoutEffect: Vs,
		useMemo: Ks,
		useReducer: ls,
		useRef: Ns,
		useState: function() {
			return ls(cs);
		},
		useDebugValue: Ws,
		useDeferredValue: function(e, t) {
			return Js(is(), zo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ls(cs)[0], t = is().memoizedState;
			return [typeof e == "boolean" ? e : as(e), t];
		},
		useSyncExternalStore: fs,
		useId: tc,
		useHostTransitionStatus: ec,
		useFormState: Os,
		useActionState: Os,
		useOptimistic: function(e, t) {
			return ys(is(), zo, e, t);
		},
		useMemoCache: ss,
		useCacheRefresh: nc,
		useEffectEvent: zs
	}, mc = {
		readContext: Sa,
		use: os,
		useCallback: Gs,
		useContext: Sa,
		useEffect: Ls,
		useImperativeHandle: Us,
		useInsertionEffect: Bs,
		useLayoutEffect: Vs,
		useMemo: Ks,
		useReducer: ds,
		useRef: Ns,
		useState: function() {
			return ds(cs);
		},
		useDebugValue: Ws,
		useDeferredValue: function(e, t) {
			var n = is();
			return zo === null ? qs(n, e, t) : Js(n, zo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ds(cs)[0], t = is().memoizedState;
			return [typeof e == "boolean" ? e : as(e), t];
		},
		useSyncExternalStore: fs,
		useId: tc,
		useHostTransitionStatus: ec,
		useFormState: js,
		useActionState: js,
		useOptimistic: function(e, t) {
			var n = is();
			return zo === null ? (n.baseState = e, [e, n.queue.dispatch]) : ys(n, zo, e, t);
		},
		useMemoCache: ss,
		useCacheRefresh: nc,
		useEffectEvent: zs
	};
	function hc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var gc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = po(r);
			i.payload = t, n != null && (i.callback = n), t = mo(e, i, r), t !== null && (Pd(t, e, r), ho(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = po(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = mo(e, i, r), t !== null && (Pd(t, e, r), ho(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = po(n);
			r.tag = 2, t != null && (r.callback = t), t = mo(e, r, n), t !== null && (Pd(t, e, n), ho(t, e, n));
		}
	};
	function _c(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !zr(n, r) || !zr(i, a) : !0;
	}
	function vc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && gc.enqueueReplaceState(t, t.state, null);
	}
	function yc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function bc(e) {
		_i(e);
	}
	function xc(e) {
		console.error(e);
	}
	function Sc(e) {
		_i(e);
	}
	function Cc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function wc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Tc(e, t, n) {
		return n = po(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Cc(e, t);
		}, n;
	}
	function Ec(e) {
		return e = po(e), e.tag = 3, e;
	}
	function Dc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				wc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			wc(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Oc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ya(t, n, a, !0), n = Do.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Oo === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ja ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), hf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ja ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), hf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return hf(e, r, a), Kd(), !1;
		}
		if (U) return t = Do.current, t === null ? (r !== ia && (t = Error(i(423), { cause: r }), da(zi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = zi(r, n), a = Tc(e.stateNode, r, a), go(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ia && (e = Error(i(422), { cause: r }), da(zi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = zi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = zi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Tc(n.stateNode, r, e), go(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Ec(a), Dc(a, e, n, r), go(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var kc = Error(i(461)), Ac = !1;
	function jc(e, t, n, r) {
		t.child = e === null ? co(t, null, n, r) : so(t, e.child, n, r);
	}
	function Mc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return xa(t), r = Xo(e, t, n, o, a, i), s = es(), e !== null && !Ac ? (ts(e, t, i), al(e, t, i)) : (U && s && Zi(t), t.flags |= 1, jc(e, t, r, i), t.child);
	}
	function Nc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ai(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Pc(e, t, a, r, i)) : (e = Ni(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ol(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? zr : n, n(o, r) && e.ref === t.ref) return al(e, t, i);
		}
		return t.flags |= 1, e = ji(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Pc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (zr(a, r) && e.ref === t.ref) {
				if (Ac = !1, t.pendingProps = r = a, ol(e, i)) e.flags & 131072 && (Ac = !0);
				else return t.lanes = e.lanes, al(e, t, i);
			}
		}
		return Vc(e, t, n, r, i);
	}
	function Fc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Lc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ua(t, a === null ? null : a.cachePool), a === null ? To() : wo(t, a), jo(t);
			else return r = t.lanes = 536870912, Lc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ua(t, null), To(), Mo()) : (Ua(t, a.cachePool), wo(t, a), Mo(), t.memoizedState = null);
		return jc(e, t, i, n), t.child;
	}
	function Ic(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Lc(e, t, n, r, i) {
		var a = Ha();
		return a = a === null ? null : {
			parent: Oa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ua(t, null), To(), jo(t), e !== null && ya(e, t, r, !0), t.childLanes = i, null;
	}
	function Rc(e, t) {
		return t = Xc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function zc(e, t, n) {
		return so(t, e.child, null, n), e = Rc(t, t.pendingProps), e.flags |= 2, No(t), t.memoizedState = null, e;
	}
	function Bc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (U) {
				if (r.mode === "hidden") return e = Rc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Ic(null, e);
				if (Ao(t), (e = ta) ? (e = om(e, ra), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ki === null ? null : {
						id: qi,
						overflow: Ji
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ii(e), n.return = t, t.child = n, ea = t, ta = null)) : e = null, e === null) throw aa(t);
				return t.lanes = 536870912, null;
			}
			return Rc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Ao(t), a) {
				if (t.flags & 256) t.flags &= -257, t = zc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Ac || ya(e, t, n, !1), a = (n & e.childLanes) !== 0, Ac || a) {
				if (So.current === null) {
					if (r = Qu, r !== null && (s = ht(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, wi(e, s), Pd(r, e, s), kc;
					Kd();
				}
				t = zc(e, t, n);
			} else e = o.treeContext, ta = um(s.nextSibling), ea = t, U = !0, na = null, ra = !1, e !== null && $i(t, e), t = Rc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = ji(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function q(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Vc(e, t, n, r, i) {
		return xa(t), n = Xo(e, t, n, r, void 0, i), r = es(), e !== null && !Ac ? (ts(e, t, i), al(e, t, i)) : (U && r && Zi(t), t.flags |= 1, jc(e, t, n, i), t.child);
	}
	function Hc(e, t, n, r, i, a) {
		return xa(t), t.updateQueue = null, n = Qo(t, r, n, i), Zo(e), r = es(), e !== null && !Ac ? (ts(e, t, a), al(e, t, a)) : (U && r && Zi(t), t.flags |= 1, jc(e, t, n, a), t.child);
	}
	function Uc(e, t, n, r, i) {
		if (xa(t), t.stateNode === null) {
			var a = Di, o = n.contextType;
			typeof o == "object" && o && (a = Sa(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = gc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, uo(t), o = n.contextType, a.context = typeof o == "object" && o ? Sa(o) : Di, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (hc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && gc.enqueueReplaceState(a, a.state, null), yo(t, r, a, i), vo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = yc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Di, typeof u == "object" && u && (o = Sa(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && vc(t, a, r, o), lo = !1;
			var f = t.memoizedState;
			a.state = f, yo(t, r, a, i), vo(), l = t.memoizedState, s || f !== l || lo ? (typeof d == "function" && (hc(t, n, d, r), l = t.memoizedState), (c = lo || _c(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, fo(e, t), o = t.memoizedProps, u = yc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Di, typeof l == "object" && l && (c = Sa(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && vc(t, a, r, c), lo = !1, f = t.memoizedState, a.state = f, yo(t, r, a, i), vo();
			var p = t.memoizedState;
			o !== d || f !== p || lo || e !== null && e.dependencies !== null && ba(e.dependencies) ? (typeof s == "function" && (hc(t, n, s, r), p = t.memoizedState), (u = lo || _c(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ba(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, q(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = so(t, e.child, null, i), t.child = so(t, null, n, i)) : jc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = al(e, t, i), e;
	}
	function Wc(e, t, n, r) {
		return la(), t.flags |= 256, jc(e, t, n, r), t.child;
	}
	var Gc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Kc(e) {
		return {
			baseLanes: e,
			cachePool: Wa()
		};
	}
	function qc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function Jc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Po.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (U) {
				if (i ? ko(t) : Mo(), (e = ta) ? (e = om(e, ra), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ki === null ? null : {
						id: qi,
						overflow: Ji
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ii(e), n.return = t, t.child = n, ea = t, ta = null)) : e = null, e === null) throw aa(t);
				return t.lanes = cm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Mo(), i = t.mode, a = Xc({
				mode: "hidden",
				children: a
			}, i), r = Pi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Kc(n), r.childLanes = qc(e, o, n), t.memoizedState = Gc, Ic(null, r)) : (ko(t), Yc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Qc(e, t, a, o, r, c, s, n);
		}
		return i ? (Mo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = ji(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Pi(i, a, n, null), i.flags |= 2) : i = ji(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Ic(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Kc(n) : (a = i.cachePool, a === null ? a = Wa() : (s = Oa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = qc(e, o, n), t.memoizedState = Gc, Ic(e.child, r)) : (ko(t), n = e.child, e = n.sibling, n = ji(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Yc(e, t) {
		return t = Xc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Xc(e, t) {
		return e = ki(22, e, null, t), e.lanes = 0, e;
	}
	function Zc(e, t, n) {
		return so(t, e.child, null, n), e = Yc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Qc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (ko(t), t.flags &= -257, Zc(e, t, c)) : t.memoizedState === null ? (Mo(), o = a.fallback, s = t.mode, a = Xc({
			mode: "visible",
			children: a.children
		}, s), o = Pi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, so(t, e.child, null, c), a = t.child, a.memoizedState = Kc(c), a.childLanes = qc(e, r, c), t.memoizedState = Gc, Ic(null, a)) : (Mo(), t.child = e.child, t.flags |= 128, null);
		if (ko(t), cm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, da({
				value: a,
				source: null,
				stack: null
			})), Zc(e, t, c);
		}
		if (Ac || ya(e, t, c, !1), r = (c & e.childLanes) !== 0, Ac || r) {
			if (So.current !== null) return Zc(e, t, c);
			if (r = Qu, r !== null && (a = ht(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, wi(e, a), Pd(r, e, a), kc;
			return sm(o) || Kd(), Zc(e, t, c);
		}
		return sm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, ta = um(o.nextSibling), ea = t, U = !0, na = null, ra = !1, e !== null && $i(t, e), t = Yc(t, a.children), t.flags |= 134221824, t);
	}
	function $c(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), _a(e.return, t, n);
	}
	function el(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Lo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function tl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function nl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function rl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Po.current;
		if (t.flags & 128) return Fo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Fo(t, o), i === "backwards" && e !== null ? (nl(e), jc(e, t, r, n), nl(e)) : jc(e, t, r, n), r = U ? Ui : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && $c(e, n, t);
			else if (e.tag === 19) $c(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = el(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, nl(t)), tl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Lo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				tl(t, !0, n, null, a, r);
				break;
			case "together":
				tl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = el(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), tl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function il(e, t, n) {
		var r = t.pendingProps;
		return ha(t, t.type, r.value), jc(e, t, r.children, n), t.child;
	}
	function al(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ya(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = ji(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = ji(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ol(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ba(e)));
	}
	function sl(e, t, n) {
		switch (t.tag) {
			case 3:
				we(t, t.stateNode.containerInfo), ha(t, Oa, e.memoizedState.cache), la();
				break;
			case 27:
			case 5:
				Ee(t);
				break;
			case 4:
				we(t, t.stateNode.containerInfo);
				break;
			case 10:
				ha(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Ao(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return ko(t), t.flags |= 128, null;
					r = ya(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Jc(e, t, n) : (ko(t), e = al(e, t, n), e === null ? null : e.sibling);
				}
				ko(t);
				break;
			case 19:
				if (t.flags & 128) return rl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ya(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return rl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Fo(t, Po.current), r) break;
				return null;
			case 22: return t.lanes = 0, Fc(e, t, n, t.pendingProps);
			case 24: ha(t, Oa, e.memoizedState.cache);
		}
		return al(e, t, n);
	}
	function cl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Ac = !0;
			else {
				if (!ol(e, n) && !(t.flags & 128)) return Ac = !1, sl(e, t, n);
				Ac = !!(e.flags & 131072);
			}
		} else Ac = !1, U && t.flags & 1048576 && Xi(t, Ui, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Za(t.elementType), t.type = e, typeof e == "function") Ai(e) ? (r = yc(e, r), t.tag = 1, t = Uc(null, t, e, r, n)) : (t.tag = 0, t = Vc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === te) {
								t.tag = 11, t = Mc(null, t, e, r, n);
								break a;
							}
							if (a === ie) {
								t.tag = 14, t = Nc(null, t, e, r, n);
								break a;
							}
							if (a === P) {
								t.tag = 10, t.type = e, t = il(null, t, n);
								break a;
							}
						}
						throw t = pe(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Vc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = yc(r, t.pendingProps), Uc(e, t, r, a, n);
			case 3:
				a: {
					if (we(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, fo(e, t), yo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ha(t, Oa, r), r !== o.cache && va(t, [Oa], n, !0), vo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Wc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = zi(Error(i(424)), t), da(a), t = Wc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (ta = um(e.firstChild), ea = t, U = !0, na = null, ra = !0, n = co(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (la(), r === a) {
							t = al(e, t, n);
							break a;
						}
						jc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return q(e, t), e === null ? (n = Pm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : U || (t.stateNode = pp(t.type, t.pendingProps, Se.current, t)) : t.memoizedState = Pm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ee(t), e === null && U && (r = t.stateNode = gm(t.type, t.pendingProps, Se.current), ea = t, ra = !0, a = ta, Cp(t.type) ? (dm = a, ta = um(r.firstChild)) : ta = a), jc(e, t, t.pendingProps.children, n), q(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && U && ((a = r = ta) && (r = im(r, t.type, t.pendingProps, ra), r === null ? a = !1 : (t.stateNode = r, ea = t, ta = um(r.firstChild), ra = !1, a = !0)), a || aa(t)), Ee(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, mp(a, o) ? r = null : s !== null && mp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Xo(e, t, $o, null, null, n), ch._currentValue = a), q(e, t), jc(e, t, r, n), t.child;
			case 6: return e === null && U && ((e = n = ta) && (n = am(n, t.pendingProps, ra), n === null ? e = !1 : (t.stateNode = n, ea = t, ta = null, e = !0)), e || aa(t)), null;
			case 13: return Jc(e, t, n);
			case 4: return we(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = so(t, null, r, n) : jc(e, t, r, n), t.child;
			case 11: return Mc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, q(e, t), jc(e, t, r, n), t.child;
			case 8: return jc(e, t, t.pendingProps.children, n), t.child;
			case 12: return jc(e, t, t.pendingProps.children, n), t.child;
			case 10: return il(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, xa(t), a = Sa(a), r = r(a), t.flags |= 1, jc(e, t, r, n), t.child;
			case 14: return Nc(e, t, t.type, t.pendingProps, n);
			case 15: return Pc(e, t, t.type, t.pendingProps, n);
			case 19: return rl(e, t, n);
			case 31: return Bc(e, t, n);
			case 22: return Fc(e, t, n, t.pendingProps);
			case 24: return xa(t), r = Sa(Oa), e === null ? (a = Ha(), a === null && (a = Qu, o = ka(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, uo(t), ha(t, Oa, a)) : ((e.lanes & n) !== 0 && (fo(e, t), yo(t, null, null, n), vo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ha(t, Oa, r), r !== a.cache && va(t, [Oa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ha(t, Oa, r))), jc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : U && Zi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : q(e, t), jc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function ll(e) {
		e.flags |= 4;
	}
	function ul(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Ym(t, r) : Ym(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw Qa = Ja, Ka;
			}
		} else e.flags &= -16777217;
	}
	function dl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Xm(t)) {
			if (Ud()) e.flags |= 8192;
			else throw Qa = Ja, Ka;
		}
	}
	function fl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : lt(), e.lanes |= t, ud |= t);
	}
	function pl(e, t) {
		if (!U) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function ml(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function hl(e, t, n) {
		var r = t.pendingProps;
		switch (Qi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return ml(t), null;
			case 1: return ml(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), ga(Oa), Te(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ca(t) ? ll(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, ua())), ml(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (ll(t), o === null ? (ml(t), ul(t, a, null, r, n)) : (ml(t), dl(t, o))) : o ? o === e.memoizedState ? (ml(t), t.flags &= -16777217) : (ll(t), ml(t), dl(t, o)) : (e = e.memoizedProps, e !== r && ll(t), ml(t), ul(t, a, e, r, n)), null;
			case 27:
				if (z(t), n = Se.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return ml(t), t.subtreeFlags &= -33554433, null;
					}
					e = be.current, ca(t) ? oa(t, e) : (e = gm(a, r, n), t.stateNode = e, ll(t));
				}
				return ml(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (z(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return ml(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = be.current, ca(t)) oa(t, o);
					else {
						var s = up(Se.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[xt] = t, o[St] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (rp(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && ll(t);
					}
				}
				return ml(t), t.subtreeFlags &= -33554433, ul(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Se.current, ca(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ea, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[xt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || aa(t, !0);
					} else e = up(e).createTextNode(r), e[xt] = t, t.stateNode = e;
				}
				return ml(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ca(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[xt] = t;
						} else la(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						ml(t), e = !1;
					} else n = ua(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (No(t), t) : (No(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return ml(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ca(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[xt] = t;
						} else la(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						ml(t), a = !1;
					} else a = ua(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (No(t), t) : (No(t), null);
				}
				return No(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), fl(t, t.updateQueue), ml(t), null);
			case 4: return Te(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, ml(t), null;
			case 10: return ga(t.type), ml(t), null;
			case 19:
				if (Io(t), r = t.memoizedState, r === null) return ml(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) pl(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Lo(e), o !== null) {
								for (t.flags |= 128, pl(r, !1), e = o.updateQueue, t.updateQueue = e, fl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Mi(n, e), n = n.sibling;
								return Fo(t, Po.current & 1 | 2), U && Yi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && ze() > gd && (t.flags |= 128, a = !0, pl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Lo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, fl(t, e), pl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !U) return ml(t), null;
						} else 2 * ze() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, pl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = ze(), e.sibling = null, o = Po.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || U ? Fo(t, o) : (n = o, R(Do, t), R(Po, n), Oo === null && (Oo = t)), U && Yi(t, r.treeForkCount), e;
				}
				return ml(t), null;
			case 22:
			case 23: return No(t), Eo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (ml(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ml(t), n = t.updateQueue, n !== null && fl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ye(Va), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), ga(Oa), ml(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, ml(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function gl(e, t) {
		switch (Qi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return ga(Oa), Te(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return z(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (No(t), t.alternate === null) throw Error(i(340));
					la();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (No(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					la();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Io(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Te(), null;
			case 10: return ga(t.type), null;
			case 22:
			case 23: return No(t), Eo(), e !== null && ye(Va), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return ga(Oa), null;
			case 25: return null;
			default: return null;
		}
	}
	function _l(e, t) {
		switch (Qi(t), t.tag) {
			case 3:
				ga(Oa), Te();
				break;
			case 26:
			case 27:
			case 5:
				z(t);
				break;
			case 4:
				Te();
				break;
			case 31:
				t.memoizedState !== null && No(t);
				break;
			case 13:
				No(t);
				break;
			case 19:
				Io(t);
				break;
			case 10:
				ga(t.type);
				break;
			case 22:
			case 23:
				No(t), Eo(), e !== null && ye(Va);
				break;
			case 24: ga(Oa);
		}
	}
	function vl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			mf(t, t.return, e);
		}
	}
	function yl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								mf(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			mf(t, t.return, e);
		}
	}
	function bl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				xo(t, n);
			} catch (t) {
				mf(e, e.return, t);
			}
		}
	}
	function xl(e, t, n) {
		n.props = yc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			mf(e, t, n);
		}
	}
	function Sl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = mi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Fp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Ip(e);
							m(e.child, !1, $p, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			mf(e, t, n);
		}
	}
	function Cl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				mf(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				mf(e, t, n);
			}
			else n.current = null;
		}
	}
	function wl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) tm(e.stateNode, t[n]);
	}
	function Tl(e) {
		for (var t = e.return; t !== null && (Ol(t) && tm(e.stateNode, t.stateNode), !Dl(t));) t = t.return;
	}
	function El(e) {
		for (var t = e.return; t !== null && (Ol(t) && nm(e.stateNode, t.stateNode), !Dl(t));) t = t.return;
	}
	function Dl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Ol(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function kl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			mf(e, e.return, t);
		}
	}
	function Al(e, t, n) {
		try {
			var r = e.stateNode;
			ap(r, e.type, n, t), r[St] = t;
		} catch (t) {
			mf(e, e.return, t);
		}
	}
	function jl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Cp(e.type) || e.tag === 4;
	}
	function Ml(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || jl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Cp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Nl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = _n)), wl(e, r), B = !0;
		else if (i !== 4 && (i === 27 && (wl(e, r), r = null, Cp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Nl(e, t, n, r), e = e.sibling; e !== null;) Nl(e, t, n, r), e = e.sibling;
	}
	function Pl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), wl(e, r), B = !0;
		else if (i !== 4 && (i === 27 && (wl(e, r), r = null, Cp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Pl(e, t, n, r), e = e.sibling; e !== null;) Pl(e, t, n, r), e = e.sibling;
	}
	function Fl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			rp(t, r, n), t[xt] = e, t[St] = n;
		} catch (t) {
			mf(e, e.return, t);
		}
	}
	var Il = !1, Ll = null;
	function Rl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Il = !0);
	}
	var zl = null;
	function Bl() {
		var e = zl;
		return zl = null, e;
	}
	var Vl = 0;
	function Hl(e, t, n, r, i) {
		return Vl = 0, Ul(e.child, t, n, r, i);
	}
	function Ul(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = kp(o);
					r.push(s), s.view && (a = !0);
				} else a || kp(o).view && (a = !0);
				Il = !0, Ep(o, Vl === 0 ? t : t + "_" + Vl, n), Vl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Ul(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Wl(e, t) {
		for (; e !== null;) e.tag === 5 ? Dp(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Wl(e.child, t), e = e.sibling;
	}
	function Gl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Gl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = gi(t.default, t.share), t !== "none" && (Hl(e, n, t, null, !1) || Wl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Kl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = mi(r, n), a = gi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Gl(e) : Hl(e, i, a, null, !1) ? (Gl(e), n.paired || t || Nd(e, r.onEnter)) : Wl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Kl(e, t), e = e.sibling;
		else Gl(e);
	}
	function ql(e) {
		if (Ll !== null && Ll.size !== 0) {
			var t = Ll;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = gi(n.default, n.share);
								if (a !== "none" && (Hl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : Wl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					ql(e);
				}
				e = e.sibling;
			}
		}
	}
	function Jl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = mi(t, e.stateNode), r = Ll === null ? void 0 : Ll.get(n), i = gi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Hl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Ll.delete(n), Nd(e, t.onShare)) : Wl(e.child, !1)), Ll !== null && ql(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Jl(e), e = e.sibling;
		else Ll !== null && ql(e);
	}
	function Yl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = mi(t, e.stateNode);
				t = gi(t.default, t.update), e.flags &= -5, t !== "none" && Hl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Yl(e);
			e = e.sibling;
		}
	}
	function Xl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Wl(e.child, !1));
				}
				Xl(e);
			}
			e = e.sibling;
		}
	}
	function Zl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Wl(e.child, !1), Xl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Wl(e.child, !1) : e.subtreeFlags & 33554432 && Ql(e), e = e.sibling;
	}
	function $l(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Vl < a.length) {
					var l = a[Vl], u = kp(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Ep(c, Vl === 0 ? n : n + "_" + Vl, i), s && e.flags & 4 || (zl === null && (zl = []), zl.push(c, Vl === 0 ? r : r + "_" + Vl, t.memoizedProps)), Vl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : $l(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function eu(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = mi(n, r), a = gi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Ap);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Vl = 0, i = $l(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && eu(e, t);
			e = e.sibling;
		}
	}
	var tu = !1, nu = !1, ru = !1, iu = !1, au = typeof WeakSet == "function" ? WeakSet : Set, ou = null, su = !1, cu = !1, lu = !1, uu = !1;
	function du(e, t, n) {
		if (e = e.containerInfo, cp = _h, e = Wr(e), Gr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (lp = {
			focusedElem: e,
			selectionRange: r
		}, _h = !1, n = (n & 335544064) === n, ou = t, t = n ? 9270 : 1024; ou !== null;) {
			if (e = ou, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Jl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Rl(e), fu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Jl(r), fu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Rl(e), fu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, ou = r) : (n && Yl(e), fu(n));
			}
		}
		Ll = null;
	}
	function fu(e) {
		for (; ou !== null;) {
			var t = ou, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = yc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							mf(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) rm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								rm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = mi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = gi(a.default, a.update), a !== "none" && Hl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, ou = r;
				break;
			}
			ou = t.return;
		}
	}
	function pu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Nu(e, n), r & 4 && vl(5, n);
				break;
			case 1:
				if (Nu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						mf(n, n.return, e);
					}
					else {
						var i = yc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							mf(n, n.return, e);
						}
					}
				}
				r & 64 && bl(n), r & 512 && Sl(n, n.return);
				break;
			case 3:
				if (Nu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						xo(e, t);
					} catch (e) {
						mf(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Fl(n);
			case 26:
			case 5:
				Nu(e, n), t === null && r & 4 && kl(n), r & 512 && Sl(n, n.return);
				break;
			case 12:
				Nu(e, n);
				break;
			case 31:
				Nu(e, n), r & 4 && Su(e, n);
				break;
			case 13:
				Nu(e, n), r & 4 && Cu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = vf.bind(null, n), lm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || tu, !r) {
					var a = t !== null && t.memoizedState !== null || nu;
					t = tu, i = nu, tu = r, (nu = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Fu(e, n, r)) : Nu(e, n), tu = t, nu = i;
				}
				break;
			case 30:
				Nu(e, n), r & 512 && Sl(n, n.return);
				break;
			case 7: r & 512 && Sl(n, n.return);
			default: Nu(e, n);
		}
	}
	function mu(e, t) {
		for (e = e.child; e !== null;) hu(e, t), e = e.sibling;
	}
	function hu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					mf(e, e.return, t);
				}
				gu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, B = !0;
				} catch (t) {
					mf(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? Tp(s, !0) : Tp(e.stateNode, !1);
				} catch (t) {
					mf(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && mu(e, t);
				break;
			default: mu(e, t);
		}
	}
	function gu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						hu(n, r);
						break a;
					case 22:
						n.memoizedState === null && gu(n, r);
						break a;
					default: gu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function _u(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, _u(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && At(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var vu = null, yu = !1;
	function bu(e, t, n) {
		for (n = n.child; n !== null;) xu(e, t, n), n = n.sibling;
	}
	function xu(e, t, n) {
		if (Ye && typeof Ye.onCommitFiberUnmount == "function") try {
			Ye.onCommitFiberUnmount(Je, n);
		} catch {}
		switch (n.tag) {
			case 26:
				nu || Cl(n, t), bu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !nu && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				nu || Cl(n, t), El(n);
				var r = vu, i = yu;
				Cp(n.type) && (vu = n.stateNode, yu = !1), bu(e, t, n), _m(n.stateNode, n.type, n.memoizedProps), vu = r, yu = i;
				break;
			case 5: nu || Cl(n, t), El(n);
			case 6:
				if (n.tag === 6 && El(n), r = vu, i = yu, vu = null, bu(e, t, n), vu = r, yu = i, vu !== null) {
					if (yu) try {
						(vu.nodeType === 9 ? vu.body : vu.nodeName === "HTML" ? vu.ownerDocument.body : vu).removeChild(n.stateNode), B = !0;
					} catch (e) {
						mf(n, t, e);
					}
					else try {
						vu.removeChild(n.stateNode), B = !0;
					} catch (e) {
						mf(n, t, e);
					}
				}
				break;
			case 18:
				vu !== null && (yu ? (e = vu, wp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Uh(e)) : wp(vu, n.stateNode));
				break;
			case 4:
				r = vu, i = yu, vu = n.stateNode.containerInfo, yu = !0, bu(e, t, n), vu = r, yu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				yl(2, n, t), nu || yl(4, n, t), bu(e, t, n);
				break;
			case 1:
				nu || (Cl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && xl(n, t, r)), bu(e, t, n);
				break;
			case 21:
				bu(e, t, n);
				break;
			case 22:
				nu = (r = nu) || n.memoizedState !== null, bu(e, t, n), nu = r;
				break;
			case 30:
				Cl(n, t), bu(e, t, n);
				break;
			case 7:
				nu || Cl(n, t), bu(e, t, n);
				break;
			default: bu(e, t, n);
		}
	}
	function Su(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Uh(e);
			} catch (e) {
				mf(t, t.return, e);
			}
		}
	}
	function Cu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Uh(e);
		} catch (e) {
			mf(t, t.return, e);
		}
	}
	function wu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new au()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new au()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Tu(e, t) {
		var n = wu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = yf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Eu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Cp(l.type)) {
							vu = l.stateNode, yu = !1;
							break a;
						}
						break;
					case 5:
						vu = l.stateNode, yu = !1;
						break a;
					case 3:
					case 4:
						vu = l.stateNode.containerInfo, yu = !0;
						break a;
				}
				l = l.return;
			}
			if (vu === null) throw Error(i(160));
			xu(s, c, o), vu = null, yu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Ou(t, e, n), t = t.sibling;
	}
	var Du = null;
	function Ou(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Eu(t, e, n), ku(e), a & 4 && (yl(3, e, e.return), vl(3, e), yl(5, e, e.return));
				break;
			case 1:
				Eu(t, e, n), ku(e), a & 512 && (nu || r === null || Cl(r, r.return)), a & 64 && tu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Du, Eu(t, e, n), ku(e), a & 512 && (nu || r === null || Cl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (tu) e.stateNode = pp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Ot] || r[xt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), rp(r, t, n), r[xt] = e, Ft(r), t = r;
												break a;
											case "link":
												if (o = Km("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Km("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), rp(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[xt] = e, Ft(r), t = r;
									}
									e.stateNode = t;
								}
							} else tu || qm(o, e.type, e.stateNode);
						} else e.stateNode = Vm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Al(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || nu || t.parentNode.removeChild(t)) : a.count--, n === null ? tu || qm(o, e.type, e.stateNode) : Vm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Eu(t, e, n), ku(e), a & 512 && (nu || r === null || Cl(r, r.return)), r !== null && a & 4 && Al(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = ru, ru = !1, Eu(t, e, n), ru = o, ku(e), a & 512 && (nu || r === null || Cl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						ln(t, ""), B = !0;
					} catch (t) {
						mf(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Al(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (iu = !0);
				break;
			case 6:
				if (Eu(t, e, n), ku(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, B = !0;
					} catch (t) {
						mf(e, e.return, t);
					}
				}
				break;
			case 3:
				if (B = !1, Gm = null, o = Du, Du = xm(t.containerInfo), Eu(t, e, n), Du = o, ku(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Uh(t.containerInfo);
				} catch (t) {
					mf(e, e.return, t);
				}
				iu && (iu = !1, Au(e)), B = !1;
				break;
			case 4:
				a = ru, ru = tu, r = Gt(), o = Du, Du = xm(e.stateNode.containerInfo), Eu(t, e, n), ku(e), Du = o, B && cu && (lu = !0), B = r, ru = a;
				break;
			case 12:
				Eu(t, e, n), ku(e);
				break;
			case 31:
				Eu(t, e, n), ku(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Tu(e, t)));
				break;
			case 13:
				Eu(t, e, n), ku(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = ze()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Tu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = tu, l = nu, u = ru;
				tu = c || o, ru = u || o, nu = l || s, Eu(t, e, n), nu = l, ru = u, tu = c, ku(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || tu || nu || (t = s || nu, n = tu, r = nu, tu = o || tu, nu = t, Pu(e, 2), tu = n, nu = r), !o && ru || mu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Tu(e, n))));
				break;
			case 19:
				Eu(t, e, n), ku(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Tu(e, t)));
				break;
			case 30:
				a & 512 && (nu || r === null || Cl(r, r.return)), a = Gt(), o = cu, s = (n & 335544064) === n, c = e.memoizedProps, cu = s && gi(c.default, c.update) !== "none", Eu(t, e, n), ku(e), s && r !== null && B && (e.flags |= 4), cu = o, B = a;
				break;
			case 21: break;
			case 7: a & 512 && (nu || r === null || Cl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Eu(t, e, n), ku(e);
		}
	}
	function ku(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (jl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Ol(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Dl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Pl(e, Ml(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (ln(l, ""), n.flags &= -33), Pl(e, Ml(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Nl(e, Ml(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				mf(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Au(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Au(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, _h = !0, t.reset(), _h = !1), e = e.sibling;
		}
	}
	function ju(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Mu(t, e), t = t.sibling;
		else eu(t, !1);
	}
	function Mu(e, t) {
		var n = e.alternate;
		if (n === null) Kl(e, !1);
		else switch (e.tag) {
			case 3:
				if (uu = su = !1, Bl(), ju(t, e), !su && !lu) {
					if (e = zl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Dp(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), uu = !0;
				}
				zl = null;
				break;
			case 5:
				ju(t, e);
				break;
			case 4:
				r = su, su = !1, ju(t, e), su && (lu = !0), su = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? ju(t, e) : Kl(e, !1));
				break;
			case 30:
				r = su, i = Bl(), su = !1, ju(t, e), su && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = mi(a, o), o = mi(n.memoizedProps, o);
				var s = gi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Vl = 0, t = $l(e, n, t, o, s, a, !0), Vl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), zl = i) : i !== null && (i.push.apply(i, zl), zl = i), su = e.flags & 32 ? !0 : r;
				break;
			default: ju(t, e);
		}
	}
	function Nu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) pu(e, t.alternate, t), t = t.sibling;
	}
	function Pu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					yl(4, n, n.return), Pu(n, r);
					break;
				case 1:
					Cl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && xl(n, n.return, i), Pu(n, r);
					break;
				case 27: r & 2 && _m(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Cl(n, n.return), n.tag !== 5 && n.tag !== 27 || El(n), Pu(n, r);
					break;
				case 6:
					El(n);
					break;
				case 26:
					Cl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || nu || i.parentNode.removeChild(i), Pu(n, r);
					break;
				case 22:
					n.memoizedState === null && Pu(n, r);
					break;
				case 30:
					Cl(n, n.return), Pu(n, r);
					break;
				case 7: Cl(n, n.return);
				default: Pu(n, r);
			}
			e = e.sibling;
		}
	}
	function Fu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Fu(i, a, n), vl(4, a);
					break;
				case 1:
					if (Fu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						mf(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) bo(l[i], c);
						} catch (e) {
							mf(r, r.return, e);
						}
					}
					s && o & 64 && bl(a), Sl(a, a.return);
					break;
				case 27: n & 2 && Fl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Tl(a), Fu(i, a, n), s && r === null && o & 4 && kl(a), Sl(a, a.return);
					break;
				case 6:
					Tl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || tu || qm(xm(c.ownerDocument), a.type, c), Fu(i, a, n), s && r === null && o & 4 && kl(a), Sl(a, a.return);
					break;
				case 12:
					Fu(i, a, n);
					break;
				case 31:
					Fu(i, a, n), s && o & 4 && Su(i, a);
					break;
				case 13:
					Fu(i, a, n), s && o & 4 && Cu(i, a);
					break;
				case 22:
					a.memoizedState === null && Fu(i, a, n), Sl(a, a.return);
					break;
				case 30:
					Fu(i, a, n), Sl(a, a.return);
					break;
				case 7: Sl(a, a.return);
				default: Fu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Iu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Aa(n));
	}
	function Lu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Aa(e));
	}
	function Ru(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) zu(e, t, n, r), t = t.sibling;
		else i && Ql(t);
	}
	function zu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Zl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Ru(e, t, n, r), a & 2048 && vl(9, t);
				break;
			case 1:
				Ru(e, t, n, r);
				break;
			case 3:
				Ru(e, t, n, r), i && uu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Aa(a)));
				break;
			case 12:
				if (a & 2048) {
					Ru(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						mf(t, t.return, e);
					}
				} else Ru(e, t, n, r);
				break;
			case 31:
				Ru(e, t, n, r);
				break;
			case 13:
				Ru(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Zl(t), o._visibility & 2 ? Ru(e, t, n, r) : (o._visibility |= 2, Bu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Zl(s), o._visibility & 2 ? Ru(e, t, n, r) : Vu(e, t)), a & 2048 && Iu(s, t);
				break;
			case 24:
				Ru(e, t, n, r), a & 2048 && Lu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Wl(a.child, !0), Wl(t.child, !0))), Ru(e, t, n, r);
				break;
			default: Ru(e, t, n, r);
		}
	}
	function Bu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Bu(a, o, s, c, i), vl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Bu(a, o, s, c, i)) : u._visibility & 2 ? Bu(a, o, s, c, i) : Vu(a, o), i && l & 2048 && Iu(o.alternate, o);
					break;
				case 24:
					Bu(a, o, s, c, i), i && l & 2048 && Lu(o.alternate, o);
					break;
				default: Bu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Vu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Vu(n, r), i & 2048 && Iu(r.alternate, r);
					break;
				case 24:
					Vu(n, r), i & 2048 && Lu(r.alternate, r);
					break;
				default: Vu(n, r);
			}
			t = t.sibling;
		}
	}
	var Hu = 8192;
	function Uu(e, t, n) {
		if (e.subtreeFlags & Hu) for (e = e.child; e !== null;) Wu(e, t, n), e = e.sibling;
	}
	function Wu(e, t, n) {
		switch (e.tag) {
			case 26:
				Uu(e, t, n), e.flags & Hu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Qm(n, e)) : $m(n, Du, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Uu(e, t, n), e.flags & Hu && (e = e.stateNode, (t & 335544128) === t && Qm(n, e));
				break;
			case 3:
			case 4:
				var r = Du;
				Du = xm(e.stateNode.containerInfo), Uu(e, t, n), Du = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Hu, Hu = 16777216, Uu(e, t, n), Hu = r) : Uu(e, t, n));
				break;
			case 30:
				if ((e.flags & Hu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Ll === null && (Ll = /* @__PURE__ */ new Map()), Ll.set(r, i);
				}
				Uu(e, t, n);
				break;
			default: Uu(e, t, n);
		}
	}
	function Gu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Ku(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ou = r, Yu(r, e);
			}
			Gu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) qu(e), e = e.sibling;
	}
	function qu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Ku(e), e.flags & 2048 && yl(9, e, e.return);
				break;
			case 3:
				Ku(e);
				break;
			case 12:
				Ku(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ju(e)) : Ku(e);
				break;
			default: Ku(e);
		}
	}
	function Ju(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				ou = r, Yu(r, e);
			}
			Gu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					yl(8, t, t.return), Ju(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ju(t));
					break;
				default: Ju(t);
			}
			e = e.sibling;
		}
	}
	function Yu(e, t) {
		for (; ou !== null;) {
			var n = ou;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					yl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Aa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, ou = r;
			else a: for (n = e; ou !== null;) {
				r = ou;
				var i = r.sibling, a = r.return;
				if (_u(r), r === n) {
					ou = null;
					break a;
				}
				if (i !== null) {
					i.return = a, ou = i;
					break a;
				}
				ou = a;
			}
		}
	}
	var Xu = {
		getCacheForType: function(e) {
			var t = Sa(Oa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Sa(Oa).controller.signal;
		}
	}, Zu = typeof WeakMap == "function" ? WeakMap : Map, J = 0, Qu = null, Y = null, X = 0, $u = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return J & 2 && X !== 0 ? X & -X : I.T === null ? vt() : Ff();
	}
	function Md() {
		if (ld === 0) {
			if (!(X & 536870912) || U) {
				var e = nt;
				nt <<= 1, !(nt & 3932160) && (nt = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = Do.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Fp(mi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === Qu && ($u === 2 || $u === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, X, ld, !1)), dt(e, n), J & 2 && e === Qu || (e === Qu && (!(J & 2) && (sd |= n), ad === 4 && Rd(e, X, ld, !1)), Df(e));
	}
	function Fd(e, t, n) {
		if (J & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || ot(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) a = qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = dd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (rd && !l) {
									c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
									break a;
								}
								o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ld, !td);
							break a;
						case 2:
							fd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = md + 300 - ze(), 10 < a)) {
						if (Rd(r, t, ld, !td), at(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = _p(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Df(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: _n
		}, Ll = null, Wu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = rh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - ze() : (a & 4194048) === a ? hd - ze() : 0, m = th(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Rr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = st(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ze(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && pt(e, n, t);
	}
	function zd() {
		return J & 6 ? !0 : (Of(0, !1), !1);
	}
	function Bd() {
		if (Y !== null) {
			if ($u === 0) var e = Y.return;
			else e = Y, ma = pa = null, ns(e), to = null, no = 0, e = Y;
			for (; e !== null;) _l(e.alternate, e), e = e.return;
			Y = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, vp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), Qu = e, Y = n = ji(e.current, null), X = t, $u = 0, ed = null, td = !1, nd = ot(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = st(e, t), xi(), n;
	}
	function Hd(e, t) {
		G = null, I.H = dc, t === Ga || t === qa ? (t = $a(), $u = 3) : t === Ka ? (t = $a(), $u = 4) : $u = t === kc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, Y === null && (ad = 1, Cc(e, zi(t, e.current)));
	}
	function Ud() {
		var e = Do.current;
		return e === null ? !0 : (X & 4194048) === X ? Oo === null : (X & 62914560) === X || X & 536870912 ? e === Oo : !1;
	}
	function Wd() {
		var e = I.H;
		return I.H = dc, e === null ? dc : e;
	}
	function Gd() {
		var e = I.A;
		return I.A = Xu, e;
	}
	function Kd() {
		ad = 4, td || (X & 4194048) !== X && Do.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || Qu === null || Rd(Qu, X, ld, !1);
	}
	function qd(e, t, n) {
		var r = J;
		J |= 2;
		var i = Wd(), a = Gd();
		(Qu !== e || X !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if ($u !== 0 && Y !== null) {
					var s = Y, c = ed;
					switch ($u) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Do.current === null && (t = !0);
							var l = $u;
							if ($u = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = $u, $u = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ma = pa = null, J = r, I.H = i, I.A = a, Y === null && (Qu = null, X = 0, xi()), o;
	}
	function Jd() {
		for (; Y !== null;) Zd(Y);
	}
	function Yd(e, t) {
		var n = J;
		J |= 2;
		var r = Wd(), a = Gd();
		Qu !== e || X !== t ? (_d = null, gd = ze() + 500, Vd(e, t)) : nd = ot(e, t);
		a: do
			try {
				if ($u !== 0 && Y !== null) {
					t = Y;
					var o = ed;
					b: switch ($u) {
						case 1:
							$u = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ya(o)) {
								$u = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								$u !== 2 && $u !== 9 || Qu !== e || ($u = 7), Df(e);
							}, o.then(t, t);
							break a;
						case 3:
							$u = 7;
							break a;
						case 4:
							$u = 5;
							break a;
						case 7:
							Ya(o) ? ($u = 0, ed = null, Qd(t)) : ($u = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Y.tag) {
								case 26: s = Y.memoizedState;
								case 5:
								case 27:
									var c = Y;
									if (s ? Xm(s) : c.stateNode.complete) {
										$u = 0, ed = null;
										var l = c.sibling;
										if (l !== null) Y = l;
										else {
											var u = c.return;
											u === null ? Y = null : (Y = u, ef(u));
										}
										break b;
									}
							}
							$u = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							$u = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return ma = pa = null, I.H = r, I.A = a, J = n, Y === null ? (Qu = null, X = 0, xi(), ad) : 0;
	}
	function Xd() {
		for (; Y !== null && !Le();) Zd(Y);
	}
	function Zd(e) {
		var t = cl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : Y = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Hc(n, t, t.pendingProps, t.type, void 0, X);
				break;
			case 11:
				t = Hc(n, t, t.pendingProps, t.type.render, t.ref, X);
				break;
			case 5:
				ns(t);
				var r = t;
				r === ea && (U ? (sa(r), r.tag === 5 && r.stateNode != null && (ta = r.stateNode)) : (sa(r), U = !0));
			default: _l(n, t), t = Y = Mi(t, id), t = cl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : Y = t;
	}
	function $d(e, t, n, r) {
		ma = pa = null, ns(t), to = null, no = 0;
		var i = t.return;
		try {
			if (Oc(e, i, t, n, X)) {
				ad = 1, Cc(e, zi(n, e.current)), Y = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Y = i, t;
			ad = 1, Cc(e, zi(n, e.current)), Y = null;
			return;
		}
		t.flags & 32768 ? (U || r === 1 ? e = !0 : nd || X & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Do.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = hl(t.alternate, t, id);
			if (n !== null) {
				Y = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Y = t;
				return;
			}
			Y = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = gl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Y = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Y = e;
				return;
			}
			Y = e = n;
		} while (e !== null);
		ad = 6, Y = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (J & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Qu && (Y = Qu = null, X = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= bi, ft(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Na(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, bf(Ue, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Il = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = I.T, I.T = null, i = L.p, L.p = 2, a = J, J |= 4;
			try {
				du(e, t, n);
			} finally {
				J = a, L.p = i, I.T = r;
			}
		}
		yd = 1, Il ? Ed = Np(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Mu(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = I.T, I.T = null;
				var i = L.p;
				L.p = 2;
				var a = J;
				J |= 4;
				try {
					cu = lu = !1, Ou(t, e, n), n = lp;
					var o = Wr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Ur(s.ownerDocument.documentElement, s)) {
						if (c !== null && Gr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Hr(s, h), v = Hr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					_h = !!cp, lp = cp = null;
				} finally {
					J = a, L.p = i, I.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = I.T, I.T = null;
				var r = L.p;
				L.p = 2;
				var i = J;
				J |= 4;
				try {
					pu(e, t.alternate, t);
				} finally {
					J = i, L.p = r, I.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, Re();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), _t(r), n = n.stateNode, Ye && typeof Ye.onCommitFiberRoot == "function") try {
				Ye.onCommitFiberRoot(Je, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = I.T, a = L.p, L.p = 2, I.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					I.T = n, L.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Df(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Of(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Aa(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = _t(Sd), r = I.T, a = L.p;
		try {
			L.p = 32 > n ? 32 : n, I.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, J & 6) throw Error(i(331));
			var c = J;
			if (J |= 4, qu(o.current), zu(o, o.current, s, n), J = c, Of(0, !1), Ye && typeof Ye.onPostCommitFiberRoot == "function") try {
				Ye.onPostCommitFiberRoot(Je, o);
			} catch {}
			return !0;
		} finally {
			L.p = a, I.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = zi(n, t), t = Tc(e.stateNode, t, 2), e = mo(e, t, 2), e !== null && (dt(e, 2), Df(e));
	}
	function mf(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = zi(n, e), n = Ec(2), r = mo(t, n, 2), r !== null && (Dc(n, r, t, e), dt(r, 2), Df(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Zu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = gf.bind(null, e, t, n), t.then(e, e));
	}
	function gf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Qu === e && (X & n) === n && (ad === 4 || ad === 3 && (X & 62914560) === X && 300 > ze() - md ? J & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === X && (ud = 0)), Df(e);
	}
	function _f(e, t) {
		t === 0 && (t = lt()), e = wi(e, t), e !== null && (dt(e, t), Df(e));
	}
	function vf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), _f(e, n);
	}
	function yf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), _f(e, n);
	}
	function bf(e, t) {
		return Fe(e, t);
	}
	var xf = null, Sf = null, Cf = !1, wf = !1, Tf = !1, Ef = 0;
	function Df(e) {
		e !== Sf && e.next === null && (Sf === null ? xf = Sf = e : Sf = Sf.next = e), wf = !0, Cf || (Cf = !0, Pf());
	}
	function Of(e, t) {
		if (!Tf && wf) {
			Tf = !0;
			do
				for (var n = !1, r = xf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Ze(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Nf(r, a));
						} else a = X, a = at(r, r === Qu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || ot(r, a) || (n = !0, Nf(r, a));
					}
					r = r.next;
				}
			while (n);
			Tf = !1;
		}
	}
	function kf() {
		Af();
	}
	function Af() {
		wf = Cf = !1;
		var e = 0;
		Ef !== 0 && gp() && (e = Ef);
		for (var t = ze(), n = null, r = xf; r !== null;) {
			var i = r.next, a = jf(r, t);
			a === 0 ? (r.next = null, n === null ? xf = i : n.next = i, i === null && (Sf = n)) : (n = r, (e !== 0 || a & 3) && (wf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Of(e, !1), Ef !== 0 && (Ef = 0);
	}
	function jf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ze(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ct(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Qu, n = X, n = at(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && ($u === 2 || $u === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ie(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || ot(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ie(r), _t(n)) {
				case 2:
				case 8:
					n = He;
					break;
				case 32:
					n = Ue;
					break;
				case 268435456:
					n = Ge;
					break;
				default: n = Ue;
			}
			return r = Mf.bind(null, e), n = Fe(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ie(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Mf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = X;
		return r = at(e, e === Qu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), jf(e, ze()), e.callbackNode != null && e.callbackNode === n ? Mf.bind(null, e) : null);
	}
	function Nf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Pf() {
		xp(function() {
			J & 6 ? Fe(Ve, kf) : Af();
		});
	}
	function Ff() {
		if (Ef === 0) {
			var e = Ia;
			e === 0 && (e = tt, tt <<= 1, !(tt & 261888) && (tt = 256)), Ef = e;
		}
		return Ef;
	}
	function If(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : gn(e);
	}
	function Lf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = If((i[St] || null).action), o = r.submitter;
			o && (t = (t = o[St] || null) ? If(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Rn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Ef !== 0) {
								var e = new FormData(i, o);
								Zs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Zs(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Rf = 0; Rf < di.length; Rf++) {
		var zf = di[Rf];
		fi(zf.toLowerCase(), "on" + (zf[0].toUpperCase() + zf.slice(1)));
	}
	fi(ri, "onAnimationEnd"), fi(ii, "onAnimationIteration"), fi(ai, "onAnimationStart"), fi("dblclick", "onDoubleClick"), fi("focusin", "onFocus"), fi("focusout", "onBlur"), fi(oi, "onTransitionRun"), fi(si, "onTransitionStart"), fi(ci, "onTransitionCancel"), fi(li, "onTransitionEnd"), Bt("onMouseEnter", ["mouseout", "mouseover"]), Bt("onMouseLeave", ["mouseout", "mouseover"]), Bt("onPointerEnter", ["pointerout", "pointerover"]), Bt("onPointerLeave", ["pointerout", "pointerover"]), zt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), zt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), zt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), zt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), zt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), zt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Z = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Z));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						_i(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						_i(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[wt];
		n === void 0 && (n = t[wt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Lt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (wh(t)) {
			case 2:
				var i = vh;
				break;
			case 8:
				i = yh;
				break;
			default: i = bh;
		}
		n = i.bind(null, t, n, e), i = void 0, !Dn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = jt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		wn(function() {
			var r = a, i = yn(n), s = [];
			a: {
				var c = ui.get(e);
				if (c !== void 0) {
					var l = Rn, u = e;
					switch (e) {
						case "keypress": if (Nn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = nr;
							break;
						case "focusin":
							u = "focus", l = qn;
							break;
						case "focusout":
							u = "blur", l = qn;
							break;
						case "beforeblur":
						case "afterblur":
							l = qn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Gn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Kn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = ar;
							break;
						case ri:
						case ii:
						case ai:
							l = Jn;
							break;
						case li:
							l = or;
							break;
						case "scroll":
						case "scrollend":
							l = Bn;
							break;
						case "wheel":
							l = sr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Yn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = rr;
							break;
						case "submit":
							l = ir;
							break;
						case "toggle":
						case "beforetoggle": l = cr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = Tn(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== vn && (u = n.relatedTarget || n.fromElement) && (jt(u) || u[Ct])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? jt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Gn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = rr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Nt(c), h = l == null ? u : Nt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, jt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Nt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Dr;
					else if (Sr(c)) {
						if (Or) _ = H;
						else {
							_ = Fr;
							var v = Pr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && pn(r.elementType) && (_ = Dr) : _ = Ir;
					if (_ &&= _(e, r)) {
						Cr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Nt(r) : window, e) {
					case "focusin":
						(Sr(v) || v.contentEditable === "true") && (qr = v, Jr = r, Yr = null);
						break;
					case "focusout":
						Yr = Jr = qr = null;
						break;
					case "mousedown":
						Xr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Xr = !1, Zr(s, n, i);
						break;
					case "selectionchange": if (Kr) break;
					case "keydown":
					case "keyup": Zr(s, n, i);
				}
				var y;
				if (ur) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else vr ? gr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (pr && n.locale !== "ko" && (vr || b !== "onCompositionStart" ? b === "onCompositionEnd" && vr && (y = Mn()) : (kn = i, An = "value" in kn ? kn.value : kn.textContent, vr = !0)), v = Jf(r, b), 0 < v.length && (b = new Xn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = _r(n), y !== null && (b.data = y)))), (y = fr ? yr(e, n) : br(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Xn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Lf(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = Tn(e, n), i != null && r.unshift(qf(e, i, a)), i = Tn(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = Tn(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = Tn(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || ln(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && ln(e, "" + r);
				else return;
				break;
			case "className":
				qt(e, "class", r);
				break;
			case "tabIndex":
				qt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				qt(e, n, r);
				break;
			case "style":
				fn(e, r, o);
				return;
			case "data": if (t !== "object") {
				qt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = gn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && tp(e, t, "name", a.name, a, null), tp(e, t, "formEncType", a.formEncType, a, null), tp(e, t, "formMethod", a.formMethod, a, null), tp(e, t, "formTarget", a.formTarget, a, null)) : (tp(e, t, "encType", a.encType, a, null), tp(e, t, "method", a.method, a, null), tp(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = gn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = _n);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = gn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Kt(e, "popover", r);
				break;
			case "xlinkActuate":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Jt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Jt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Jt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Jt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Kt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = mn.get(n) || n, Kt(e, n, r);
			else return;
		}
		B = !0;
	}
	function np(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				fn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") ln(e, r);
				else if (typeof r == "number" || typeof r == "bigint") ln(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = _n);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Rt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[St] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					B = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Kt(e, n, r);
				}
				return;
		}
		B = !0;
	}
	function rp(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: tp(e, t, o, s, n, null);
					}
				}
				a && tp(e, t, "srcSet", n.srcSet, n, null), r && tp(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: tp(e, t, r, d, n, null);
					}
				}
				rn(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: tp(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && on(e, !!r, n, !0) : on(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: tp(e, t, s, c, n, null);
				}
				cn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: tp(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Z.length; r++) Q(Z[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: tp(e, t, u, r, n, null);
				}
				return;
			default: if (pn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && np(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && tp(e, t, c, r, n, null));
	}
	var ip = {};
	function ap(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || tp(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (B = !0), o = m;
							break;
						case "name":
							m !== f && (B = !0), a = m;
							break;
						case "checked":
							m !== f && (B = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (B = !0), d = m;
							break;
						case "value":
							m !== f && (B = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (B = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && tp(e, t, p, m, r, f);
					}
				}
				nn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || tp(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (B = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (B = !0), c = o;
						break;
					case "multiple": o !== l && (B = !0), s = o;
					default: o !== l && tp(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? on(e, !!n, n ? [] : "", !1) : on(e, !!n, t, !0)) : on(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: tp(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (B = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (B = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && tp(e, t, s, a, r, o);
				}
				sn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: tp(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (B = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: tp(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && tp(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: tp(e, t, u, p, r, m);
				}
				return;
			default: if (pn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && np(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || np(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && tp(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || tp(e, t, f, p, r, m);
	}
	function op(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function sp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && op(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && op(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var cp = null, lp = null;
	function up(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function dp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function fp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function pp(e, t, n, r) {
		return n = up(n).createElement(e), n[xt] = r, n[St] = t, rp(n, e, t), Ft(n), n;
	}
	function mp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var hp = null;
	function gp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== hp && (hp = e, !0) : (hp = null, !1);
	}
	var _p = typeof setTimeout == "function" ? setTimeout : void 0, vp = typeof clearTimeout == "function" ? clearTimeout : void 0, yp = typeof Promise == "function" ? Promise : void 0, bp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : _p, xp = typeof queueMicrotask == "function" ? queueMicrotask : yp === void 0 ? _p : function(e) {
		return yp.resolve(null).then(e).catch(Sp);
	};
	function Sp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Cp(e) {
		return e === "head";
	}
	function wp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Uh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") vm(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, vm(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Ot] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && vm(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Uh(t);
	}
	function Tp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Ep(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Dp(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Op(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function kp(e) {
		return Op(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function Ap(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Op(t, n, e);
	}
	function jp(e) {
		return e.documentElement.clientHeight;
	}
	function Mp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Np(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (jp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Zm(f), u > eh) {
									s.length = o;
									break;
								}
								f = new Promise(Mp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Pp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Pp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Pp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Pp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Fp(e) {
		return {
			name: e,
			group: new Pp("group", e),
			imagePair: new Pp("image-pair", e),
			old: new Pp("old", e),
			new: new Pp("new", e)
		};
	}
	function Ip(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Ip.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Vp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = zp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), m(this._fragmentFiber.child, !1, Lp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Lp(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Ip.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Vp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = zp(i.optionsOrUseCapture), m(this._fragmentFiber.child, !1, Rp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Rp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function zp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Bp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Vp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Bp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Bp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Ip.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, zp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, zp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Ip.prototype.focus = function(e) {
		m(this._fragmentFiber.child, !0, Hp, e, void 0, void 0);
	};
	function Hp(e, t) {
		return e.tag !== 6 && (e = b(e), mm(e, t));
	}
	Ip.prototype.focusLast = function(e) {
		var t = [];
		m(this._fragmentFiber.child, !0, Up, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Hp(t[n], e); n--);
	};
	function Up(e, t) {
		return t.push(e), !1;
	}
	Ip.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = up(e).activeElement, e !== null && m(this._fragmentFiber.child, !1, Wp, e, void 0, void 0));
	};
	function Wp(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Ip.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), m(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Ip.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), m(this._fragmentFiber.child, !1, Kp, e, void 0, void 0);
			for (var n = t = 0; n < qp.length; n++) {
				var r = qp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : qp[t++] = r;
			}
			qp.length = t;
		}
	};
	function Kp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var qp = [], Jp = !1;
	function Yp(e, t, n) {
		qp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Jp || (Jp = !0, hm(function() {
			Jp = !1;
			var e = qp;
			qp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Ip.prototype.getClientRects = function() {
		var e = [];
		return m(this._fragmentFiber.child, !1, Xp, e, void 0, void 0), e;
	};
	function Xp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Ip.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Ip.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		m(this._fragmentFiber.child, !1, Up, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Zp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Zp(e, t, n, r, i) {
		var a = jt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (m(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (m(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Qp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Ip.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		m(this._fragmentFiber.child, !1, Up, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Qp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Qp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function $p(e, t) {
		return e = b(e), em(e, t), !1;
	}
	function em(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, zp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < qp.length; i++) {
				var a = qp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (qp[r++] = a);
			}
			qp.length = r, n.observe(e);
		}), em(e, t));
	}
	function nm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, zp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Yp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function rm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					rm(n), At(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function im(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Ot]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = um(e.nextSibling), e === null) break;
		}
		return null;
	}
	function am(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = um(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = um(e.nextSibling), e === null)) return null;
		return e;
	}
	function sm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function cm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function lm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function um(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var dm = null;
	function fm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return um(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function pm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function mm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function hm(e) {
		bp(function() {
			bp(function(t) {
				return e(t);
			});
		});
	}
	function gm(e, t, n) {
		switch (t = up(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function _m(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && tp(e, t, r, null, ip, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === _n && (e.onclick = null), At(e);
	}
	function vm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		At(e);
	}
	var ym = /* @__PURE__ */ new Map(), bm = /* @__PURE__ */ new Set();
	function xm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Sm = L.d;
	L.d = {
		f: Cm,
		r: wm,
		D: Dm,
		C: Om,
		L: km,
		m: Am,
		X: Mm,
		S: jm,
		M: Nm
	};
	function Cm() {
		var e = Sm.f(), t = zd();
		return e || t;
	}
	function wm(e) {
		var t = Mt(e);
		t !== null && t.tag === 5 && t.type === "form" ? $s(t) : Sm.r(e);
	}
	var Tm = typeof document > "u" ? null : document;
	function Em(e, t, n) {
		var r = Tm;
		if (r && typeof t == "string" && t) {
			var i = tn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), bm.has(i) || (bm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), rp(t, "link", e), Ft(t), r.head.appendChild(t)));
		}
	}
	function Dm(e) {
		Sm.D(e), Em("dns-prefetch", e, null);
	}
	function Om(e, t) {
		Sm.C(e, t), Em("preconnect", e, t);
	}
	function km(e, t, n) {
		Sm.L(e, t, n);
		var r = Tm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + tn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + tn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + tn(n.imageSizes) + "\"]")) : i += "[href=\"" + tn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Fm(e);
					break;
				case "script": a = zm(e);
			}
			if (!(ym.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), ym.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Im(a)) || t === "script" && r.querySelector(Bm(a))))) {
				var o = r.createElement("link");
				rp(o, "link", e), t === "style" && (o[kt] = !0, o.onload = o.onerror = function() {
					It(o);
				}), Ft(o), r.head.appendChild(o);
			}
		}
	}
	function Am(e, t) {
		Sm.m(e, t);
		var n = Tm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + tn(r) + "\"][href=\"" + tn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = zm(e);
			}
			if (!ym.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), ym.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Bm(a))) return;
				}
				r = n.createElement("link"), rp(r, "link", e), Ft(r), n.head.appendChild(r);
			}
		}
	}
	function jm(e, t, n) {
		Sm.S(e, t, n);
		var r = Tm;
		if (r && e) {
			var i = Pt(r).hoistableStyles, a = Fm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Im(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = ym.get(a)) && Um(e, n);
					var c = o = r.createElement("link");
					Ft(c), rp(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Hm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Mm(e, t) {
		Sm.X(e, t);
		var n = Tm;
		if (n && e) {
			var r = Pt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Ft(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t) {
		Sm.M(e, t);
		var n = Tm;
		if (n && e) {
			var r = Pt(n).hoistableScripts, i = zm(e), a = r.get(i);
			a || (a = n.querySelector(Bm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = ym.get(i)) && Wm(e, t), a = n.createElement("script"), Ft(a), rp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Pm(e, t, n, r) {
		var a = (a = Se.current) ? xm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Fm(n.href), t = Pt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Fm(n.href);
					var o = Pt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Im(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = ym.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, ym.set(e, o)), Rm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = zm(n), t = Pt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Fm(e) {
		return "href=\"" + tn(e) + "\"";
	}
	function Im(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Lm(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Rm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[kt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[kt] = !0, t.onload = t.onerror = It.bind(null, t), rp(t, "link", n), Ft(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function zm(e) {
		return "[src=\"" + tn(e) + "\"]";
	}
	function Bm(e) {
		return "script[async]" + e;
	}
	function Vm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + tn(n.href) + "\"]");
				if (r) return t.instance = r, Ft(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ft(r), rp(r, "style", a), Hm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Fm(n.href);
				var o = e.querySelector(Im(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ft(o), o;
				r = Lm(n), (a = ym.get(a)) && Um(r, a), o = (e.ownerDocument || e).createElement("link"), Ft(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), rp(o, "link", r), t.state.loading |= 4, Hm(o, n.precedence, e), t.instance = o;
			case "script": return o = zm(n.src), (a = e.querySelector(Bm(o))) ? (t.instance = a, Ft(a), a) : (r = n, (a = ym.get(o)) && (r = D({}, n), Wm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ft(a), rp(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Hm(r, n.precedence, e));
		return t.instance;
	}
	function Hm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Wm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Gm = null;
	function Km(e, t, n) {
		if (Gm === null) {
			var r = /* @__PURE__ */ new Map(), i = Gm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Gm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Ot] || a[xt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function qm(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Jm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Ym(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Xm(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Zm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Qm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Zm(t), e.suspenseyImages.push(t)), e = ih.bind(e), t.decode().then(e, e));
	}
	function $m(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Fm(r.href), a = t.querySelector(Im(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = rh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ft(a);
					return;
				}
				a = t.ownerDocument || t, r = Lm(r), (i = ym.get(i)) && Um(r, i), a = a.createElement("link"), Ft(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), rp(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = rh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var eh = 0;
	function th(e, t) {
		return e.stylesheets && e.count === 0 && oh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && oh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && eh === 0 && (eh = 62500 * sp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && oh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > eh ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function nh(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) oh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function rh() {
		this.count--, nh(this);
	}
	function ih() {
		this.imgCount--, nh(this);
	}
	var ah = null;
	function oh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ah = /* @__PURE__ */ new Map(), t.forEach(sh, e), ah = null, rh.call(e));
	}
	function sh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ah.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ah.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = rh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var ch = {
		$$typeof: P,
		Provider: null,
		Consumer: null,
		_currentValue: he,
		_currentValue2: he,
		_threadCount: 0
	};
	function lh(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ut(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ut(0), this.hiddenUpdates = ut(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function uh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new lh(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ki(3, null, null, t), e.current = a, a.stateNode = e, t = ka(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, uo(a), e;
	}
	function dh(e) {
		return e ? (e = Di, e) : Di;
	}
	function fh(e, t, n, r, i, a) {
		i = dh(i), r.context === null ? r.context = i : r.pendingContext = i, r = po(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = mo(e, r, t), n !== null && (Pd(n, e, t), ho(n, e, t));
	}
	function ph(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function mh(e, t) {
		ph(e, t), (e = e.alternate) && ph(e, t);
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = wi(e, 67108864);
			t !== null && Pd(t, e, 67108864), mh(e, 67108864);
		}
	}
	function gh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = gt(t);
			var n = wi(e, t);
			n !== null && Pd(n, e, t), mh(e, t);
		}
	}
	var _h = !0;
	function vh(e, t, n, r) {
		var i = I.T;
		I.T = null;
		var a = L.p;
		try {
			L.p = 2, bh(e, t, n, r);
		} finally {
			L.p = a, I.T = i;
		}
	}
	function yh(e, t, n, r) {
		var i = I.T;
		I.T = null;
		var a = L.p;
		try {
			L.p = 8, bh(e, t, n, r);
		} finally {
			L.p = a, I.T = i;
		}
	}
	function bh(e, t, n, r) {
		if (_h) {
			var i = xh(r);
			if (i === null) Kf(e, t, r, Sh, n), Nh(e, r);
			else if (Fh(i, e, t, n, r)) r.stopPropagation();
			else if (Nh(e, r), t & 4 && -1 < Mh.indexOf(e)) {
				for (; i !== null;) {
					var a = Mt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = it(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ze(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Df(a), !(J & 6) && (gd = ze() + 500, Of(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = wi(a, 2), s !== null && Pd(s, a, 2), zd(), mh(a, 2);
					}
					if (a = xh(r), a === null && Kf(e, t, r, Sh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function xh(e) {
		return e = yn(e), Ch(e);
	}
	var Sh = null;
	function Ch(e) {
		if (Sh = null, e = jt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return Sh = e, null;
	}
	function wh(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Be()) {
				case Ve: return 2;
				case He: return 8;
				case Ue:
				case We: return 32;
				case Ge: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Th = !1, Eh = null, Dh = null, Oh = null, kh = /* @__PURE__ */ new Map(), Ah = /* @__PURE__ */ new Map(), jh = [], Mh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Nh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Eh = null;
				break;
			case "dragenter":
			case "dragleave":
				Dh = null;
				break;
			case "mouseover":
			case "mouseout":
				Oh = null;
				break;
			case "pointerover":
			case "pointerout":
				kh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": Ah.delete(t.pointerId);
		}
	}
	function Ph(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Mt(t), t !== null && hh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Fh(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Eh = Ph(Eh, e, t, n, r, i), !0;
			case "dragenter": return Dh = Ph(Dh, e, t, n, r, i), !0;
			case "mouseover": return Oh = Ph(Oh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return kh.set(a, Ph(kh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, Ah.set(a, Ph(Ah.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ih(e) {
		var t = jt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, yt(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, yt(e.priority, function() {
							gh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Lh(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = xh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				vn = r, n.target.dispatchEvent(r), vn = null;
			} else return t = Mt(n), t !== null && hh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Rh(e, t, n) {
		Lh(e) && n.delete(t);
	}
	function zh() {
		Th = !1, Eh !== null && Lh(Eh) && (Eh = null), Dh !== null && Lh(Dh) && (Dh = null), Oh !== null && Lh(Oh) && (Oh = null), kh.forEach(Rh), Ah.forEach(Rh);
	}
	function Bh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Th || (Th = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, zh)));
	}
	var Vh = null;
	function Hh(e) {
		Vh !== e && (Vh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Vh === e && (Vh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Ch(r || n) === null) continue;
					break;
				}
				var a = Mt(n);
				a !== null && (e.splice(t, 3), t -= 3, Zs(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Uh(e) {
		function t(t) {
			return Bh(t, e);
		}
		Eh !== null && Bh(Eh, e), Dh !== null && Bh(Dh, e), Oh !== null && Bh(Oh, e), kh.forEach(t), Ah.forEach(t);
		for (var n = 0; n < jh.length; n++) {
			var r = jh[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < jh.length && (n = jh[0], n.blockedOn === null);) Ih(n), n.blockedOn === null && jh.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[St] || null;
			if (typeof a == "function") o || Hh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[St] || null) s = o.formAction;
					else if (Ch(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Hh(n);
			}
		}
	}
	function Wh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Gh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.render = Gh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		fh(n, jd(), e, t, null, null);
	}, Kh.prototype.unmount = Gh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			fh(e.current, 2, null, e, null, null), zd(), t[Ct] = null;
		}
	};
	function Kh(e) {
		this._internalRoot = e;
	}
	Kh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = vt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < jh.length && t !== 0 && t < jh[n].priority; n++);
			jh.splice(n, 0, e), n === 0 && Ih(e);
		}
	};
	var qh = n.version;
	if (qh !== "19.3.1") throw Error(i(527, qh, "19.3.1"));
	L.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var Jh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: I,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Yh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Yh.isDisabled && Yh.supportsFiber) try {
			Je = Yh.inject(Jh), Ye = Yh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = bc, s = xc, c = Sc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = uh(e, 1, !1, null, null, n, r, null, o, s, c, Wh), e[Ct] = t.current, Wf(e), new Gh(t);
	};
})), _ = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = g();
})), v = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), y = /* @__PURE__ */ o(((e, t) => {
	t.exports = v();
})), b = /* @__PURE__ */ l(p()), x = _(), S = y();
function C(e) {
	return /* @__PURE__ */ (0, S.jsx)("a", { ...e });
}
// analytics/manual/image.tsx
function w({ src: e, alt: t = "", priority: n, unoptimized: r, ...i }) {
	return /* @__PURE__ */ (0, S.jsx)("img", {
		...i,
		alt: t,
		src: e === "/brand.svg" ? "analytics/public/brand.svg" : e,
		loading: n ? "eager" : "lazy"
	});
}
// analytics/manual/navigation.ts
var T = {
	replace: () => {
		throw Error("SERVER_NAVIGATION_DISABLED");
	},
	refresh: () => {
		throw Error("SERVER_NAVIGATION_DISABLED");
	}
}, E = () => T;
// analytics/node_modules/clsx/dist/clsx.mjs
function D(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = D(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function O() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = D(e)) && (r && (r += " "), r += t);
	return r;
}
// analytics/node_modules/recharts/es6/util/excludeEventProps.js
var k = /* @__PURE__ */ "dangerouslySetInnerHTML.onCopy.onCopyCapture.onCut.onCutCapture.onPaste.onPasteCapture.onCompositionEnd.onCompositionEndCapture.onCompositionStart.onCompositionStartCapture.onCompositionUpdate.onCompositionUpdateCapture.onFocus.onFocusCapture.onBlur.onBlurCapture.onChange.onChangeCapture.onBeforeInput.onBeforeInputCapture.onInput.onInputCapture.onReset.onResetCapture.onSubmit.onSubmitCapture.onInvalid.onInvalidCapture.onLoad.onLoadCapture.onError.onErrorCapture.onKeyDown.onKeyDownCapture.onKeyPress.onKeyPressCapture.onKeyUp.onKeyUpCapture.onAbort.onAbortCapture.onCanPlay.onCanPlayCapture.onCanPlayThrough.onCanPlayThroughCapture.onDurationChange.onDurationChangeCapture.onEmptied.onEmptiedCapture.onEncrypted.onEncryptedCapture.onEnded.onEndedCapture.onLoadedData.onLoadedDataCapture.onLoadedMetadata.onLoadedMetadataCapture.onLoadStart.onLoadStartCapture.onPause.onPauseCapture.onPlay.onPlayCapture.onPlaying.onPlayingCapture.onProgress.onProgressCapture.onRateChange.onRateChangeCapture.onSeeked.onSeekedCapture.onSeeking.onSeekingCapture.onStalled.onStalledCapture.onSuspend.onSuspendCapture.onTimeUpdate.onTimeUpdateCapture.onVolumeChange.onVolumeChangeCapture.onWaiting.onWaitingCapture.onAuxClick.onAuxClickCapture.onClick.onClickCapture.onContextMenu.onContextMenuCapture.onDoubleClick.onDoubleClickCapture.onDrag.onDragCapture.onDragEnd.onDragEndCapture.onDragEnter.onDragEnterCapture.onDragExit.onDragExitCapture.onDragLeave.onDragLeaveCapture.onDragOver.onDragOverCapture.onDragStart.onDragStartCapture.onDrop.onDropCapture.onMouseDown.onMouseDownCapture.onMouseEnter.onMouseLeave.onMouseMove.onMouseMoveCapture.onMouseOut.onMouseOutCapture.onMouseOver.onMouseOverCapture.onMouseUp.onMouseUpCapture.onSelect.onSelectCapture.onTouchCancel.onTouchCancelCapture.onTouchEnd.onTouchEndCapture.onTouchMove.onTouchMoveCapture.onTouchStart.onTouchStartCapture.onPointerDown.onPointerDownCapture.onPointerMove.onPointerMoveCapture.onPointerUp.onPointerUpCapture.onPointerCancel.onPointerCancelCapture.onPointerEnter.onPointerEnterCapture.onPointerLeave.onPointerLeaveCapture.onPointerOver.onPointerOverCapture.onPointerOut.onPointerOutCapture.onGotPointerCapture.onGotPointerCaptureCapture.onLostPointerCapture.onLostPointerCaptureCapture.onScroll.onScrollCapture.onWheel.onWheelCapture.onAnimationStart.onAnimationStartCapture.onAnimationEnd.onAnimationEndCapture.onAnimationIteration.onAnimationIterationCapture.onTransitionEnd.onTransitionEndCapture".split(".");
function ee(e) {
	return typeof e == "string" && k.includes(e);
}
// analytics/node_modules/recharts/es6/util/svgPropertiesNoEvents.js
var A = /* @__PURE__ */ new Set(/* @__PURE__ */ "aria-activedescendant.aria-atomic.aria-autocomplete.aria-busy.aria-checked.aria-colcount.aria-colindex.aria-colspan.aria-controls.aria-current.aria-describedby.aria-details.aria-disabled.aria-errormessage.aria-expanded.aria-flowto.aria-haspopup.aria-hidden.aria-invalid.aria-keyshortcuts.aria-label.aria-labelledby.aria-level.aria-live.aria-modal.aria-multiline.aria-multiselectable.aria-orientation.aria-owns.aria-placeholder.aria-posinset.aria-pressed.aria-readonly.aria-relevant.aria-required.aria-roledescription.aria-rowcount.aria-rowindex.aria-rowspan.aria-selected.aria-setsize.aria-sort.aria-valuemax.aria-valuemin.aria-valuenow.aria-valuetext.className.color.height.id.lang.max.media.method.min.name.style.target.width.role.tabIndex.accentHeight.accumulate.additive.alignmentBaseline.allowReorder.alphabetic.amplitude.arabicForm.ascent.attributeName.attributeType.autoReverse.azimuth.baseFrequency.baselineShift.baseProfile.bbox.begin.bias.by.calcMode.capHeight.clip.clipPath.clipPathUnits.clipRule.colorInterpolation.colorInterpolationFilters.colorProfile.colorRendering.contentScriptType.contentStyleType.cursor.cx.cy.d.decelerate.descent.diffuseConstant.direction.display.divisor.dominantBaseline.dur.dx.dy.edgeMode.elevation.enableBackground.end.exponent.externalResourcesRequired.fill.fillOpacity.fillRule.filter.filterRes.filterUnits.floodColor.floodOpacity.focusable.fontFamily.fontSize.fontSizeAdjust.fontStretch.fontStyle.fontVariant.fontWeight.format.from.fx.fy.g1.g2.glyphName.glyphOrientationHorizontal.glyphOrientationVertical.glyphRef.gradientTransform.gradientUnits.hanging.horizAdvX.horizOriginX.href.ideographic.imageRendering.in2.in.intercept.k1.k2.k3.k4.k.kernelMatrix.kernelUnitLength.kerning.keyPoints.keySplines.keyTimes.lengthAdjust.letterSpacing.lightingColor.limitingConeAngle.local.markerEnd.markerHeight.markerMid.markerStart.markerUnits.markerWidth.mask.maskContentUnits.maskUnits.mathematical.mode.numOctaves.offset.opacity.operator.order.orient.orientation.origin.overflow.overlinePosition.overlineThickness.paintOrder.panose1.pathLength.patternContentUnits.patternTransform.patternUnits.pointerEvents.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.r.radius.refX.refY.renderingIntent.repeatCount.repeatDur.requiredExtensions.requiredFeatures.restart.result.rotate.rx.ry.seed.shapeRendering.slope.spacing.specularConstant.specularExponent.speed.spreadMethod.startOffset.stdDeviation.stemh.stemv.stitchTiles.stopColor.stopOpacity.strikethroughPosition.strikethroughThickness.string.stroke.strokeDasharray.strokeDashoffset.strokeLinecap.strokeLinejoin.strokeMiterlimit.strokeOpacity.strokeWidth.surfaceScale.systemLanguage.tableValues.targetX.targetY.textAnchor.textDecoration.textLength.textRendering.to.transform.u1.u2.underlinePosition.underlineThickness.unicode.unicodeBidi.unicodeRange.unitsPerEm.vAlphabetic.values.vectorEffect.version.vertAdvY.vertOriginX.vertOriginY.vHanging.vIdeographic.viewTarget.visibility.vMathematical.widths.wordSpacing.writingMode.x1.x2.x.xChannelSelector.xHeight.xlinkActuate.xlinkArcrole.xlinkHref.xlinkRole.xlinkShow.xlinkTitle.xlinkType.xmlBase.xmlLang.xmlns.xmlnsXlink.xmlSpace.y1.y2.y.yChannelSelector.z.zoomAndPan.ref.key.angle".split("."));
function j(e) {
	return typeof e == "string" && A.has(e);
}
function M(e) {
	return typeof e == "string" && e.startsWith("data-");
}
function N(e) {
	if (typeof e != "object" || !e) return {};
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (j(n) || M(n)) && (t[n] = e[n]);
	return t;
}
function P(e) {
	if (e == null) return null;
	if (/*#__PURE__*/ (0, b.isValidElement)(e) && typeof e.props == "object" && e.props !== null) {
		var t = e.props;
		return N(t);
	}
	return typeof e == "object" && !Array.isArray(e) ? N(e) : null;
}
// analytics/node_modules/recharts/es6/util/svgPropertiesAndEvents.js
function te(e) {
	var t = {};
	for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (j(n) || M(n) || ee(n)) && (t[n] = e[n]);
	return t;
}
function ne(e) {
	return e == null ? null : /*#__PURE__*/ (0, b.isValidElement)(e) ? te(e.props) : typeof e == "object" && !Array.isArray(e) ? te(e) : null;
}
// analytics/node_modules/recharts/es6/container/Surface.js
var re = [
	"children",
	"width",
	"height",
	"viewBox",
	"className",
	"style",
	"title",
	"desc"
];
function ie() {
	return ie = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, ie.apply(null, arguments);
}
function ae(e, t) {
	if (e == null) return {};
	var n, r, i = F(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function F(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var oe = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.children, r = e.width, i = e.height, a = e.viewBox, o = e.className, s = e.style, c = e.title, l = e.desc, u = ae(e, re), d = a || {
		width: r,
		height: i,
		x: 0,
		y: 0
	}, f = O("recharts-surface", o);
	return /*#__PURE__*/ b.createElement("svg", ie({}, te(u), {
		className: f,
		width: r,
		height: i,
		style: s,
		viewBox: `${d.x} ${d.y} ${d.width} ${d.height}`,
		ref: t
	}), /*#__PURE__*/ b.createElement("title", null, c), /*#__PURE__*/ b.createElement("desc", null, l), n);
}), se = ["children", "className"];
function ce() {
	return ce = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, ce.apply(null, arguments);
}
function le(e, t) {
	if (e == null) return {};
	var n, r, i = ue(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function ue(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var de = /*#__PURE__*/ b.forwardRef((e, t) => {
	var n = e.children, r = e.className, i = le(e, se), a = O("recharts-layer", r);
	return /*#__PURE__*/ b.createElement("g", ce({ className: a }, te(i), { ref: t }), n);
});
// analytics/node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function fe(e) {
	return e === "__proto__";
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/hasOwn.mjs
var pe = Object.prototype.hasOwnProperty;
function me(e, t) {
	return pe.call(e, t);
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/isDeepKey.mjs
var I = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function L(e) {
	switch (typeof e) {
		case "number":
		case "symbol": return !1;
		case "string": return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : I.test(e);
		default: return !1;
	}
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/toKey.mjs
function he(e) {
	var t;
	return typeof e == "string" || typeof e == "symbol" ? e : Object.is(e == null || (t = e.valueOf) == null ? void 0 : t.call(e), -0) ? "-0" : String(e);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isSymbol.mjs
function ge(e) {
	return typeof e == "symbol" || e instanceof Symbol;
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/baseToString.mjs
function _e(e) {
	if (typeof e == "string") return e;
	if (Array.isArray(e)) {
		let t = "";
		for (let n = 0; n < e.length; n++) n > 0 && (t += ","), t += _e(e[n]);
		return t;
	}
	if (ge(e)) return e.toString();
	let t = e + "";
	return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
// analytics/node_modules/es-toolkit/dist/compat/util/toString.mjs
function ve(e) {
	return e == null ? "" : _e(e);
}
// analytics/node_modules/es-toolkit/dist/compat/util/toPath.mjs
function ye(e) {
	if (Array.isArray(e)) return e.map(he);
	if (typeof e == "symbol") return [e];
	e = ve(e);
	let t = [], n = e.length;
	if (n === 0) return t;
	let r = 0, i = "", a = "", o = !1, s = !1, c = /^-?\d+(?:\.\d+)?$/;
	for (e.charCodeAt(0) === 46 && t.push(""); r < n;) {
		let l = e[r];
		if (a) l === "\\" && r + 1 < n ? (r++, i += e[r]) : l === a ? a = "" : i += l;
		else if (o) {
			if (l === "\"" || l === "'") a = l, s = !0;
			else if (l === "]") {
				if (o = !1, !s && i.includes(".") && !c.test(i)) {
					let e = i.split(".");
					for (let n = 0; n < e.length; n++) e[n] !== "" && t.push(e[n]);
				} else t.push(i);
				i = "";
			} else i += l;
		} else if (l === "[") o = !0, s = !1, i &&= (t.push(i), "");
		else if (l === ".") {
			i &&= (t.push(i), "");
			let n = e[r + 1];
			(n === void 0 || n === ".") && t.push("");
		} else i += l;
		r++;
	}
	return i && t.push(i), t;
}
// analytics/node_modules/es-toolkit/dist/compat/object/get.mjs
function R(e, t, n) {
	if (e == null) return n;
	switch (typeof t) {
		case "string": {
			if (fe(t)) return n;
			let r = e[t];
			return r === void 0 ? L(t) && !me(e, t) ? R(e, ye(t), n) : n : r;
		}
		case "number":
		case "symbol": {
			typeof t == "number" && (t = he(t));
			let r = e[t];
			return r === void 0 ? n : r;
		}
		default: {
			if (Array.isArray(t)) return be(e, t, n);
			if (t = Object.is(t?.valueOf(), -0) ? "-0" : String(t), fe(t)) return n;
			let r = e[t];
			return r === void 0 ? n : r;
		}
	}
}
function be(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let e = 0; e < t.length; e++) {
		if (r == null || fe(t[e])) return n;
		r = r[t[e]];
	}
	return r === void 0 ? n : r;
}
// analytics/node_modules/recharts/es6/util/round.js
var xe = 4;
function Se(e) {
	var t = 10 ** (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : xe), n = Math.round(e * t) / t;
	return Object.is(n, -0) ? 0 : n;
}
function Ce(e) {
	var t = [...arguments].slice(1);
	return e.reduce((e, n, r) => {
		var i = t[r - 1];
		return typeof i == "string" ? e + i + n : i === void 0 ? e + n : e + Se(i) + n;
	}, "");
}
// analytics/node_modules/recharts/es6/util/DataUtils.js
var we = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, Te = (e) => typeof e == "number" && e != +e, Ee = (e) => typeof e == "string" && e.length > 1 && e.indexOf("%") === e.length - 1, z = (e) => (typeof e == "number" || e instanceof Number) && !Te(e), De = (e) => z(e) || typeof e == "string", Oe = 0, ke = (e) => {
	var t = ++Oe;
	return `${e || ""}${t}`;
}, Ae = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, r = arguments.length > 3 && arguments[3] !== void 0 && arguments[3];
	if (!z(e) && typeof e != "string") return n;
	var i;
	if (Ee(e)) {
		if (t == null) return n;
		var a = e.indexOf("%");
		i = t * parseFloat(e.slice(0, a)) / 100;
	} else i = +e;
	return Te(i) && (i = n), r && t != null && i > t && (i = t), i;
}, je = (e) => {
	if (!Array.isArray(e)) return !1;
	for (var t = e.length, n = {}, r = 0; r < t; r++) if (!n[String(e[r])]) n[String(e[r])] = !0;
	else return !0;
	return !1;
};
function Me(e, t, n) {
	return z(e) && z(t) ? Se(e + n * (t - e)) : t;
}
function Ne(e, t, n) {
	if (e && e.length) return e.find((e) => e && (typeof t == "function" ? t(e) : R(e, t)) === n);
}
var Pe = (e) => e == null, Fe = (e) => Pe(e) ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
function Ie(e) {
	return e != null;
}
function Le() {}
// analytics/node_modules/recharts/es6/cartesian/cartesianViewBoxToTrapezoid.js
function Re(e) {
	if (e) return {
		x: e.x,
		y: e.y,
		upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
		lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
		width: e.width,
		height: e.height
	};
}
// analytics/node_modules/recharts/es6/cartesian/getCartesianPosition.js
function ze(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Be(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ze(Object(n), !0).forEach(function(t) {
			Ve(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ze(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Ve(e, t, n) {
	return (t = He(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function He(e) {
	var t = Ue(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ue(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var We = (e) => {
	var t = e.viewBox, n = e.position, r = e.offset, i = r === void 0 ? 0 : r, a = e.parentViewBox, o = e.clamp, s = Re(t), c = s.x, l = s.y, u = s.height, d = s.upperWidth, f = s.lowerWidth, p = c, m = c + (d - f) / 2, h = (p + m) / 2, g = (d + f) / 2, _ = p + d / 2, v = u >= 0 ? 1 : -1, y = v * i, b = v > 0 ? "end" : "start", x = v > 0 ? "start" : "end", S = d >= 0 ? 1 : -1, C = S * i, w = S > 0 ? "end" : "start", T = S > 0 ? "start" : "end", E = a;
	if (n === "top") {
		var D = {
			x: p + d / 2,
			y: l - y,
			horizontalAnchor: "middle",
			verticalAnchor: b
		};
		return o && E && (D.height = Math.max(l - E.y, 0), D.width = d), D;
	}
	if (n === "bottom") {
		var O = {
			x: m + f / 2,
			y: l + u + y,
			horizontalAnchor: "middle",
			verticalAnchor: x
		};
		return o && E && (O.height = Math.max(E.y + E.height - (l + u), 0), O.width = f), O;
	}
	if (n === "left") {
		var k = {
			x: h - C,
			y: l + u / 2,
			horizontalAnchor: w,
			verticalAnchor: "middle"
		};
		return o && E && (k.width = Math.max(k.x - E.x, 0), k.height = u), k;
	}
	if (n === "right") {
		var ee = {
			x: h + g + C,
			y: l + u / 2,
			horizontalAnchor: T,
			verticalAnchor: "middle"
		};
		return o && E && (ee.width = Math.max(E.x + E.width - ee.x, 0), ee.height = u), ee;
	}
	var A = o && E ? {
		width: g,
		height: u
	} : {};
	return n === "insideLeft" ? Be({
		x: h + C,
		y: l + u / 2,
		horizontalAnchor: T,
		verticalAnchor: "middle"
	}, A) : n === "insideRight" ? Be({
		x: h + g - C,
		y: l + u / 2,
		horizontalAnchor: w,
		verticalAnchor: "middle"
	}, A) : n === "insideTop" ? Be({
		x: p + d / 2,
		y: l + y,
		horizontalAnchor: "middle",
		verticalAnchor: x
	}, A) : n === "insideBottom" ? Be({
		x: m + f / 2,
		y: l + u - y,
		horizontalAnchor: "middle",
		verticalAnchor: b
	}, A) : n === "insideTopLeft" ? Be({
		x: p + C,
		y: l + y,
		horizontalAnchor: T,
		verticalAnchor: x
	}, A) : n === "insideTopRight" ? Be({
		x: p + d - C,
		y: l + y,
		horizontalAnchor: w,
		verticalAnchor: x
	}, A) : n === "insideBottomLeft" ? Be({
		x: m + C,
		y: l + u - y,
		horizontalAnchor: T,
		verticalAnchor: b
	}, A) : n === "insideBottomRight" ? Be({
		x: m + f - C,
		y: l + u - y,
		horizontalAnchor: w,
		verticalAnchor: b
	}, A) : n && typeof n == "object" && (z(n.x) || Ee(n.x)) && (z(n.y) || Ee(n.y)) ? Be({
		x: c + Ae(n.x, g),
		y: l + Ae(n.y, u),
		horizontalAnchor: "end",
		verticalAnchor: "end"
	}, A) : Be({
		x: _,
		y: l + u / 2,
		horizontalAnchor: "middle",
		verticalAnchor: "middle"
	}, A);
}, Ge = [
	"top",
	"left",
	"right",
	"bottom"
];
function Ke(e) {
	return e == null ? !1 : typeof e == "object" || Ge.includes(e);
}
// analytics/node_modules/recharts/es6/context/legendPortalContext.js
var qe = /*#__PURE__*/ (0, b.createContext)(null);
// analytics/node_modules/d3-shape/src/constant.js
function Je(e) {
	return function() {
		return e;
	};
}
// analytics/node_modules/d3-path/src/path.js
var Ye = Math.PI, Xe = 2 * Ye, Ze = 1e-6, Qe = Xe - Ze;
function $e(e) {
	this._ += e[0];
	for (let t = 1, n = e.length; t < n; ++t) this._ += arguments[t] + e[t];
}
function et(e) {
	let t = Math.floor(e);
	if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
	if (t > 15) return $e;
	let n = 10 ** t;
	return function(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += Math.round(arguments[t] * n) / n + e[t];
	};
}
var tt = class {
	constructor(e) {
		this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = e == null ? $e : et(e);
	}
	moveTo(e, t) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}`;
	}
	closePath() {
		this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
	}
	lineTo(e, t) {
		this._append`L${this._x1 = +e},${this._y1 = +t}`;
	}
	quadraticCurveTo(e, t, n, r) {
		this._append`Q${+e},${+t},${this._x1 = +n},${this._y1 = +r}`;
	}
	bezierCurveTo(e, t, n, r, i, a) {
		this._append`C${+e},${+t},${+n},${+r},${this._x1 = +i},${this._y1 = +a}`;
	}
	arcTo(e, t, n, r, i) {
		if (e = +e, t = +t, n = +n, r = +r, i = +i, i < 0) throw Error(`negative radius: ${i}`);
		let a = this._x1, o = this._y1, s = n - e, c = r - t, l = a - e, u = o - t, d = l * l + u * u;
		if (this._x1 === null) this._append`M${this._x1 = e},${this._y1 = t}`;
		else if (d > Ze) {
			if (!(Math.abs(u * s - c * l) > Ze) || !i) this._append`L${this._x1 = e},${this._y1 = t}`;
			else {
				let f = n - a, p = r - o, m = s * s + c * c, h = f * f + p * p, g = Math.sqrt(m), _ = Math.sqrt(d), v = i * Math.tan((Ye - Math.acos((m + d - h) / (2 * g * _))) / 2), y = v / _, b = v / g;
				Math.abs(y - 1) > Ze && this._append`L${e + y * l},${t + y * u}`, this._append`A${i},${i},0,0,${+(u * f > l * p)},${this._x1 = e + b * s},${this._y1 = t + b * c}`;
			}
		}
	}
	arc(e, t, n, r, i, a) {
		if (e = +e, t = +t, n = +n, a = !!a, n < 0) throw Error(`negative radius: ${n}`);
		let o = n * Math.cos(r), s = n * Math.sin(r), c = e + o, l = t + s, u = 1 ^ a, d = a ? r - i : i - r;
		this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > Ze || Math.abs(this._y1 - l) > Ze) && this._append`L${c},${l}`, n && (d < 0 && (d = d % Xe + Xe), d > Qe ? this._append`A${n},${n},0,1,${u},${e - o},${t - s}A${n},${n},0,1,${u},${this._x1 = c},${this._y1 = l}` : d > Ze && this._append`A${n},${n},0,${+(d >= Ye)},${u},${this._x1 = e + n * Math.cos(i)},${this._y1 = t + n * Math.sin(i)}`);
	}
	rect(e, t, n, r) {
		this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +t}h${n = +n}v${+r}h${-n}Z`;
	}
	toString() {
		return this._;
	}
};
tt.prototype;
// analytics/node_modules/d3-shape/src/path.js
function nt(e) {
	let t = 3;
	return e.digits = function(n) {
		if (!arguments.length) return t;
		if (n == null) t = null;
		else {
			let e = Math.floor(n);
			if (!(e >= 0)) throw RangeError(`invalid digits: ${n}`);
			t = e;
		}
		return e;
	}, () => new tt(t);
}
Array.prototype.slice;
function rt(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
// analytics/node_modules/d3-shape/src/curve/linear.js
function it(e) {
	this._context = e;
}
it.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._context.lineTo(e, t);
		}
	}
};
function at(e) {
	return new it(e);
}
// analytics/node_modules/d3-shape/src/point.js
function ot(e) {
	return e[0];
}
function st(e) {
	return e[1];
}
// analytics/node_modules/d3-shape/src/line.js
function ct(e, t) {
	var n = Je(!0), r = null, i = at, a = null, o = nt(s);
	e = typeof e == "function" ? e : e === void 0 ? ot : Je(e), t = typeof t == "function" ? t : t === void 0 ? st : Je(t);
	function s(s) {
		var c, l = (s = rt(s)).length, u, d = !1, f;
		for (r ?? (a = i(f = o())), c = 0; c <= l; ++c) !(c < l && n(u = s[c], c, s)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(u, c, s), +t(u, c, s));
		if (f) return a = null, f + "" || null;
	}
	return s.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Je(+t), s) : e;
	}, s.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Je(+e), s) : t;
	}, s.defined = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : Je(!!e), s) : n;
	}, s.curve = function(e) {
		return arguments.length ? (i = e, r != null && (a = i(r)), s) : i;
	}, s.context = function(e) {
		return arguments.length ? (e == null ? r = a = null : a = i(r = e), s) : r;
	}, s;
}
// analytics/node_modules/d3-shape/src/area.js
function lt(e, t, n) {
	var r = null, i = Je(!0), a = null, o = at, s = null, c = nt(l);
	e = typeof e == "function" ? e : e === void 0 ? ot : Je(+e), t = typeof t == "function" ? t : Je(t === void 0 ? 0 : +t), n = typeof n == "function" ? n : n === void 0 ? st : Je(+n);
	function l(l) {
		var u, d, f, p = (l = rt(l)).length, m, h = !1, g, _ = Array(p), v = Array(p);
		for (a ?? (s = o(g = c())), u = 0; u <= p; ++u) {
			if (!(u < p && i(m = l[u], u, l)) === h) {
				if (h = !h) d = u, s.areaStart(), s.lineStart();
				else {
					for (s.lineEnd(), s.lineStart(), f = u - 1; f >= d; --f) s.point(_[f], v[f]);
					s.lineEnd(), s.areaEnd();
				}
			}
			h && (_[u] = +e(m, u, l), v[u] = +t(m, u, l), s.point(r ? +r(m, u, l) : _[u], n ? +n(m, u, l) : v[u]));
		}
		if (g) return s = null, g + "" || null;
	}
	function u() {
		return ct().defined(i).curve(o).context(a);
	}
	return l.x = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Je(+t), r = null, l) : e;
	}, l.x0 = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Je(+t), l) : e;
	}, l.x1 = function(e) {
		return arguments.length ? (r = e == null ? null : typeof e == "function" ? e : Je(+e), l) : r;
	}, l.y = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Je(+e), n = null, l) : t;
	}, l.y0 = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Je(+e), l) : t;
	}, l.y1 = function(e) {
		return arguments.length ? (n = e == null ? null : typeof e == "function" ? e : Je(+e), l) : n;
	}, l.lineX0 = l.lineY0 = function() {
		return u().x(e).y(t);
	}, l.lineY1 = function() {
		return u().x(e).y(n);
	}, l.lineX1 = function() {
		return u().x(r).y(t);
	}, l.defined = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Je(!!e), l) : i;
	}, l.curve = function(e) {
		return arguments.length ? (o = e, a != null && (s = o(a)), l) : o;
	}, l.context = function(e) {
		return arguments.length ? (e == null ? a = s = null : s = o(a = e), l) : a;
	}, l;
}
// analytics/node_modules/d3-shape/src/curve/bump.js
var ut = class {
	constructor(e, t) {
		this._context = e, this._x = t;
	}
	areaStart() {
		this._line = 0;
	}
	areaEnd() {
		this._line = NaN;
	}
	lineStart() {
		this._point = 0;
	}
	lineEnd() {
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	}
	point(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t);
		}
		this._x0 = e, this._y0 = t;
	}
};
function dt(e) {
	return new ut(e, !0);
}
function ft(e) {
	return new ut(e, !1);
}
// analytics/node_modules/d3-shape/src/noop.js
function pt() {}
// analytics/node_modules/d3-shape/src/curve/basis.js
function mt(e, t, n) {
	e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + n) / 6);
}
function ht(e) {
	this._context = e;
}
ht.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 3: mt(this, this._x1, this._y1);
			case 2: this._context.lineTo(this._x1, this._y1);
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1:
				this._point = 2;
				break;
			case 2: this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
			default: mt(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function gt(e) {
	return new ht(e);
}
// analytics/node_modules/d3-shape/src/curve/basisClosed.js
function _t(e) {
	this._context = e;
}
_t.prototype = {
	areaStart: pt,
	areaEnd: pt,
	lineStart: function() {
		this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 1:
				this._context.moveTo(this._x2, this._y2), this._context.closePath();
				break;
			case 2:
				this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
				break;
			case 3: this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
		}
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._x2 = e, this._y2 = t;
				break;
			case 1:
				this._point = 2, this._x3 = e, this._y3 = t;
				break;
			case 2:
				this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
				break;
			default: mt(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function vt(e) {
	return new _t(e);
}
// analytics/node_modules/d3-shape/src/curve/basisOpen.js
function yt(e) {
	this._context = e;
}
yt.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
	},
	lineEnd: function() {
		(this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1;
				break;
			case 1:
				this._point = 2;
				break;
			case 2:
				this._point = 3;
				var n = (this._x0 + 4 * this._x1 + e) / 6, r = (this._y0 + 4 * this._y1 + t) / 6;
				this._line ? this._context.lineTo(n, r) : this._context.moveTo(n, r);
				break;
			case 3: this._point = 4;
			default: mt(this, e, t);
		}
		this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
	}
};
function bt(e) {
	return new yt(e);
}
// analytics/node_modules/d3-shape/src/curve/linearClosed.js
function xt(e) {
	this._context = e;
}
xt.prototype = {
	areaStart: pt,
	areaEnd: pt,
	lineStart: function() {
		this._point = 0;
	},
	lineEnd: function() {
		this._point && this._context.closePath();
	},
	point: function(e, t) {
		e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
	}
};
function St(e) {
	return new xt(e);
}
// analytics/node_modules/d3-shape/src/curve/monotone.js
function Ct(e) {
	return e < 0 ? -1 : 1;
}
function wt(e, t, n) {
	var r = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (r || i < 0 && -0), o = (n - e._y1) / (i || r < 0 && -0), s = (a * i + o * r) / (r + i);
	return (Ct(a) + Ct(o)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs(s)) || 0;
}
function Tt(e, t) {
	var n = e._x1 - e._x0;
	return n ? (3 * (e._y1 - e._y0) / n - t) / 2 : t;
}
function Et(e, t, n) {
	var r = e._x0, i = e._y0, a = e._x1, o = e._y1, s = (a - r) / 3;
	e._context.bezierCurveTo(r + s, i + s * t, a - s, o - s * n, a, o);
}
function Dt(e) {
	this._context = e;
}
Dt.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
	},
	lineEnd: function() {
		switch (this._point) {
			case 2:
				this._context.lineTo(this._x1, this._y1);
				break;
			case 3: Et(this, this._t0, Tt(this, this._t0));
		}
		(this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
	},
	point: function(e, t) {
		var n = NaN;
		if (e = +e, t = +t, e !== this._x1 || t !== this._y1) {
			switch (this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
					break;
				case 2:
					this._point = 3, Et(this, Tt(this, n = wt(this, e, t)), n);
					break;
				default: Et(this, this._t0, n = wt(this, e, t));
			}
			this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = n;
		}
	}
};
function Ot(e) {
	this._context = new kt(e);
}
(Ot.prototype = Object.create(Dt.prototype)).point = function(e, t) {
	Dt.prototype.point.call(this, t, e);
};
function kt(e) {
	this._context = e;
}
kt.prototype = {
	moveTo: function(e, t) {
		this._context.moveTo(t, e);
	},
	closePath: function() {
		this._context.closePath();
	},
	lineTo: function(e, t) {
		this._context.lineTo(t, e);
	},
	bezierCurveTo: function(e, t, n, r, i, a) {
		this._context.bezierCurveTo(t, e, r, n, a, i);
	}
};
function At(e) {
	return new Dt(e);
}
function jt(e) {
	return new Ot(e);
}
// analytics/node_modules/d3-shape/src/curve/natural.js
function Mt(e) {
	this._context = e;
}
Mt.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = [], this._y = [];
	},
	lineEnd: function() {
		var e = this._x, t = this._y, n = e.length;
		if (n) {
			if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), n === 2) this._context.lineTo(e[1], t[1]);
			else for (var r = Nt(e), i = Nt(t), a = 0, o = 1; o < n; ++a, ++o) this._context.bezierCurveTo(r[0][a], i[0][a], r[1][a], i[1][a], e[o], t[o]);
		}
		(this._line || this._line !== 0 && n === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
	},
	point: function(e, t) {
		this._x.push(+e), this._y.push(+t);
	}
};
function Nt(e) {
	var t, n = e.length - 1, r, i = Array(n), a = Array(n), o = Array(n);
	for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
	for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
	for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
	for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
	return [i, a];
}
function Pt(e) {
	return new Mt(e);
}
// analytics/node_modules/d3-shape/src/curve/step.js
function Ft(e, t) {
	this._context = e, this._t = t;
}
Ft.prototype = {
	areaStart: function() {
		this._line = 0;
	},
	areaEnd: function() {
		this._line = NaN;
	},
	lineStart: function() {
		this._x = this._y = NaN, this._point = 0;
	},
	lineEnd: function() {
		0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
	},
	point: function(e, t) {
		switch (e = +e, t = +t, this._point) {
			case 0:
				this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
				break;
			case 1: this._point = 2;
			default: if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
			else {
				var n = this._x * (1 - this._t) + e * this._t;
				this._context.lineTo(n, this._y), this._context.lineTo(n, t);
			}
		}
		this._x = e, this._y = t;
	}
};
function It(e) {
	return new Ft(e, .5);
}
function Lt(e) {
	return new Ft(e, 0);
}
function Rt(e) {
	return new Ft(e, 1);
}
// analytics/node_modules/d3-shape/src/offset/none.js
function zt(e, t) {
	if ((o = e.length) > 1) for (var n = 1, r, i, a = e[t[0]], o, s = a.length; n < o; ++n) for (i = a, a = e[t[n]], r = 0; r < s; ++r) a[r][1] += a[r][0] = isNaN(i[r][1]) ? i[r][0] : i[r][1];
}
// analytics/node_modules/d3-shape/src/order/none.js
function Bt(e) {
	for (var t = e.length, n = Array(t); --t >= 0;) n[t] = t;
	return n;
}
// analytics/node_modules/d3-shape/src/stack.js
function Vt(e, t) {
	return e[t];
}
function Ht(e) {
	let t = [];
	return t.key = e, t;
}
function Ut() {
	var e = Je([]), t = Bt, n = zt, r = Vt;
	function i(i) {
		var a = Array.from(e.apply(this, arguments), Ht), o, s = a.length, c = -1, l;
		for (let e of i) for (o = 0, ++c; o < s; ++o) (a[o][c] = [0, +r(e, a[o].key, c, i)]).data = e;
		for (o = 0, l = rt(t(a)); o < s; ++o) a[l[o]].index = o;
		return n(a, l), a;
	}
	return i.keys = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Je(Array.from(t)), i) : e;
	}, i.value = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Je(+e), i) : r;
	}, i.order = function(e) {
		return arguments.length ? (t = e == null ? Bt : typeof e == "function" ? e : Je(Array.from(e)), i) : t;
	}, i.offset = function(e) {
		return arguments.length ? (n = e ?? zt, i) : n;
	}, i;
}
// analytics/node_modules/d3-shape/src/offset/expand.js
function Wt(e, t) {
	if ((r = e.length) > 0) {
		for (var n, r, i = 0, a = e[0].length, o; i < a; ++i) {
			for (o = n = 0; n < r; ++n) o += e[n][i][1] || 0;
			if (o) for (n = 0; n < r; ++n) e[n][i][1] /= o;
		}
		zt(e, t);
	}
}
// analytics/node_modules/d3-shape/src/offset/silhouette.js
function B(e, t) {
	if ((i = e.length) > 0) {
		for (var n = 0, r = e[t[0]], i, a = r.length; n < a; ++n) {
			for (var o = 0, s = 0; o < i; ++o) s += e[o][n][1] || 0;
			r[n][1] += r[n][0] = -s / 2;
		}
		zt(e, t);
	}
}
// analytics/node_modules/d3-shape/src/offset/wiggle.js
function Gt(e, t) {
	if ((o = e.length) > 0 && (a = (i = e[t[0]]).length) > 0) {
		for (var n = 0, r = 1, i, a, o; r < a; ++r) {
			for (var s = 0, c = 0, l = 0; s < o; ++s) {
				for (var u = e[t[s]], d = u[r][1] || 0, f = (d - (u[r - 1][1] || 0)) / 2, p = 0; p < s; ++p) {
					var m = e[t[p]], h = m[r][1] || 0, g = m[r - 1][1] || 0;
					f += h - g;
				}
				c += d, l += f * d;
			}
			i[r - 1][1] += i[r - 1][0] = n, c && (n -= l / c);
		}
		i[r - 1][1] += i[r - 1][0] = n, zt(e, t);
	}
}
// analytics/node_modules/recharts/es6/util/types.js
var Kt = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, qt = (e, t) => {
	if (!e || typeof e == "function" || typeof e == "boolean") return null;
	var n = e;
	if (/*#__PURE__*/ (0, b.isValidElement)(e) && (n = e.props), typeof n != "object" && typeof n != "function") return null;
	var r = {};
	return Object.keys(n).forEach((e) => {
		ee(e) && typeof n[e] == "function" && (r[e] = t || ((t) => n[e](n, t)));
	}), r;
}, Jt = (e, t, n) => (r) => (e(t, n, r), null), Yt = (e, t, n) => {
	if (e === null || typeof e != "object" && typeof e != "function") return null;
	var r = null;
	return Object.keys(e).forEach((i) => {
		var a = e[i];
		ee(i) && typeof a == "function" && (r ||= {}, r[i] = Jt(a, t, n));
	}), r;
};
// analytics/node_modules/recharts/es6/util/resolveDefaultProps.js
function Xt(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Zt(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Xt(Object(n), !0).forEach(function(t) {
			Qt(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xt(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Qt(e, t, n) {
	return (t = $t(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function $t(e) {
	var t = en(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function en(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function tn(e, t) {
	var n = Zt({}, e), r = t;
	return Object.keys(t).reduce((e, t) => (e[t] === void 0 && r[t] !== void 0 && (e[t] = r[t]), e), n);
}
// analytics/node_modules/es-toolkit/dist/array/uniqBy.mjs
function nn(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = t(i, r, e);
		n.has(a) || n.set(a, i);
	}
	return Array.from(n.values());
}
// analytics/node_modules/es-toolkit/dist/function/ary.mjs
function rn(e, t) {
	return function(...n) {
		return e.apply(this, n.slice(0, t));
	};
}
// analytics/node_modules/es-toolkit/dist/function/identity.mjs
function an(e) {
	return e;
}
// analytics/node_modules/es-toolkit/dist/predicate/isLength.mjs
function on(e) {
	return Number.isSafeInteger(e) && e >= 0;
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs
function sn(e) {
	return e != null && typeof e != "function" && on(e.length);
}
// analytics/node_modules/es-toolkit/dist/compat/object/property.mjs
function cn(e) {
	return function(t) {
		return R(t, e);
	};
}
// analytics/node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function ln(e) {
	return e == null || typeof e != "object" && typeof e != "function";
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function un(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var dn = "[object RegExp]", fn = "[object String]", pn = "[object Number]", mn = "[object Boolean]", hn = "[object Arguments]", gn = "[object Symbol]", _n = "[object Date]", vn = "[object Map]", yn = "[object Set]", bn = "[object Array]", xn = "[object Function]", Sn = "[object ArrayBuffer]", Cn = "[object Object]", wn = "[object Error]", Tn = "[object DataView]", En = "[object Uint8Array]", Dn = "[object Uint8ClampedArray]", On = "[object Uint16Array]", kn = "[object Uint32Array]", An = "[object BigUint64Array]", jn = "[object Int8Array]", Mn = "[object Int16Array]", Nn = "[object Int32Array]", Pn = "[object BigInt64Array]", Fn = "[object Float32Array]", In = "[object Float64Array]";
// analytics/node_modules/es-toolkit/dist/compat/util/eq.mjs
function Ln(e, t) {
	return e === t || Number.isNaN(e) && Number.isNaN(t);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isObject.mjs
function Rn(e) {
	return e !== null && (typeof e == "object" || typeof e == "function");
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isMatchWith.mjs
function zn(e, t, n) {
	return typeof n == "function" ? Bn(e, t, function e(t, r, i, a, o, s) {
		let c = n(t, r, i, a, o, s);
		return c === void 0 ? Bn(t, r, e, s, !1) : !!c;
	}, /* @__PURE__ */ new Map(), !0) : zn(e, t, () => void 0);
}
function Bn(e, t, n, r, i = !1) {
	if (t === e) return !0;
	switch (typeof t) {
		case "object": return Vn(e, t, n, r, i);
		case "function": return Object.keys(t).length > 0 ? Bn(e, Object.assign({}, t), n, r, i) : Ln(e, t);
		default: return Rn(e) && i ? typeof t != "string" || t === "" : Ln(e, t);
	}
}
function Vn(e, t, n, r, i = !1) {
	if (t == null) return !0;
	if (Array.isArray(t)) return Un(e, t, n, r);
	if (t instanceof Map) return Hn(e, t, n, r);
	if (t instanceof Set) return Wn(e, t, n, r);
	let a = Object.keys(t);
	if (e == null) return i && a.length === 0;
	if (i) ln(e) && (e = Object(e));
	else {
		if (un(t) === "[object Error]") return un(e) === "[object Error]" && e.name === t.name && e.message === t.message;
		let n = un(e);
		if (n !== "[object Object]" && n !== "[object Arguments]") return !1;
	}
	if (a.length === 0) return !0;
	if (r?.has(t)) return r.get(t) === e;
	r?.set(t, e);
	try {
		for (let i = 0; i < a.length; i++) {
			let o = a[i];
			if (!(o in e) || t[o] === void 0 && e[o] !== void 0 || t[o] === null && e[o] !== null || !n(e[o], t[o], o, e, t, r)) return !1;
		}
		return !0;
	} finally {
		r?.delete(t);
	}
}
function Hn(e, t, n, r) {
	if (t.size === 0) return !0;
	if (!(e instanceof Map)) return !1;
	for (let [i, a] of t.entries()) if (n(e.get(i), a, i, e, t, r) === !1) return !1;
	return !0;
}
function Un(e, t, n, r) {
	if (t.length === 0) return !0;
	if (!Array.isArray(e)) return !1;
	let i = /* @__PURE__ */ new Set();
	for (let a = 0; a < t.length; a++) {
		let o = t[a], s = !1;
		for (let c = 0; c < e.length; c++) {
			if (i.has(c)) continue;
			let l = e[c], u = !1;
			if (n(l, o, a, e, t, r) && (u = !0), u) {
				i.add(c), s = !0;
				break;
			}
		}
		if (!s) return !1;
	}
	return !0;
}
function Wn(e, t, n, r) {
	return t.size === 0 || e instanceof Set && Un([...e], [...t], n, r);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isMatch.mjs
function Gn(e, t) {
	return zn(e, t, () => void 0);
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function Kn(e) {
	return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
// analytics/node_modules/es-toolkit/dist/_internal/globalThis.mjs
var qn = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || (function() {
	return this;
})();
// analytics/node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function Jn(e) {
	return qn.Buffer !== void 0 && qn.Buffer.isBuffer(e);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isBuffer.mjs
function Yn(e) {
	return Jn(e);
}
// analytics/node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function Xn(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs
function Zn(e) {
	return Xn(e);
}
// analytics/node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs
function Qn(e, t) {
	return $n(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function $n(e, t, n, r, i) {
	if (i != null) {
		let a = i(e, t, n, r);
		if (a !== void 0) return a;
	}
	if (ln(e)) return e;
	if (r.has(e)) return r.get(e);
	if (Array.isArray(e)) {
		let t = Array(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = $n(e[a], a, n, r, i);
		return me(e, "index") && (t.index = e.index), me(e, "input") && (t.input = e.input), t;
	}
	if (e instanceof Date) return new Date(e.getTime());
	if (e instanceof RegExp) {
		let t = new RegExp(e.source, e.flags);
		return t.lastIndex = e.lastIndex, t;
	}
	if (e instanceof Map) {
		let t = /* @__PURE__ */ new Map();
		return r.set(e, t), e.forEach((e, a) => {
			t.set(a, $n(e, a, n, r, i));
		}), t;
	}
	if (e instanceof Set) {
		let t = /* @__PURE__ */ new Set();
		return r.set(e, t), e.forEach((e) => {
			t.add($n(e, void 0, n, r, i));
		}), t;
	}
	if (Yn(e)) return e.subarray();
	if (Zn(e)) {
		let t = new (Object.getPrototypeOf(e)).constructor(e.length);
		r.set(e, t);
		for (let a = 0; a < e.length; a++) t[a] = $n(e[a], a, n, r, i);
		return t;
	}
	if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
	if (e instanceof DataView) {
		let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
		return r.set(e, t), er(t, e, n, r, i), t;
	}
	if (typeof File < "u" && e instanceof File) {
		let t = new File([e], e.name, { type: e.type });
		return r.set(e, t), er(t, e, n, r, i), t;
	}
	if (typeof Blob < "u" && e instanceof Blob) {
		let t = new Blob([e], { type: e.type });
		return r.set(e, t), er(t, e, n, r, i), t;
	}
	let a = un(e);
	if (a === "[object Error]") return e === n ? {} : e;
	switch (a) {
		case pn:
		case fn:
		case mn: {
			let t = new e.constructor(e.valueOf());
			return r.set(e, t), er(t, e, n, r, i), t;
		}
		case hn: {
			let t = {};
			return r.set(e, t), er(t, e, n, r, i), t.length = e.length, t[Symbol.iterator] = e[Symbol.iterator], t;
		}
	}
	if (typeof e == "object" && tr(a)) {
		let t = a === "[object Object]" && typeof e.constructor != "function" ? {} : Object.create(Object.getPrototypeOf(e));
		return r.set(e, t), er(t, e, n, r, i), t;
	}
	return e;
}
function er(e, t, n, r, i) {
	let a = [...Object.keys(t), ...Kn(t)];
	for (let o = 0; o < a.length; o++) {
		let s = a[o], c = Object.getOwnPropertyDescriptor(e, s);
		(c == null || c.writable) && (e[s] = $n(t[s], s, n, r, i));
	}
}
function tr(e) {
	switch (e) {
		case hn:
		case bn:
		case Sn:
		case Tn:
		case mn:
		case _n:
		case Fn:
		case In:
		case jn:
		case Mn:
		case Nn:
		case vn:
		case pn:
		case Cn:
		case dn:
		case yn:
		case fn:
		case gn:
		case En:
		case Dn:
		case On:
		case kn: return !0;
		default: return !1;
	}
}
// analytics/node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs
function nr(e) {
	return Qn(e);
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/matches.mjs
function rr(e) {
	return e = nr(e), (t) => Gn(t, e);
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/isIndex.mjs
var ir = /^(?:0|[1-9]\d*)$/;
function ar(e, t = 2 ** 53 - 1) {
	switch (typeof e) {
		case "number": return Number.isInteger(e) && e >= 0 && e < t;
		case "symbol": return !1;
		case "string": return ir.test(e);
	}
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs
function or(e) {
	return typeof e == "object" && !!e && un(e) === "[object Arguments]";
}
// analytics/node_modules/es-toolkit/dist/compat/object/has.mjs
function sr(e, t) {
	let n;
	if (n = Array.isArray(t) ? t : typeof t == "string" && L(t) && !(t in Object(e)) ? ye(t) : [t], n.length === 0) return !1;
	let r = e;
	for (let e = 0; e < n.length; e++) {
		let t = he(n[e]);
		if ((r == null || !me(r, t)) && !((Array.isArray(r) || or(r)) && ar(t) && Number(t) < r.length)) return !1;
		r = r[t];
	}
	return !0;
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/matchesProperty.mjs
function cr(e, t) {
	switch (typeof e) {
		case "object":
			Object.is(e?.valueOf(), -0) && (e = "-0");
			break;
		case "number": e = he(e);
	}
	return t = nr(t), function(n) {
		let r = R(n, e);
		return r === void 0 ? sr(n, e) : t === void 0 ? r === void 0 : Gn(r, t);
	};
}
// analytics/node_modules/es-toolkit/dist/compat/util/iteratee.mjs
function lr(e) {
	if (e == null) return an;
	switch (typeof e) {
		case "function": return e;
		case "object": return Array.isArray(e) && e.length === 2 ? cr(e[0], e[1]) : rr(e);
		default: return cn(e);
	}
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/normalizeZero.mjs
function ur(e) {
	return e === 0 ? 0 : e;
}
// analytics/node_modules/es-toolkit/dist/compat/array/uniqBy.mjs
function dr(e, t = an) {
	return sn(e) ? nn(Array.from(e), rn(lr(t), 1)).map(ur) : [];
}
// analytics/node_modules/recharts/es6/util/payload/getUniqPayload.js
function fr(e, t, n) {
	return t === !0 ? dr(e, n) : typeof t == "function" ? dr(e, t) : e;
}
// analytics/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var pr = /* @__PURE__ */ o(((e) => {
	var t = p();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function c(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, u = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, l(c) && u({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return l(c) && u({ inst: c }), e(function() {
				l(c) && u({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function l(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function u(e, t) {
		return t();
	}
	var d = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? u : c;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? d : t.useSyncExternalStore;
})), mr = /* @__PURE__ */ o(((e, t) => {
	t.exports = pr();
})), hr = /* @__PURE__ */ o(((e) => {
	var t = p(), n = mr();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, c = t.useMemo, l = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, u) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = c(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), u !== void 0 && f.hasValue) {
						var t = f.value;
						if (u(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return u !== void 0 && u(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, c = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, c === null ? void 0 : function() {
				return e(c());
			}];
		}, [
			t,
			n,
			r,
			u
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), l(p), p;
	};
})), gr = /* @__PURE__ */ o(((e, t) => {
	t.exports = hr();
})), _r = /*#__PURE__*/ (0, b.createContext)(null), vr = gr(), yr = (e) => e, br = () => {
	var e = (0, b.useContext)(_r);
	return e ? e.store.dispatch : yr;
}, xr = () => {}, Sr = () => xr, Cr = (e, t) => e === t;
function V(e) {
	var t = (0, b.useContext)(_r), n = (0, b.useMemo)(() => t ? (t) => {
		if (t != null) return e(t);
	} : xr, [t, e]);
	return (0, vr.useSyncExternalStoreWithSelector)(t ? t.subscription.addNestedSub : Sr, t ? t.store.getState : xr, t ? t.store.getState : xr, n, Cr);
}
// analytics/node_modules/reselect/dist/reselect.mjs
function wr(e, t = `expected a function, instead received ${typeof e}`) {
	if (typeof e != "function") throw TypeError(t);
}
function Tr(e, t = "expected all items to be functions, instead received the following types: ") {
	if (!e.every((e) => typeof e == "function")) {
		let n = e.map((e) => typeof e == "function" ? `function ${e.name || "unnamed"}()` : typeof e).join(", ");
		throw TypeError(`${t}[${n}]`);
	}
}
var Er = (e) => Array.isArray(e) ? e : [e];
function Dr(e) {
	let t = Array.isArray(e[0]) ? e[0] : e;
	return Tr(t, "createSelector expects all input-selectors to be functions, but received the following types: "), t;
}
function Or(e, t) {
	let n = [], { length: r } = e;
	for (let i = 0; i < r; i++) n.push(e[i].apply(null, t));
	return n;
}
var kr = class {
	constructor(e) {
		this.value = e;
	}
	deref() {
		return this.value;
	}
}, Ar = typeof WeakRef > "u" ? kr : WeakRef, jr = 0, Mr = 1;
function Nr() {
	return {
		s: jr,
		v: void 0,
		o: null,
		p: null
	};
}
function Pr(e) {
	return e instanceof Ar ? e.deref() : e;
}
function Fr(e, t = {}) {
	let n = Nr(), { resultEqualityCheck: r } = t, i, a = 0;
	function o() {
		let t = n, { length: o } = arguments;
		for (let e = 0, n = o; e < n; e++) {
			let n = arguments[e];
			if (typeof n == "function" || typeof n == "object" && n) {
				let e = t.o;
				e === null && (t.o = e = /* @__PURE__ */ new WeakMap());
				let r = e.get(n);
				r === void 0 ? (t = Nr(), e.set(n, t)) : t = r;
			} else {
				let e = t.p;
				e === null && (t.p = e = /* @__PURE__ */ new Map());
				let r = e.get(n);
				r === void 0 ? (t = Nr(), e.set(n, t)) : t = r;
			}
		}
		let s = t, c;
		if (t.s === Mr) c = t.v;
		else if (c = e.apply(null, arguments), a++, r) {
			let e = Pr(i);
			e != null && r(e, c) && (c = e, a !== 0 && a--), i = typeof c == "object" && c || typeof c == "function" ? /* @__PURE__ */ new Ar(c) : c;
		}
		return s.s = Mr, s.v = c, c;
	}
	return o.clearCache = () => {
		n = Nr(), o.resetResultsCount();
	}, o.resultsCount = () => a, o.resetResultsCount = () => {
		a = 0;
	}, o;
}
function Ir(e, ...t) {
	let n = typeof e == "function" ? {
		memoize: e,
		memoizeOptions: t
	} : e, r = (...e) => {
		let t = 0, r = 0, i, a = {}, o = e.pop();
		typeof o == "object" && (a = o, o = e.pop()), wr(o, `createSelector expects an output function after the inputs, but received: [${typeof o}]`);
		let { memoize: s, memoizeOptions: c = [], argsMemoize: l = Fr, argsMemoizeOptions: u = [] } = {
			...n,
			...a
		}, d = Er(c), f = Er(u), p = Dr(e), m = s(function() {
			return t++, o.apply(null, arguments);
		}, ...d), h = l(function() {
			r++;
			let e = Or(p, arguments);
			return i = m.apply(null, e), i;
		}, ...f);
		return Object.assign(h, {
			resultFunc: o,
			memoizedResultFunc: m,
			dependencies: p,
			dependencyRecomputations: () => r,
			resetDependencyRecomputations: () => {
				r = 0;
			},
			lastResult: () => i,
			recomputations: () => t,
			resetRecomputations: () => {
				t = 0;
			},
			memoize: s,
			argsMemoize: l
		});
	};
	return Object.assign(r, { withTypes: () => r }), r;
}
var H = /* @__PURE__ */ Ir(Fr);
// analytics/node_modules/es-toolkit/dist/array/flatten.mjs
function Lr(e, t = 1) {
	let n = [], r = Math.floor(t), i = (e, t) => {
		for (let a = 0; a < e.length; a++) {
			let o = e[a];
			Array.isArray(o) && t < r ? i(o, t + 1) : n.push(o);
		}
	};
	return i(e, 0), n;
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/isIterateeCall.mjs
function Rr(e, t, n) {
	return Rn(n) && (typeof t == "number" && sn(n) && ar(t) && t < n.length || typeof t == "string" && t in n) ? Ln(n[t], e) : !1;
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/objectValues.mjs
function zr(e) {
	let t = Object.keys(e), n = Array(t.length);
	for (let r = 0; r < t.length; r++) n[r] = e[t[r]];
	return n;
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/compareValues.mjs
function Br(e) {
	return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e === e ? 0 : 4;
}
var Vr = (e, t, n) => {
	if (e !== t) {
		let r = Br(e), i = Br(t);
		if (r === i && r === 0) {
			if (e < t) return n === "desc" ? 1 : -1;
			if (e > t) return n === "desc" ? -1 : 1;
		}
		return n === "desc" ? i - r : r - i;
	}
	return 0;
}, Hr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Ur = /^\w*$/;
function Wr(e, t) {
	return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || ge(e) ? !0 : typeof e == "string" && (Ur.test(e) || !Hr.test(e)) || t != null && me(t, e);
}
// analytics/node_modules/es-toolkit/dist/compat/array/orderBy.mjs
function Gr(e, t, n, r) {
	if (e == null) return [];
	n = r ? void 0 : n, Array.isArray(e) || (e = sn(e) ? Array.from(e) : zr(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(n) || (n = n == null ? [] : [n]), n = n.map((e) => String(e));
	let i = (e, t) => {
		let n = e, r = 0;
		for (; r < t.length && n != null; ++r) n = n[t[r]];
		return r > 0 && r === t.length ? n : void 0;
	}, a = (e, t) => {
		if (e == null) return t;
		if (t != null) return typeof e == "object" && "key" in e ? me(t, e.key) ? t[e.key] : i(t, e.path) : typeof e == "function" ? e(t) : Array.isArray(e) ? i(t, e) : t[e];
	}, o = t.map((e) => (Array.isArray(e) && e.length === 1 && (e = e[0]), e == null || typeof e == "function" || Array.isArray(e) || Wr(e) ? e : {
		key: e,
		path: ye(e)
	}));
	return e.map((e) => ({
		original: e,
		criteria: o.map((t) => a(t, e))
	})).slice().sort((e, t) => {
		for (let r = 0; r < o.length; r++) {
			let i = Vr(e.criteria[r], t.criteria[r], n[r]);
			if (i !== 0) return i;
		}
		return 0;
	}).map((e) => e.original);
}
// analytics/node_modules/es-toolkit/dist/compat/array/sortBy.mjs
function Kr(e, ...t) {
	let n = t.length;
	return n > 1 && Rr(e, t[0], t[1]) ? t = [] : n > 2 && Rr(t[0], t[1], t[2]) && (t = [t[0]]), Gr(e, Lr(t), ["asc"]);
}
// analytics/node_modules/recharts/es6/state/selectors/legendSelectors.js
var qr = (e) => e.legend.settings, Jr = (e) => e.legend.size;
H([(e) => e.legend.payload, qr], (e, t) => {
	var n = t.itemSorter, r = e.flat(1);
	return n ? Kr(r, n) : r;
});
// analytics/node_modules/recharts/es6/util/useElementOffset.js
function Yr(e, t) {
	return ei(e) || $r(e, t) || Zr(e, t) || Xr();
}
function Xr() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Zr(e, t) {
	if (e) {
		if (typeof e == "string") return Qr(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Qr(e, t) : void 0;
	}
}
function Qr(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function $r(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function ei(e) {
	if (Array.isArray(e)) return e;
}
var ti = 1;
function ni(e, t) {
	return Math.abs(e.height - t.height) > ti || Math.abs(e.left - t.left) > ti || Math.abs(e.top - t.top) > ti || Math.abs(e.width - t.width) > ti;
}
function ri(e) {
	var t = e.getBoundingClientRect();
	return {
		height: t.height,
		left: t.left,
		top: t.top,
		width: t.width
	};
}
function ii() {
	var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = Yr((0, b.useState)({
		height: 0,
		left: 0,
		top: 0,
		width: 0
	}), 2), n = t[0], r = t[1], i = (0, b.useRef)(null), a = (0, b.useRef)(n);
	a.current = n;
	var o = (0, b.useCallback)((e) => {
		if (i.current != null && (i.current.disconnect(), i.current = null), e != null) {
			var t = ri(e);
			if (ni(t, a.current) && r(t), typeof ResizeObserver < "u") {
				var n = new ResizeObserver(() => {
					var t = ri(e);
					ni(t, a.current) && r(t);
				});
				n.observe(e), i.current = n;
			}
		}
	}, [...e]);
	return (0, b.useEffect)(() => () => {
		var e;
		(e = i.current) == null || e.disconnect();
	}, []), [n, o];
}
// analytics/node_modules/redux/dist/redux.mjs
function ai(e) {
	return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var oi = typeof Symbol == "function" && Symbol.observable || "@@observable", si = () => Math.random().toString(36).substring(7).split("").join("."), ci = {
	INIT: `@@redux/INIT${/* @__PURE__ */ si()}`,
	REPLACE: `@@redux/REPLACE${/* @__PURE__ */ si()}`,
	PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${si()}`
};
function li(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	for (; Object.getPrototypeOf(t) !== null;) t = Object.getPrototypeOf(t);
	return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function ui(e, t, n) {
	if (typeof e != "function") throw Error(ai(2));
	if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function") throw Error(ai(0));
	if (typeof t == "function" && n === void 0 && (n = t, t = void 0), n !== void 0) {
		if (typeof n != "function") throw Error(ai(1));
		return n(ui)(e, t);
	}
	let r = e, i = t, a = /* @__PURE__ */ new Map(), o = a, s = 0, c = !1;
	function l() {
		o === a && (o = /* @__PURE__ */ new Map(), a.forEach((e, t) => {
			o.set(t, e);
		}));
	}
	function u() {
		if (c) throw Error(ai(3));
		return i;
	}
	function d(e) {
		if (typeof e != "function") throw Error(ai(4));
		if (c) throw Error(ai(5));
		let t = !0;
		l();
		let n = s++;
		return o.set(n, e), function() {
			if (t) {
				if (c) throw Error(ai(6));
				t = !1, l(), o.delete(n), a = null;
			}
		};
	}
	function f(e) {
		if (!li(e)) throw Error(ai(7));
		if (e.type === void 0) throw Error(ai(8));
		if (typeof e.type != "string") throw Error(ai(17));
		if (c) throw Error(ai(9));
		try {
			c = !0, i = r(i, e);
		} finally {
			c = !1;
		}
		return (a = o).forEach((e) => {
			e();
		}), e;
	}
	function p(e) {
		if (typeof e != "function") throw Error(ai(10));
		r = e, f({ type: ci.REPLACE });
	}
	function m() {
		let e = d;
		return {
			subscribe(t) {
				if (typeof t != "object" || !t) throw Error(ai(11));
				function n() {
					let e = t;
					e.next && e.next(u());
				}
				return n(), { unsubscribe: e(n) };
			},
			[oi]() {
				return this;
			}
		};
	}
	return f({ type: ci.INIT }), {
		dispatch: f,
		subscribe: d,
		getState: u,
		replaceReducer: p,
		[oi]: m
	};
}
function di(e) {
	Object.keys(e).forEach((t) => {
		let n = e[t];
		if (n(void 0, { type: ci.INIT }) === void 0) throw Error(ai(12));
		if (n(void 0, { type: ci.PROBE_UNKNOWN_ACTION() }) === void 0) throw Error(ai(13));
	});
}
function fi(e) {
	let t = Object.keys(e), n = {};
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		typeof e[i] == "function" && (n[i] = e[i]);
	}
	let r = Object.keys(n), i;
	try {
		di(n);
	} catch (e) {
		i = e;
	}
	return function(e = {}, t) {
		if (i) throw i;
		let a = !1, o = {};
		for (let i = 0; i < r.length; i++) {
			let s = r[i], c = n[s], l = e[s], u = c(l, t);
			if (u === void 0) throw t && t.type, Error(ai(14));
			o[s] = u, a ||= u !== l;
		}
		return a ||= r.length !== Object.keys(e).length, a ? o : e;
	};
}
function pi(...e) {
	return e.length === 0 ? (e) => e : e.length === 1 ? e[0] : e.reduce((e, t) => (...n) => e(t(...n)));
}
function mi(...e) {
	return (t) => (n, r) => {
		let i = t(n, r), a = () => {
			throw Error(ai(15));
		}, o = {
			getState: i.getState,
			dispatch: (e, ...t) => a(e, ...t)
		};
		return a = pi(...e.map((e) => e(o)))(i.dispatch), {
			...i,
			dispatch: a
		};
	};
}
function hi(e) {
	return li(e) && "type" in e && typeof e.type == "string";
}
// analytics/node_modules/immer/dist/immer.mjs
var gi = Symbol.for("immer-nothing"), _i = Symbol.for("immer-draftable"), vi = Symbol.for("immer-state");
function yi(e, ...t) {
	throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`);
}
var bi = Object, xi = bi.getPrototypeOf, Si = "constructor", Ci = "prototype", wi = "configurable", Ti = "enumerable", Ei = "writable", Di = "value", Oi = (e) => !!e && !!e[vi];
function ki(e) {
	return e ? Mi(e) || zi(e) || !!e[_i] || !!e[Si]?.[_i] || Bi(e) || Vi(e) : !1;
}
var Ai = bi[Ci][Si].toString(), ji = /* @__PURE__ */ new WeakMap();
function Mi(e) {
	if (!e || !Hi(e)) return !1;
	let t = xi(e);
	if (t === null || t === bi[Ci]) return !0;
	let n = bi.hasOwnProperty.call(t, Si) && t[Si];
	if (n === Object) return !0;
	if (!Ui(n)) return !1;
	let r = ji.get(n);
	return r === void 0 && (r = Function.toString.call(n), ji.set(n, r)), r === Ai;
}
function Ni(e, t, n = !0) {
	Pi(e) === 0 ? (n ? Reflect.ownKeys(e) : bi.keys(e)).forEach((n) => {
		t(n, e[n], e);
	}) : e.forEach((n, r) => t(r, n, e));
}
function Pi(e) {
	let t = e[vi];
	return t ? t.type_ : zi(e) ? 1 : Bi(e) ? 2 : Vi(e) ? 3 : 0;
}
var Fi = (e, t, n = Pi(e)) => n === 2 ? e.has(t) : bi[Ci].hasOwnProperty.call(e, t), Ii = (e, t, n = Pi(e)) => n === 2 ? e.get(t) : e[t], Li = (e, t, n, r = Pi(e)) => {
	r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : e[t] = n;
};
function Ri(e, t) {
	return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
var zi = Array.isArray, Bi = (e) => e instanceof Map, Vi = (e) => e instanceof Set, Hi = (e) => typeof e == "object", Ui = (e) => typeof e == "function", Wi = (e) => typeof e == "boolean";
function Gi(e) {
	let t = +e;
	return Number.isInteger(t) && String(t) === e;
}
var Ki = (e) => e.copy_ || e.base_, qi = (e) => e.modified_ ? e.copy_ : e.base_;
function Ji(e, t) {
	if (Bi(e)) return new Map(e);
	if (Vi(e)) return new Set(e);
	if (zi(e)) return Array[Ci].slice.call(e);
	let n = Mi(e);
	if (t === !0 || t === "class_only" && !n) {
		let t = bi.getOwnPropertyDescriptors(e);
		delete t[vi];
		let n = Reflect.ownKeys(t);
		for (let r = 0; r < n.length; r++) {
			let i = n[r], a = t[i];
			a[Ei] === !1 && (a[Ei] = !0, a[wi] = !0), (a.get || a.set) && (t[i] = {
				[wi]: !0,
				[Ei]: !0,
				[Ti]: a[Ti],
				[Di]: e[i]
			});
		}
		return bi.create(xi(e), t);
	}
	{
		let t = xi(e);
		if (t !== null && n) return { ...e };
		let r = bi.create(t);
		return bi.assign(r, e);
	}
}
function Yi(e, t = !1) {
	return Qi(e) || Oi(e) || !ki(e) || (Pi(e) > 1 && bi.defineProperties(e, {
		set: Zi,
		add: Zi,
		clear: Zi,
		delete: Zi
	}), bi.freeze(e), t && Ni(e, (e, t) => {
		Yi(t, !0);
	}, !1)), e;
}
function Xi() {
	yi(2);
}
var Zi = { [Di]: Xi };
function Qi(e) {
	return e === null || !Hi(e) || bi.isFrozen(e);
}
var $i = "MapSet", ea = "Patches", ta = "ArrayMethods", U = {};
function na(e) {
	let t = U[e];
	return t || yi(0, e), t;
}
var ra = (e) => !!U[e], ia, aa = () => ia, oa = (e, t) => ({
	drafts_: [],
	parent_: e,
	immer_: t,
	canAutoFreeze_: !0,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: ra($i) ? na($i) : void 0,
	arrayMethodsPlugin_: ra(ta) ? na(ta) : void 0
});
function sa(e, t) {
	t && (e.patchPlugin_ = na(ea), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function ca(e) {
	la(e), e.drafts_.forEach(da), e.drafts_ = null;
}
function la(e) {
	e === ia && (ia = e.parent_);
}
var ua = (e) => ia = oa(ia, e);
function da(e) {
	let t = e[vi];
	t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function fa(e, t) {
	t.unfinalizedDrafts_ = t.drafts_.length;
	let n = t.drafts_[0];
	if (e !== void 0 && e !== n) {
		n[vi].modified_ && (ca(t), yi(4)), ki(e) && (e = pa(t, e));
		let { patchPlugin_: r } = t;
		r && r.generateReplacementPatches_(n[vi].base_, e, t);
	} else e = pa(t, n);
	return ma(t, e, !0), ca(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e === gi ? void 0 : e;
}
function pa(e, t) {
	if (Qi(t)) return t;
	let n = t[vi];
	if (!n) return Sa(t, e.handledSet_, e);
	if (!ga(n, e)) return t;
	if (!n.modified_) return n.base_;
	if (!n.finalized_) {
		let { callbacks_: t } = n;
		if (t) for (; t.length > 0;) t.pop()(e);
		ba(n, e);
	}
	return n.copy_;
}
function ma(e, t, n = !1) {
	!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && Yi(t, n);
}
function ha(e) {
	e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var ga = (e, t) => e.scope_ === t, _a = [];
function va(e, t, n, r) {
	let i = Ki(e), a = e.type_;
	if (r !== void 0 && Ii(i, r, a) === t) {
		Li(i, r, n, a);
		return;
	}
	if (!e.draftLocations_) {
		let t = e.draftLocations_ = /* @__PURE__ */ new Map();
		Ni(i, (e, n) => {
			if (Oi(n)) {
				let r = t.get(n) || [];
				r.push(e), t.set(n, r);
			}
		});
	}
	let o = e.draftLocations_.get(t) ?? _a;
	for (let e of o) Li(i, e, n, a);
}
function ya(e, t, n) {
	e.callbacks_.push(function(r) {
		let i = t;
		if (!i || !ga(i, r)) return;
		r.mapSetPlugin_?.fixSetContents(i);
		let a = qi(i);
		va(e, i.draft_ ?? i, a, n), ba(i, r);
	});
}
function ba(e, t) {
	if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
		let { patchPlugin_: n } = t;
		if (n) {
			let r = n.getPath(e);
			r && n.generatePatches_(e, r, t);
		}
		ha(e);
	}
}
function xa(e, t, n) {
	let { scope_: r } = e;
	if (Oi(n)) {
		let i = n[vi];
		ga(i, r) && i.callbacks_.push(function() {
			ja(e), va(e, n, qi(i), t);
		});
	} else ki(n) && e.callbacks_.push(function() {
		let i = Ki(e);
		e.type_ === 3 ? i.has(n) && Sa(n, r.handledSet_, r) : Ii(i, t, e.type_) === n && r.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && Sa(Ii(e.copy_, t, e.type_), r.handledSet_, r);
	});
}
function Sa(e, t, n) {
	return !n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1 || Oi(e) || t.has(e) || !ki(e) || Qi(e) || (t.add(e), Ni(e, (r, i) => {
		if (Oi(i)) {
			let t = i[vi];
			ga(t, n) && (Li(e, r, qi(t), e.type_), ha(t));
		} else ki(i) && Sa(i, t, n);
	})), e;
}
function Ca(e, t) {
	let n = zi(e), r = {
		type_: +!!n,
		scope_: t ? t.scope_ : aa(),
		modified_: !1,
		finalized_: !1,
		assigned_: void 0,
		parent_: t,
		base_: e,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: !1,
		callbacks_: void 0
	}, i = r, a = wa;
	n && (i = [r], a = Ta);
	let { revoke: o, proxy: s } = Proxy.revocable(i, a);
	return r.draft_ = s, r.revoke_ = o, [s, r];
}
var wa = {
	get(e, t) {
		if (t === vi) return e;
		let n = e.scope_.arrayMethodsPlugin_, r = e.type_ === 1 && typeof t == "string";
		if (r && n?.isArrayOperationMethod(t)) return n.createMethodInterceptor(e, t);
		let i = Ki(e);
		if (!Fi(i, t, e.type_)) return Oa(e, i, t);
		let a = i[t];
		if (e.finalized_ || !ki(a) || r && e.operationMethod && n?.isMutatingArrayMethod(e.operationMethod) && Gi(t)) return a;
		if (a === Ea(e.base_, t) || Da(e, t, a)) {
			ja(e);
			let n = e.type_ === 1 ? +t : t, r = Na(e.scope_, a, e, n);
			return e.copy_[n] = r;
		}
		return a;
	},
	has(e, t) {
		return t in Ki(e);
	},
	ownKeys(e) {
		return Reflect.ownKeys(Ki(e));
	},
	set(e, t, n) {
		let r = ka(Ki(e), t);
		if (r?.set) return r.set.call(e.draft_, n), !0;
		if (!e.modified_) {
			let r = Ea(Ki(e), t), i = r?.[vi];
			if (i && i.base_ === n) return e.copy_[t] = n, e.assigned_.delete(t), !0;
			if (Ri(n, r) && (n !== void 0 || Fi(e.base_, t, e.type_))) return !0;
			ja(e), Aa(e);
		}
		return e.copy_[t] === n && (n !== void 0 || Fi(e.copy_, t, e.type_)) || Number.isNaN(n) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = n, e.assigned_.set(t, !0), xa(e, t, n)), !0;
	},
	deleteProperty(e, t) {
		return ja(e), Ea(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Aa(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = Ki(e), r = Reflect.getOwnPropertyDescriptor(n, t);
		return r && {
			[Ei]: !0,
			[wi]: e.type_ !== 1 || t !== "length",
			[Ti]: r[Ti],
			[Di]: n[t]
		};
	},
	defineProperty() {
		yi(11);
	},
	getPrototypeOf(e) {
		return xi(e.base_);
	},
	setPrototypeOf() {
		yi(12);
	}
}, Ta = {};
for (let e in wa) {
	let t = wa[e];
	Ta[e] = function() {
		let e = arguments;
		return e[0] = e[0][0], t.apply(this, e);
	};
}
Ta.deleteProperty = function(e, t) {
	return Ta.set.call(this, e, t, void 0);
}, Ta.set = function(e, t, n) {
	return wa.set.call(this, e[0], t, n, e[0]);
};
function Ea(e, t) {
	let n = e[vi];
	return (n ? Ki(n) : e)[t];
}
function Da(e, t, n) {
	return e.type_ !== 1 || !e.allIndicesReassigned_ || !ki(n) || n[vi] ? !1 : e.baseRefs_.has(n);
}
function Oa(e, t, n) {
	let r = ka(t, n);
	return r ? Di in r ? r[Di] : r.get?.call(e.draft_) : void 0;
}
function ka(e, t) {
	if (!(t in e)) return;
	let n = xi(e);
	for (; n;) {
		let e = Object.getOwnPropertyDescriptor(n, t);
		if (e) return e;
		n = xi(n);
	}
}
function Aa(e) {
	e.modified_ || (e.modified_ = !0, e.parent_ && Aa(e.parent_));
}
function ja(e) {
	e.copy_ ||= (e.assigned_ = /* @__PURE__ */ new Map(), Ji(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var Ma = class {
	constructor(e) {
		this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, n) => {
			if (Ui(e) && !Ui(t)) {
				let n = t;
				t = e;
				let r = this;
				return function(e = n, ...i) {
					return r.produce(e, (e) => t.call(this, e, ...i));
				};
			}
			Ui(t) || yi(6), n !== void 0 && !Ui(n) && yi(7);
			let r;
			if (ki(e)) {
				let i = ua(this), a = Na(i, e, void 0), o = !0;
				try {
					r = t(a), o = !1;
				} finally {
					o ? ca(i) : la(i);
				}
				return sa(i, n), fa(r, i);
			}
			if (!e || !Hi(e)) {
				if (r = t(e), r === void 0 && (r = e), r === gi && (r = void 0), this.autoFreeze_ && Yi(r, !0), n) {
					let t = [], i = [];
					na(ea).generateReplacementPatches_(e, r, {
						patches_: t,
						inversePatches_: i
					}), n(t, i);
				}
				return r;
			}
			yi(1, e);
		}, this.produceWithPatches = (e, t) => {
			if (Ui(e)) return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
			let n, r;
			return [
				this.produce(e, t, (e, t) => {
					n = e, r = t;
				}),
				n,
				r
			];
		}, Wi(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze), Wi(e?.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), Wi(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
	}
	createDraft(e) {
		ki(e) || yi(8), Oi(e) && (e = Pa(e));
		let t = ua(this), n = Na(t, e, void 0);
		return n[vi].isManual_ = !0, la(t), n;
	}
	finishDraft(e, t) {
		let n = e && e[vi];
		n && n.isManual_ || yi(9);
		let { scope_: r } = n;
		return sa(r, t), fa(void 0, r);
	}
	setAutoFreeze(e) {
		this.autoFreeze_ = e;
	}
	setUseStrictShallowCopy(e) {
		this.useStrictShallowCopy_ = e;
	}
	setUseStrictIteration(e) {
		this.useStrictIteration_ = e;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(e, t) {
		let n;
		for (n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.path.length === 0 && r.op === "replace") {
				e = r.value;
				break;
			}
		}
		n > -1 && (t = t.slice(n + 1));
		let r = na(ea).applyPatches_;
		return Oi(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
	}
};
function Na(e, t, n, r) {
	let [i, a] = Bi(t) ? na($i).proxyMap_(t, n) : Vi(t) ? na($i).proxySet_(t, n) : Ca(t, n);
	return (n?.scope_ ?? aa()).drafts_.push(i), a.callbacks_ = n?.callbacks_ ?? [], a.key_ = r, n && r !== void 0 ? ya(n, a, r) : a.callbacks_.push(function(e) {
		e.mapSetPlugin_?.fixSetContents(a);
		let { patchPlugin_: t } = e;
		a.modified_ && t && t.generatePatches_(a, [], e);
	}), i;
}
function Pa(e) {
	return Oi(e) || yi(10, e), Fa(e);
}
function Fa(e) {
	if (!ki(e) || Qi(e)) return e;
	let t = e[vi], n, r = !0;
	if (t) {
		if (!t.modified_) return t.base_;
		t.finalized_ = !0, n = Ji(e, t.scope_.immer_.useStrictShallowCopy_), r = t.scope_.immer_.shouldUseStrictIteration();
	} else n = Ji(e, !0);
	let i = n;
	return Vi(n) && (n = /* @__PURE__ */ new Set()), Ni(i, (e, t) => {
		Li(n, e, Fa(t));
	}, r), t && (t.finalized_ = !1), n;
}
globalThis.Iterator?.from;
var Ia = new Ma().produce, W = (e) => e;
// analytics/node_modules/redux-thunk/dist/redux-thunk.mjs
function La(e) {
	return ({ dispatch: t, getState: n }) => (r) => (i) => typeof i == "function" ? i(t, n, e) : r(i);
}
var Ra = La(), za = La, Ba = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
	if (arguments.length !== 0) return typeof arguments[0] == "object" ? pi : pi.apply(null, arguments);
};
typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__;
function Va(e, t) {
	function n(...n) {
		if (t) {
			let r = t(...n);
			if (!r) throw Error(Xo(0));
			return {
				type: e,
				payload: r.payload,
				..."meta" in r && { meta: r.meta },
				..."error" in r && { error: r.error }
			};
		}
		return {
			type: e,
			payload: n[0]
		};
	}
	return n.toString = () => `${e}`, n.type = e, n.match = (t) => hi(t) && t.type === e, n;
}
var Ha = class e extends Array {
	constructor(...t) {
		super(...t), Object.setPrototypeOf(this, e.prototype);
	}
	static get [Symbol.species]() {
		return e;
	}
	concat(...e) {
		return super.concat.apply(this, e);
	}
	prepend(...t) {
		return t.length === 1 && Array.isArray(t[0]) ? new e(...t[0].concat(this)) : new e(...t.concat(this));
	}
};
function Ua(e) {
	return ki(e) ? Ia(e, () => {}) : e;
}
function Wa(e, t, n) {
	return e.has(t) ? e.get(t) : e.set(t, n(t)).get(t);
}
function Ga(e) {
	return typeof e == "boolean";
}
var Ka = () => function(e) {
	let { thunk: t = !0, immutableCheck: n = !0, serializableCheck: r = !0, actionCreatorCheck: i = !0 } = e ?? {}, a = new Ha();
	return t && (Ga(t) ? a.push(Ra) : a.push(za(t.extraArgument))), a;
}, qa = "RTK_autoBatch", Ja = () => (e) => ({
	payload: e,
	meta: { [qa]: !0 }
}), Ya = (e) => (t) => {
	setTimeout(t, e);
}, Xa = (e, t) => (n) => {
	let r = !1, i, a, o = () => {
		r || (r = !0, cancelAnimationFrame(i), clearTimeout(a), n());
	};
	i = e(o), a = setTimeout(o, t);
}, Za = (e = { type: "raf" }) => (t) => (...n) => {
	let r = t(...n), i = !0, a = !1, o = !1, s = /* @__PURE__ */ new Set(), c = e.type === "tick" ? queueMicrotask : e.type === "raf" ? typeof window < "u" && window.requestAnimationFrame ? Xa(window.requestAnimationFrame, 100) : Ya(10) : e.type === "callback" ? e.queueNotification : Ya(e.timeout), l = () => {
		o = !1, a && (a = !1, s.forEach((e) => e()));
	};
	return Object.assign({}, r, {
		subscribe(e) {
			let t = r.subscribe(() => i && e());
			return s.add(e), () => {
				t(), s.delete(e);
			};
		},
		dispatch(e) {
			try {
				return i = !e?.meta?.[qa], a = !i, a && (o || (o = !0, c(l))), r.dispatch(e);
			} finally {
				i = !0;
			}
		}
	});
}, Qa = (e) => function(t) {
	let { autoBatch: n = !0 } = t ?? {}, r = new Ha(e);
	return n && r.push(Za(typeof n == "object" ? n : void 0)), r;
};
function $a(e) {
	let t = Ka(), { reducer: n = void 0, middleware: r, devTools: i = !0, duplicateMiddlewareCheck: a = !0, preloadedState: o = void 0, enhancers: s = void 0 } = e || {}, c;
	if (typeof n == "function") c = n;
	else if (li(n)) c = fi(n);
	else throw Error(Xo(1));
	let l;
	l = typeof r == "function" ? r(t) : t();
	let u = pi;
	i && (u = Ba({
		trace: !1,
		...typeof i == "object" && i
	}));
	let d = Qa(mi(...l)), f = typeof s == "function" ? s(d) : d(), p = u(...f);
	return ui(c, o, p);
}
function eo(e) {
	let t = {}, n = [], r, i = {
		addCase(e, n) {
			let r = typeof e == "string" ? e : e.type;
			if (!r) throw Error(Xo(28));
			if (r in t) throw Error(Xo(29));
			return t[r] = n, i;
		},
		addAsyncThunk(e, r) {
			return r.pending && (t[e.pending.type] = r.pending), r.rejected && (t[e.rejected.type] = r.rejected), r.fulfilled && (t[e.fulfilled.type] = r.fulfilled), r.settled && n.push({
				matcher: e.settled,
				reducer: r.settled
			}), i;
		},
		addMatcher(e, t) {
			return n.push({
				matcher: e,
				reducer: t
			}), i;
		},
		addDefaultCase(e) {
			return r = e, i;
		}
	};
	return e(i), [
		t,
		n,
		r
	];
}
function to(e) {
	return typeof e == "function";
}
function no(e, t) {
	let [n, r, i] = eo(t), a;
	if (to(e)) a = () => Ua(e());
	else {
		let t = Ua(e);
		a = () => t;
	}
	function o(e = a(), t) {
		let o = [n[t.type], ...r.filter(({ matcher: e }) => e(t)).map(({ reducer: e }) => e)];
		return o.filter((e) => !!e).length === 0 && (o = [i]), o.reduce((e, n) => {
			if (n) {
				if (Oi(e)) {
					let r = n(e, t);
					return r === void 0 ? e : r;
				}
				if (ki(e)) return Ia(e, (e) => n(e, t));
				{
					let r = n(e, t);
					if (r === void 0) {
						if (e === null) return e;
						throw Error(Xo(9));
					}
					return r;
				}
			}
			return e;
		}, e);
	}
	return o.getInitialState = a, o;
}
var ro = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", io = (e = 21) => {
	let t = "", n = e;
	for (; n--;) t += ro[Math.random() * 64 | 0];
	return t;
}, ao = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function oo(e, t) {
	return `${e}/${t}`;
}
function so({ creators: e } = {}) {
	let t = e?.asyncThunk?.[ao];
	return function(e) {
		let { name: n, reducerPath: r = n } = e;
		if (!n) throw Error(Xo(11));
		let i = (typeof e.reducers == "function" ? e.reducers(uo()) : e.reducers) || {}, a = Object.keys(i), o = {
			sliceCaseReducersByName: {},
			sliceCaseReducersByType: {},
			actionCreators: {},
			sliceMatchers: []
		}, s = {
			addCase(e, t) {
				let n = typeof e == "string" ? e : e.type;
				if (!n) throw Error(Xo(12));
				if (n in o.sliceCaseReducersByType) throw Error(Xo(13));
				return o.sliceCaseReducersByType[n] = t, s;
			},
			addMatcher(e, t) {
				return o.sliceMatchers.push({
					matcher: e,
					reducer: t
				}), s;
			},
			exposeAction(e, t) {
				return o.actionCreators[e] = t, s;
			},
			exposeCaseReducer(e, t) {
				return o.sliceCaseReducersByName[e] = t, s;
			}
		};
		a.forEach((r) => {
			let a = i[r], o = {
				reducerName: r,
				type: oo(n, r),
				createNotation: typeof e.reducers == "function"
			};
			po(a) ? ho(o, a, s, t) : fo(o, a, s);
		});
		function c() {
			let [t = {}, n = [], r = void 0] = typeof e.extraReducers == "function" ? eo(e.extraReducers) : [e.extraReducers], i = {
				...t,
				...o.sliceCaseReducersByType
			};
			return no(e.initialState, (e) => {
				for (let t in i) e.addCase(t, i[t]);
				for (let t of o.sliceMatchers) e.addMatcher(t.matcher, t.reducer);
				for (let t of n) e.addMatcher(t.matcher, t.reducer);
				r && e.addDefaultCase(r);
			});
		}
		let l = (e) => e, u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new WeakMap(), f;
		function p(e, t) {
			return f ||= c(), f(e, t);
		}
		function m() {
			return f ||= c(), f.getInitialState();
		}
		function h(t, n = !1) {
			function r(e) {
				let i = e[t];
				return i === void 0 && n && (i = Wa(d, r, m)), i;
			}
			function i(t = l) {
				return Wa(Wa(u, n, () => /* @__PURE__ */ new WeakMap()), t, () => {
					let r = {};
					for (let [i, a] of Object.entries(e.selectors ?? {})) r[i] = co(a, t, () => Wa(d, t, m), n);
					return r;
				});
			}
			return {
				reducerPath: t,
				getSelectors: i,
				get selectors() {
					return i(r);
				},
				selectSlice: r
			};
		}
		let g = {
			name: n,
			reducer: p,
			actions: o.actionCreators,
			caseReducers: o.sliceCaseReducersByName,
			getInitialState: m,
			...h(r),
			injectInto(e, { reducerPath: t, ...n } = {}) {
				let i = t ?? r;
				return e.inject({
					reducerPath: i,
					reducer: p
				}, n), {
					...g,
					...h(i, !0)
				};
			}
		};
		return g;
	};
}
function co(e, t, n, r) {
	function i(i, ...a) {
		let o = t(i);
		return o === void 0 && r && (o = n()), e(o, ...a);
	}
	return i.unwrapped = e, i;
}
var lo = /* @__PURE__ */ so();
function uo() {
	function e(e, t) {
		return {
			_reducerDefinitionType: "asyncThunk",
			payloadCreator: e,
			...t
		};
	}
	return e.withTypes = () => e, {
		reducer(e) {
			return Object.assign({ [e.name](...t) {
				return e(...t);
			} }[e.name], { _reducerDefinitionType: "reducer" });
		},
		preparedReducer(e, t) {
			return {
				_reducerDefinitionType: "reducerWithPrepare",
				prepare: e,
				reducer: t
			};
		},
		asyncThunk: e
	};
}
function fo({ type: e, reducerName: t, createNotation: n }, r, i) {
	let a, o;
	if ("reducer" in r) {
		if (n && !mo(r)) throw Error(Xo(17));
		a = r.reducer, o = r.prepare;
	} else a = r;
	i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? Va(e, o) : Va(e));
}
function po(e) {
	return e._reducerDefinitionType === "asyncThunk";
}
function mo(e) {
	return e._reducerDefinitionType === "reducerWithPrepare";
}
function ho({ type: e, reducerName: t }, n, r, i) {
	if (!i) throw Error(Xo(18));
	let { payloadCreator: a, fulfilled: o, pending: s, rejected: c, settled: l, options: u } = n, d = i(e, a, u);
	r.exposeAction(t, d), o && r.addCase(d.fulfilled, o), s && r.addCase(d.pending, s), c && r.addCase(d.rejected, c), l && r.addMatcher(d.settled, l), r.exposeCaseReducer(t, {
		fulfilled: o || go,
		pending: s || go,
		rejected: c || go,
		settled: l || go
	});
}
function go() {}
var _o = "task", vo = "listener", yo = "completed", bo = "cancelled", xo = `task-${bo}`, So = `task-${yo}`, Co = `${vo}-${bo}`, wo = `${vo}-${yo}`, To = class {
	code;
	name = "TaskAbortError";
	message;
	constructor(e) {
		this.code = e, this.message = `${_o} ${bo} (reason: ${e})`;
	}
}, Eo = (e, t) => {
	if (typeof e != "function") throw TypeError(Xo(32));
}, Do = () => {}, Oo = (e, t = Do) => (e.catch(t), e), ko = (e, t) => (e.addEventListener("abort", t, { once: !0 }), () => e.removeEventListener("abort", t)), Ao = (e) => {
	if (e.aborted) throw new To(e.reason);
};
function jo(e, t) {
	let n = Do;
	return new Promise((r, i) => {
		let a = () => i(new To(e.reason));
		e.aborted ? a() : (n = ko(e, a), t.finally(() => n()).then(r, i));
	}).finally(() => {
		n = Do;
	});
}
var Mo = async (e, t) => {
	try {
		return await Promise.resolve(), {
			status: "ok",
			value: await e()
		};
	} catch (e) {
		return {
			status: e instanceof To ? "cancelled" : "rejected",
			error: e
		};
	} finally {
		t?.();
	}
}, No = (e) => (t) => Oo(jo(e, t).then((t) => (Ao(e), t))), Po = (e) => {
	let t = No(e);
	return (e) => t(new Promise((t) => setTimeout(t, e)));
}, { assign: Fo } = Object, Io = {}, Lo = "listenerMiddleware", Ro = (e, t) => {
	let n = (t) => ko(e, () => t.abort(e.reason));
	return (r, i) => {
		Eo(r, "taskExecutor");
		let a = new AbortController();
		n(a);
		let o = Mo(async () => {
			Ao(e), Ao(a.signal);
			let t = await r({
				pause: No(a.signal),
				delay: Po(a.signal),
				signal: a.signal
			});
			return Ao(a.signal), t;
		}, () => a.abort(So));
		return i?.autoJoin && t.push(o.catch(Do)), {
			result: No(e)(o),
			cancel() {
				a.abort(xo);
			}
		};
	};
}, G = (e, t) => {
	let n = async (n, r) => {
		Ao(t);
		let i = () => {}, a = [new Promise((t, r) => {
			let a = e({
				predicate: n,
				effect: (e, n) => {
					n.unsubscribe(), t([
						e,
						n.getState(),
						n.getOriginalState()
					]);
				}
			});
			i = () => {
				a(), r();
			};
		})];
		r != null && a.push(new Promise((e) => setTimeout(e, r, null)));
		try {
			let e = await jo(t, Promise.race(a));
			return Ao(t), e;
		} finally {
			i();
		}
	};
	return ((e, t) => Oo(n(e, t)));
}, zo = (e) => {
	let { type: t, actionCreator: n, matcher: r, predicate: i, effect: a } = e;
	if (t) i = Va(t).match;
	else if (n) t = n.type, i = n.match;
	else if (r) i = r;
	else if (!i) throw Error(Xo(21));
	return Eo(a, "options.listener"), {
		predicate: i,
		type: t,
		effect: a
	};
}, Bo = /* @__PURE__ */ Fo((e) => {
	let { type: t, predicate: n, effect: r } = zo(e);
	return {
		id: io(),
		effect: r,
		type: t,
		predicate: n,
		pending: /* @__PURE__ */ new Set(),
		unsubscribe: () => {
			throw Error(Xo(22));
		}
	};
}, { withTypes: () => Bo }), Vo = (e, t) => {
	let { type: n, effect: r, predicate: i } = zo(t);
	return Array.from(e.values()).find((e) => (typeof n == "string" ? e.type === n : e.predicate === i) && e.effect === r);
}, Ho = (e) => {
	e.pending.forEach((e) => {
		e.abort(Co);
	});
}, Uo = (e, t) => () => {
	for (let e of t.keys()) Ho(e);
	e.clear();
}, Wo = (e, t, n) => {
	try {
		e(t, n);
	} catch (e) {
		setTimeout(() => {
			throw e;
		}, 0);
	}
}, Go = /* @__PURE__ */ Fo(/* @__PURE__ */ Va(`${Lo}/add`), { withTypes: () => Go }), Ko = /* @__PURE__ */ Va(`${Lo}/removeAll`), qo = /* @__PURE__ */ Fo(/* @__PURE__ */ Va(`${Lo}/remove`), { withTypes: () => qo }), Jo = (...e) => {
	console.error(`${Lo}/error`, ...e);
}, Yo = (e = {}) => {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = (e) => {
		let t = n.get(e) ?? 0;
		n.set(e, t + 1);
	}, i = (e) => {
		let t = n.get(e) ?? 1;
		t === 1 ? n.delete(e) : n.set(e, t - 1);
	}, { extra: a, onError: o = Jo } = e;
	Eo(o, "onError");
	let s = (e) => (e.unsubscribe = () => t.delete(e.id), t.set(e.id, e), (t) => {
		e.unsubscribe(), t?.cancelActive && Ho(e);
	}), c = ((e) => {
		let n = Vo(t, e) ?? Bo(e);
		return s(n);
	});
	Fo(c, { withTypes: () => c });
	let l = (e) => {
		let n = Vo(t, e);
		return n && (n.unsubscribe(), e.cancelActive && Ho(n)), !!n;
	};
	Fo(l, { withTypes: () => l });
	let u = async (e, n, s, l) => {
		let u = new AbortController(), d = G(c, u.signal), f = [];
		try {
			e.pending.add(u), r(e), await Promise.resolve(e.effect(n, Fo({}, s, {
				getOriginalState: l,
				condition: (e, t) => d(e, t).then(Boolean),
				take: d,
				delay: Po(u.signal),
				pause: No(u.signal),
				extra: a,
				signal: u.signal,
				fork: Ro(u.signal, f),
				unsubscribe: e.unsubscribe,
				subscribe: () => {
					t.set(e.id, e);
				},
				cancelActiveListeners: () => {
					e.pending.forEach((e, t, n) => {
						e !== u && (e.abort(Co), n.delete(e));
					});
				},
				cancel: () => {
					u.abort(Co), e.pending.delete(u);
				},
				throwIfCancelled: () => {
					Ao(u.signal);
				}
			})));
		} catch (e) {
			e instanceof To || Wo(o, e, { raisedBy: "effect" });
		} finally {
			await Promise.all(f), u.abort(wo), i(e), e.pending.delete(u);
		}
	}, d = Uo(t, n);
	return {
		middleware: (e) => (n) => (r) => {
			if (!hi(r)) return n(r);
			if (Go.match(r)) return c(r.payload);
			if (Ko.match(r)) {
				d();
				return;
			}
			if (qo.match(r)) return l(r.payload);
			let i = e.getState(), a = () => {
				if (i === Io) throw Error(Xo(23));
				return i;
			}, s;
			try {
				if (s = n(r), t.size > 0) {
					let n = e.getState(), s = Array.from(t.values());
					for (let t of s) {
						let s = !1;
						try {
							s = t.predicate(r, n, i);
						} catch (e) {
							s = !1, Wo(o, e, { raisedBy: "predicate" });
						}
						s && u(t, r, e, a);
					}
				}
			} finally {
				i = Io;
			}
			return s;
		},
		startListening: c,
		stopListening: l,
		clearListeners: d
	};
};
function Xo(e) {
	return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
// analytics/node_modules/recharts/es6/state/layoutSlice.js
var Zo = lo({
	name: "chartLayout",
	initialState: {
		layoutType: "horizontal",
		width: 0,
		height: 0,
		margin: {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		scale: 1
	},
	reducers: {
		setLayout(e, t) {
			e.layoutType = t.payload;
		},
		setChartSize(e, t) {
			e.width = t.payload.width, e.height = t.payload.height;
		},
		setMargin(e, t) {
			e.margin.top = t.payload.top ?? 0, e.margin.right = t.payload.right ?? 0, e.margin.bottom = t.payload.bottom ?? 0, e.margin.left = t.payload.left ?? 0;
		},
		setScale(e, t) {
			e.scale = t.payload;
		}
	}
}), Qo = Zo.actions, $o = Qo.setMargin, es = Qo.setLayout, ts = Qo.setChartSize, ns = Qo.setScale, rs = Zo.reducer;
// analytics/node_modules/recharts/es6/util/getSliced.js
function is(e, t, n) {
	return Array.isArray(e) && e && t + n !== 0 ? e.slice(t, n + 1) : e;
}
// analytics/node_modules/recharts/es6/util/isWellBehavedNumber.js
function K(e) {
	return Number.isFinite(e);
}
function as(e) {
	return typeof e == "number" && e > 0 && Number.isFinite(e);
}
// analytics/node_modules/recharts/es6/util/ChartUtils.js
function os(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ss(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? os(Object(n), !0).forEach(function(t) {
			cs(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : os(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function cs(e, t, n) {
	return (t = ls(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ls(e) {
	var t = us(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function us(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function ds(e, t, n) {
	return Pe(e) || Pe(t) ? n : De(t) ? R(e, t, n) : typeof t == "function" ? t(e) : n;
}
var fs = (e, t, n) => {
	if (t && n) {
		var r = n.width, i = n.height, a = t.align, o = t.verticalAlign, s = t.layout, c = t.position, l = t.offset, u = l === void 0 ? 0 : l;
		if (c != null) {
			if (Ke(c)) {
				if (c === "top" && z(e.top)) return ss(ss({}, e), {}, { top: e.top + (i || 0) + u });
				if (c === "bottom" && z(e.bottom)) return ss(ss({}, e), {}, { bottom: e.bottom + (i || 0) + u });
				if (c === "left" && z(e.left)) return ss(ss({}, e), {}, { left: e.left + (r || 0) + u });
				if (c === "right" && z(e.right)) return ss(ss({}, e), {}, { right: e.right + (r || 0) + u });
			}
			return e;
		}
		if ((s === "vertical" || s === "horizontal" && o === "middle") && a !== "center" && z(e[a])) return ss(ss({}, e), {}, { [a]: e[a] + (r || 0) });
		if ((s === "horizontal" || s === "vertical" && a === "center") && o !== "middle" && z(e[o])) return ss(ss({}, e), {}, { [o]: e[o] + (i || 0) });
	}
	return e;
}, ps = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", ms = (e, t, n, r) => {
	if (r) return e.map((e) => e.coordinate);
	var i, a, o = e.map((e) => (e.coordinate === t && (i = !0), e.coordinate === n && (a = !0), e.coordinate));
	return i || o.push(t), a || o.push(n), o;
}, hs = (e, t, n) => {
	if (!e) return null;
	var r = e.duplicateDomain, i = e.type, a = e.range, o = e.scale, s = e.realScaleType, c = e.isCategorical, l = e.categoricalDomain, u = e.tickCount, d = e.ticks, f = e.niceTicks, p = e.axisType;
	if (!o) return null;
	var m = s === "scaleBand" && o.bandwidth ? o.bandwidth() / 2 : 2, h = (t || n) && i === "category" && o.bandwidth ? o.bandwidth() / m : 0;
	return h = p === "angleAxis" && a && a.length >= 2 ? we(a[0] - a[1]) * 2 * h : h, t && (d || f) ? (d || f || []).map((e, t) => {
		var n = r ? r.indexOf(e) : e, i = o.map(n);
		return K(i) ? {
			coordinate: i + h,
			value: e,
			offset: h,
			index: t
		} : null;
	}).filter(Ie) : c && l ? l.map((e, t) => {
		var n = o.map(e);
		return K(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter(Ie) : o.ticks && !n && u != null ? o.ticks(u).map((e, t) => {
		var n = o.map(e);
		return K(n) ? {
			coordinate: n + h,
			value: e,
			index: t,
			offset: h
		} : null;
	}).filter(Ie) : o.domain().map((e, t) => {
		var n = o.map(e);
		return K(n) ? {
			coordinate: n + h,
			value: r ? r[e] : e,
			index: t,
			offset: h
		} : null;
	}).filter(Ie);
}, gs = (e, t) => {
	if (!t || t.length !== 2 || !z(t[0]) || !z(t[1])) return e;
	var n = Math.min(t[0], t[1]), r = Math.max(t[0], t[1]), i = [e[0], e[1]];
	return (!z(e[0]) || e[0] < n) && (i[0] = n), (!z(e[1]) || e[1] > r) && (i[1] = r), i[0] > r && (i[0] = r), i[1] < n && (i[1] = n), i;
}, _s = {
	sign: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0, o = 0; o < t; ++o) {
				var s = e[o]?.[r];
				if (s != null) {
					var c = s[1], l = s[0], u = Te(c) ? l : c;
					u >= 0 ? (s[0] = i, i += u, s[1] = i) : (s[0] = a, a += u, s[1] = a);
				}
			}
		}
	},
	expand: Wt,
	none: zt,
	silhouette: B,
	wiggle: Gt,
	positive: (e) => {
		var t = e.length;
		if (!(t <= 0)) {
			var n = e[0]?.length;
			if (!(n == null || n <= 0)) for (var r = 0; r < n; ++r) for (var i = 0, a = 0; a < t; ++a) {
				var o = e[a]?.[r];
				if (o != null) {
					var s = Te(o[1]) ? o[0] : o[1];
					s >= 0 ? (o[0] = i, i += s, o[1] = i) : (o[0] = 0, o[1] = 0);
				}
			}
		}
	}
}, vs = (e, t, n) => {
	var r = _s[n] ?? zt, i = Ut().keys(t).value((e, t) => Number(ds(e, t, 0))).order(Bt).offset(r)(e);
	return i.forEach((n, r) => {
		n.forEach((n, i) => {
			var a = ds(e[i], t[r], 0);
			Array.isArray(a) && a.length === 2 && z(a[0]) && z(a[1]) && (n[0] = a[0], n[1] = a[1]);
		});
	}), i;
};
function ys(e) {
	return e == null ? void 0 : String(e);
}
function bs(e) {
	var t = e.axis, n = e.ticks, r = e.bandSize, i = e.entry, a = e.index, o = e.dataKey;
	if (t.type === "category") {
		if (!t.allowDuplicatedCategory && t.dataKey && !Pe(i[t.dataKey])) {
			var s = Ne(n, "value", i[t.dataKey]);
			if (s) return s.coordinate + r / 2;
		}
		return n != null && n[a] ? n[a].coordinate + r / 2 : null;
	}
	var c = ds(i, Pe(o) ? t.dataKey : o), l = t.scale.map(c);
	return z(l) ? l : null;
}
var xs = (e) => {
	var t = e.axis, n = e.ticks, r = e.offset, i = e.bandSize, a = e.entry, o = e.index;
	if (t.type === "category") return n[o] ? n[o].coordinate + r : null;
	var s = ds(a, t.dataKey, t.scale.domain()[o]);
	if (Pe(s)) return null;
	var c = t.scale.map(s);
	return z(c) ? c - i / 2 + r : null;
}, Ss = (e) => {
	var t = e.numericAxis, n = t.scale.domain();
	if (t.type === "number") {
		var r = Math.min(n[0], n[1]), i = Math.max(n[0], n[1]);
		return r <= 0 && i >= 0 ? 0 : i < 0 ? i : r;
	}
	return n[0];
}, Cs = (e) => {
	var t = e.flat(2).filter(z);
	return [Math.min(...t), Math.max(...t)];
}, ws = (e) => [e[0] === Infinity ? 0 : e[0], e[1] === -Infinity ? 0 : e[1]], Ts = (e, t, n) => {
	if (e != null && Object.keys(e).length !== 0) return ws(Object.keys(e).reduce((r, i) => {
		var a = e[i];
		if (!a) return r;
		var o = a.stackedData.reduce((e, r) => {
			var i = Cs(is(r, t, n));
			return !K(i[0]) || !K(i[1]) ? e : [Math.min(e[0], i[0]), Math.max(e[1], i[1])];
		}, [Infinity, -Infinity]);
		return [Math.min(o[0], r[0]), Math.max(o[1], r[1])];
	}, [Infinity, -Infinity]));
}, Es = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Ds = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, Os = (e, t, n) => {
	if (e && e.scale && e.scale.bandwidth) {
		var r = e.scale.bandwidth();
		if (!n || r > 0) return r;
	}
	if (e && t && t.length >= 2) {
		for (var i = Kr(t, (e) => e.coordinate), a = [], o = 0, s = 1, c = i.length; s < c; s++) {
			var l = (i[s]?.coordinate || 0) - (i[s - 1]?.coordinate || 0);
			a.push(l), o = Math.max(l, o);
		}
		var u = o * 1e-4, d = Infinity;
		for (var f of a) f > u && (d = Math.min(f, d));
		return d === Infinity ? 0 : d;
	}
	return n ? void 0 : 0;
};
function ks(e) {
	var t = e.tooltipEntrySettings, n = e.dataKey, r = e.payload, i = e.value, a = e.name;
	return ss(ss({}, t), {}, {
		dataKey: n,
		payload: r,
		value: i,
		name: a
	});
}
function As(e, t) {
	if (e != null) return String(e);
	if (typeof t == "string") return t;
}
var js = (e, t) => {
	if (t === "horizontal") return e.relativeX;
	if (t === "vertical") return e.relativeY;
}, Ms = (e, t) => t === "centric" ? e.angle : e.radius, Ns = (e) => e.layout.width, Ps = (e) => e.layout.height, Fs = (e) => e.layout.scale, Is = (e) => e.layout.margin, Ls = H((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), Rs = H((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), zs = "data-recharts-item-index";
// analytics/node_modules/recharts/es6/state/selectors/selectChartOffsetInternal.js
function Bs(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Vs(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Bs(Object(n), !0).forEach(function(t) {
			Hs(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bs(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Hs(e, t, n) {
	return (t = Us(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Us(e) {
	var t = Ws(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ws(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Gs = (e) => e.brush.height;
function Ks(e) {
	return Rs(e).reduce((e, t) => t.orientation === "left" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function qs(e) {
	return Rs(e).reduce((e, t) => t.orientation === "right" && !t.mirror && !t.hide ? e + (typeof t.width == "number" ? t.width : 60) : e, 0);
}
function Js(e) {
	return Ls(e).reduce((e, t) => t.orientation === "top" && !t.mirror && !t.hide ? e + (typeof t.height == "number" ? t.height : 30) : e, 0);
}
function Ys(e) {
	return Ls(e).reduce((e, t) => t.orientation === "bottom" && !t.mirror && !t.hide ? e + (typeof t.height == "number" ? t.height : 30) : e, 0);
}
var Xs = H([
	Ns,
	Ps,
	Is,
	Gs,
	Ks,
	qs,
	Js,
	Ys,
	qr,
	Jr
], (e, t, n, r, i, a, o, s, c, l) => {
	var u = {
		left: (n.left || 0) + i,
		right: (n.right || 0) + a
	}, d = Vs(Vs({}, {
		top: (n.top || 0) + o,
		bottom: (n.bottom || 0) + s
	}), u), f = d.bottom;
	d.bottom += r, d = fs(d, c, l);
	var p = e - d.left - d.right, m = t - d.top - d.bottom;
	return Vs(Vs({ brushBottom: f }, d), {}, {
		width: Math.max(p, 0),
		height: Math.max(m, 0)
	});
}), Zs = H(Xs, (e) => ({
	x: e.left,
	y: e.top,
	width: e.width,
	height: e.height
})), Qs = H(Ns, Ps, (e, t) => ({
	x: 0,
	y: 0,
	width: e,
	height: t
})), $s = /*#__PURE__*/ (0, b.createContext)(null), ec = () => (0, b.useContext)($s) != null, tc = (e) => e.brush, nc = H([
	tc,
	Xs,
	Is
], (e, t, n) => ({
	height: e.height,
	x: z(e.x) ? e.x : t.left,
	y: z(e.y) ? e.y : t.top + t.height + t.brushBottom - (n?.bottom || 0),
	width: z(e.width) ? e.width : t.width
}));
// analytics/node_modules/es-toolkit/dist/function/debounce.mjs
function rc(e, t, { signal: n, edges: r } = {}) {
	let i, a = null, o = r != null && r.includes("leading"), s = r == null || r.includes("trailing"), c = () => {
		a !== null && (e.apply(i, a), i = void 0, a = null);
	}, l = () => {
		s && c(), p();
	}, u = null, d = () => {
		u != null && clearTimeout(u), u = setTimeout(() => {
			u = null, l();
		}, t);
	}, f = () => {
		u !== null && (clearTimeout(u), u = null);
	}, p = () => {
		f(), i = void 0, a = null;
	}, m = () => {
		c();
	}, h = function(...e) {
		if (n?.aborted) return;
		i = this, a = e;
		let t = u == null;
		d(), o && t && c();
	};
	return h.schedule = d, h.cancel = p, h.flush = m, n?.addEventListener("abort", p, { once: !0 }), h;
}
// analytics/node_modules/es-toolkit/dist/compat/function/debounce.mjs
function ic(e, t = 0, n = {}) {
	typeof n != "object" && (n = {});
	let { leading: r = !1, trailing: i = !0, maxWait: a } = n, o = [, ,];
	r && (o[0] = "leading"), i && (o[1] = "trailing");
	let s, c = null, l = rc(function(...t) {
		s = e.apply(this, t), c = null;
	}, t, { edges: o }), u = function(...t) {
		return a != null && (c === null && (c = Date.now()), Date.now() - c >= a) ? ((r || i) && (s = e.apply(this, t)), c = Date.now(), l.cancel(), l.schedule(), s) : (l.apply(this, t), s);
	};
	return u.cancel = l.cancel, u.flush = () => (l.flush(), s), u;
}
// analytics/node_modules/es-toolkit/dist/compat/function/throttle.mjs
function ac(e, t = 0, n = {}) {
	let { leading: r = !0, trailing: i = !0 } = n;
	return ic(e, t, {
		leading: r,
		maxWait: t,
		trailing: i
	});
}
// analytics/node_modules/recharts/es6/util/LogUtils.js
var oc = function(e, t) {
	var n = [...arguments].slice(2);
	if (typeof console < "u" && console.warn && (t === void 0 && console.warn("LogUtils requires an error message argument"), !e)) {
		if (t === void 0) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
		else {
			var r = 0;
			console.warn(t.replace(/%s/g, () => n[r++]));
		}
	}
}, sc = {
	width: "100%",
	height: "100%",
	debounce: 0,
	minWidth: 0,
	initialDimension: {
		width: -1,
		height: -1
	}
}, cc = (e, t, n) => {
	var r = n.width, i = r === void 0 ? sc.width : r, a = n.height, o = a === void 0 ? sc.height : a, s = n.aspect, c = n.maxHeight, l = Ee(i) ? e : Number(i), u = Ee(o) ? t : Number(o);
	return s && s > 0 && (l ? u = l / s : u && (l = u * s), c && u != null && u > c && (u = c)), {
		calculatedWidth: l,
		calculatedHeight: u
	};
}, lc = {
	width: 0,
	height: 0,
	overflow: "visible"
}, uc = {
	width: 0,
	overflowX: "visible"
}, dc = {
	height: 0,
	overflowY: "visible"
}, fc = {}, pc = (e) => {
	var t = e.width, n = e.height, r = Ee(t), i = Ee(n);
	return r && i ? lc : r ? uc : i ? dc : fc;
};
function mc(e) {
	var t = e.width, n = e.height, r = e.aspect, i = t, a = n;
	return i === void 0 && a === void 0 ? (i = sc.width, a = sc.height) : i === void 0 ? i = r && r > 0 ? void 0 : sc.width : a === void 0 && (a = r && r > 0 ? void 0 : sc.height), {
		width: i,
		height: a
	};
}
// analytics/node_modules/recharts/es6/component/ResponsiveContainer.js
var hc = [
	"aspect",
	"initialDimension",
	"width",
	"height",
	"minWidth",
	"minHeight",
	"maxHeight",
	"children",
	"debounce",
	"id",
	"className",
	"onResize",
	"style"
];
function gc() {
	return gc = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, gc.apply(null, arguments);
}
function _c(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function vc(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? _c(Object(n), !0).forEach(function(t) {
			yc(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _c(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function yc(e, t, n) {
	return (t = bc(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function bc(e) {
	var t = xc(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function xc(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Sc(e, t) {
	return Dc(e) || Ec(e, t) || wc(e, t) || Cc();
}
function Cc() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function wc(e, t) {
	if (e) {
		if (typeof e == "string") return Tc(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tc(e, t) : void 0;
	}
}
function Tc(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Ec(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Dc(e) {
	if (Array.isArray(e)) return e;
}
function Oc(e, t) {
	if (e == null) return {};
	var n, r, i = kc(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function kc(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Ac = /*#__PURE__*/ (0, b.createContext)(sc.initialDimension);
function jc(e) {
	return as(e.width) && as(e.height);
}
function Mc(e) {
	var t = e.children, n = e.width, r = e.height, i = (0, b.useMemo)(() => ({
		width: n,
		height: r
	}), [n, r]);
	return jc(i) ? /*#__PURE__*/ b.createElement(Ac.Provider, { value: i }, t) : null;
}
var Nc = () => (0, b.useContext)(Ac), Pc = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.aspect, r = e.initialDimension, i = r === void 0 ? sc.initialDimension : r, a = e.width, o = e.height, s = e.minWidth, c = s === void 0 ? sc.minWidth : s, l = e.minHeight, u = e.maxHeight, d = e.children, f = e.debounce, p = f === void 0 ? sc.debounce : f, m = e.id, h = e.className, g = e.onResize, _ = e.style, v = _ === void 0 ? {} : _, y = Oc(e, hc), x = (0, b.useRef)(null), S = (0, b.useRef)();
	S.current = g, (0, b.useImperativeHandle)(t, () => x.current);
	var C = Sc((0, b.useState)({
		containerWidth: i.width,
		containerHeight: i.height
	}), 2), w = C[0], T = C[1], E = (0, b.useCallback)((e, t) => {
		T((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []);
	(0, b.useEffect)(() => {
		if (x.current == null || typeof ResizeObserver > "u") return Le;
		var e = (e) => {
			var t, n = e[0];
			if (n != null) {
				var r = n.contentRect, i = r.width, a = r.height;
				E(i, a), (t = S.current) == null || t.call(S, i, a);
			}
		};
		p > 0 && (e = ac(e, p, {
			trailing: !0,
			leading: !1
		}));
		var t = new ResizeObserver(e), n = x.current.getBoundingClientRect(), r = n.width, i = n.height;
		return E(r, i), t.observe(x.current), () => {
			t.disconnect();
		};
	}, [E, p]);
	var D = w.containerWidth, k = w.containerHeight;
	oc(!n || n > 0, "The aspect(%s) must be greater than zero.", n);
	var ee = cc(D, k, {
		width: a,
		height: o,
		aspect: n,
		maxHeight: u
	}), A = ee.calculatedWidth, j = ee.calculatedHeight;
	return oc(D < 0 || k < 0 || A != null && A > 0 || j != null && j > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", A, j, a, o, c, l, n), /*#__PURE__*/ b.createElement("div", gc({
		id: m ? `${m}` : void 0,
		className: O("recharts-responsive-container", h),
		style: vc(vc({}, v), {}, {
			width: a,
			height: o,
			minWidth: c,
			minHeight: l,
			maxHeight: u
		}),
		ref: x
	}, y), /*#__PURE__*/ b.createElement("div", { style: pc({
		width: a,
		height: o
	}) }, /*#__PURE__*/ b.createElement(Mc, {
		width: A,
		height: j
	}, d)));
}), Fc = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = Nc();
	if (as(n.width) && as(n.height)) return e.children;
	var r = mc({
		width: e.width,
		height: e.height,
		aspect: e.aspect
	}), i = r.width, a = r.height, o = cc(void 0, void 0, {
		width: i,
		height: a,
		aspect: e.aspect,
		maxHeight: e.maxHeight
	}), s = o.calculatedWidth, c = o.calculatedHeight;
	return z(s) && z(c) ? /*#__PURE__*/ b.createElement(Mc, {
		width: s,
		height: c
	}, e.children) : /*#__PURE__*/ b.createElement(Pc, gc({}, e, {
		width: i,
		height: a,
		ref: t
	}));
}), Ic = () => {
	var e = ec(), t = V(Zs), n = V(nc), r = V(tc)?.padding;
	return !e || !n || !r ? t : {
		width: n.width - r.left - r.right,
		height: n.height - r.top - r.bottom,
		x: r.left,
		y: r.top
	};
}, Lc = {
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	width: 0,
	height: 0,
	brushBottom: 0
}, Rc = () => V(Xs) ?? Lc, zc = () => V(Ns), Bc = () => V(Ps), q = (e) => e.layout.layoutType, Vc = () => V(q), Hc = () => {
	var e = Vc();
	if (e === "horizontal" || e === "vertical") return e;
}, Uc = (e) => {
	var t = e.layout.layoutType;
	if (t === "centric" || t === "radial") return t;
}, Wc = () => Vc() !== void 0, Gc = (e) => {
	var t = br(), n = ec(), r = e.width, i = e.height, a = Nc(), o = r, s = i;
	return a && (o = a.width > 0 ? a.width : r, s = a.height > 0 ? a.height : i), (0, b.useEffect)(() => {
		!n && as(o) && as(s) && t(ts({
			width: o,
			height: s
		}));
	}, [
		t,
		n,
		o,
		s
	]), null;
}, Kc = lo({
	name: "legend",
	initialState: {
		settings: {
			layout: "horizontal",
			align: "center",
			verticalAlign: "bottom",
			itemSorter: "value",
			position: void 0,
			offset: 0
		},
		size: {
			width: 0,
			height: 0
		},
		payload: []
	},
	reducers: {
		setLegendSize(e, t) {
			e.size.width = t.payload.width, e.size.height = t.payload.height;
		},
		setLegendSettings(e, t) {
			e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter, e.settings.position = t.payload.position, e.settings.offset = t.payload.offset;
		},
		addLegendPayload: {
			reducer(e, t) {
				e.payload.push(W(t.payload));
			},
			prepare: Ja()
		},
		replaceLegendPayload: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next, a = Pa(e).payload.indexOf(W(r));
				a > -1 && (e.payload[a] = W(i));
			},
			prepare: Ja()
		},
		removeLegendPayload: {
			reducer(e, t) {
				var n = Pa(e).payload.indexOf(W(t.payload));
				n > -1 && e.payload.splice(n, 1);
			},
			prepare: Ja()
		}
	}
}), qc = Kc.actions;
qc.setLegendSize, qc.setLegendSettings;
var Jc = qc.addLegendPayload, Yc = qc.replaceLegendPayload, Xc = qc.removeLegendPayload, Zc = Kc.reducer, Qc = /* @__PURE__ */ o(((e) => {
	var t = p();
	t.useSyncExternalStore, t.useRef, t.useEffect, t.useMemo, t.useDebugValue;
}));
(/* @__PURE__ */ o(((e, t) => {
	t.exports = Qc();
})))();
function $c(e) {
	e();
}
function el() {
	let e = null, t = null;
	return {
		clear() {
			e = null, t = null;
		},
		notify() {
			$c(() => {
				let t = e;
				for (; t;) t.callback(), t = t.next;
			});
		},
		get() {
			let t = [], n = e;
			for (; n;) t.push(n), n = n.next;
			return t;
		},
		subscribe(n) {
			let r = !0, i = t = {
				callback: n,
				next: null,
				prev: t
			};
			return i.prev ? i.prev.next = i : e = i, function() {
				r && e !== null && (r = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next);
			};
		}
	};
}
var tl = {
	notify() {},
	get: () => []
};
function nl(e, t) {
	let n, r = tl, i = 0, a = !1;
	function o(e) {
		u();
		let t = r.subscribe(e), n = !1;
		return () => {
			n || (n = !0, t(), d());
		};
	}
	function s() {
		r.notify();
	}
	function c() {
		m.onStateChange && m.onStateChange();
	}
	function l() {
		return a;
	}
	function u() {
		i++, n || (n = t ? t.addNestedSub(c) : e.subscribe(c), r = el());
	}
	function d() {
		i--, n && i === 0 && (n(), n = void 0, r.clear(), r = tl);
	}
	function f() {
		a || (a = !0, u());
	}
	function p() {
		a && (a = !1, d());
	}
	let m = {
		addNestedSub: o,
		notifyNestedSubs: s,
		handleChangeWrapper: c,
		isSubscribed: l,
		trySubscribe: f,
		tryUnsubscribe: p,
		getListeners: () => r
	};
	return m;
}
var rl = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, il = typeof navigator < "u" && navigator.product === "ReactNative", al = rl || il ? b.useLayoutEffect : b.useEffect;
function ol(e, t) {
	return e === t ? e !== 0 || t !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
function sl(e, t) {
	if (ol(e, t)) return !0;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r = 0; r < n.length; r++) if (!Object.prototype.hasOwnProperty.call(t, n[r]) || !ol(e[n[r]], t[n[r]])) return !1;
	return !0;
}
var cl = /* @__PURE__ */ Symbol.for("react-redux-context"), ll = typeof globalThis < "u" ? globalThis : {};
function ul() {
	if (!b.createContext) return {};
	let e = ll[cl] ??= /* @__PURE__ */ new Map(), t = e.get(b.createContext);
	return t || (t = b.createContext(null), e.set(b.createContext, t)), t;
}
var dl = /*#__PURE__*/ ul();
function fl(e) {
	let { children: t, context: n, serverState: r, store: i } = e, a = b.useMemo(() => {
		let e = nl(i);
		return {
			store: i,
			subscription: e,
			getServerState: r == null ? void 0 : () => r
		};
	}, [i, r]), o = b.useMemo(() => i.getState(), [i]);
	al(() => {
		let { subscription: e } = a;
		return e.onStateChange = e.notifyNestedSubs, e.trySubscribe(), o !== i.getState() && e.notifyNestedSubs(), () => {
			e.tryUnsubscribe(), e.onStateChange = void 0;
		};
	}, [a, o]);
	let s = n || dl;
	return /* @__PURE__ */ b.createElement(s.Provider, { value: a }, t);
}
// analytics/node_modules/recharts/es6/util/propsAreEqual.js
var pl = /* @__PURE__ */ new Set([
	"axisLine",
	"tickLine",
	"activeBar",
	"activeDot",
	"activeLabel",
	"activeShape",
	"allowEscapeViewBox",
	"background",
	"cursor",
	"dot",
	"label",
	"line",
	"margin",
	"padding",
	"position",
	"shape",
	"style",
	"tick",
	"wrapperStyle",
	"radius",
	"throttledEvents"
]);
function ml(e, t) {
	return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function hl(e, t) {
	for (var n of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) if (pl.has(n)) {
		if (e[n] == null && t[n] == null) continue;
		if (!sl(e[n], t[n])) return !1;
	} else if (!ml(e[n], t[n])) return !1;
	return !0;
}
// analytics/node_modules/recharts/es6/component/DefaultTooltipContent.js
function gl() {
	return gl = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, gl.apply(null, arguments);
}
function _l(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function vl(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? _l(Object(n), !0).forEach(function(t) {
			yl(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _l(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function yl(e, t, n) {
	return (t = bl(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function bl(e) {
	var t = xl(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function xl(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Sl(e, t) {
	return Dl(e) || El(e, t) || wl(e, t) || Cl();
}
function Cl() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function wl(e, t) {
	if (e) {
		if (typeof e == "string") return Tl(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tl(e, t) : void 0;
	}
}
function Tl(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function El(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Dl(e) {
	if (Array.isArray(e)) return e;
}
function Ol(e) {
	return Array.isArray(e) && De(e[0]) && De(e[1]) ? e.join(" ~ ") : e;
}
var kl = {
	separator: " : ",
	contentStyle: {
		margin: 0,
		padding: 10,
		backgroundColor: "#fff",
		border: "1px solid #ccc",
		whiteSpace: "nowrap"
	},
	itemStyle: {
		display: "block",
		paddingTop: 4,
		paddingBottom: 4,
		color: "#000"
	},
	labelStyle: {},
	accessibilityLayer: !1
};
function Al(e, t) {
	return t == null ? e : Kr(e, t);
}
var jl = (e) => {
	var t = e.separator, n = t === void 0 ? kl.separator : t, r = e.contentStyle, i = e.itemStyle, a = e.labelStyle, o = a === void 0 ? kl.labelStyle : a, s = e.payload, c = e.formatter, l = e.itemSorter, u = e.wrapperClassName, d = e.labelClassName, f = e.label, p = e.labelFormatter, m = e.accessibilityLayer, h = m === void 0 ? kl.accessibilityLayer : m, g = () => {
		if (s && s.length) {
			var e = {
				padding: 0,
				margin: 0
			}, t = Al(s, l).map((e, t) => {
				if (!e || e.type === "none") return null;
				var r = e.formatter || c || Ol, a = e.value, o = e.name, l = a, u = o;
				if (r) {
					var d = r(a, o, e, t, s);
					if (Array.isArray(d)) {
						var f = Sl(d, 2);
						l = f[0], u = f[1];
					} else if (d != null) l = d;
					else return null;
				}
				var p = vl(vl({}, kl.itemStyle), {}, { color: e.color || kl.itemStyle.color }, i);
				return /*#__PURE__*/ b.createElement("li", {
					className: "recharts-tooltip-item",
					key: `tooltip-item-${t}`,
					style: p
				}, De(u) ? /*#__PURE__*/ b.createElement("span", { className: "recharts-tooltip-item-name" }, u) : null, De(u) ? /*#__PURE__*/ b.createElement("span", { className: "recharts-tooltip-item-separator" }, n) : null, /*#__PURE__*/ b.createElement("span", { className: "recharts-tooltip-item-value" }, l), /*#__PURE__*/ b.createElement("span", { className: "recharts-tooltip-item-unit" }, e.unit || ""));
			});
			return /*#__PURE__*/ b.createElement("ul", {
				className: "recharts-tooltip-item-list",
				style: e
			}, t);
		}
		return null;
	}, _ = vl(vl({}, kl.contentStyle), r), v = vl({ margin: 0 }, o), y = !Pe(f), x = y ? f : "", S = O("recharts-default-tooltip", u), C = O("recharts-tooltip-label", d);
	y && p && s != null && (x = p(f, s));
	var w = h ? {
		role: "status",
		"aria-live": "assertive"
	} : {};
	return /*#__PURE__*/ b.createElement("div", gl({
		className: S,
		style: _
	}, w), /*#__PURE__*/ b.createElement("p", {
		className: C,
		style: v
	}, /*#__PURE__*/ b.isValidElement(x) ? x : `${x}`), g());
}, Ml = "recharts-tooltip-wrapper", Nl = { visibility: "hidden" };
function Pl(e) {
	var t = e.coordinate, n = e.translateX, r = e.translateY;
	return O(Ml, {
		[`${Ml}-right`]: z(n) && t && z(t.x) && n >= t.x,
		[`${Ml}-left`]: z(n) && t && z(t.x) && n < t.x,
		[`${Ml}-bottom`]: z(r) && t && z(t.y) && r >= t.y,
		[`${Ml}-top`]: z(r) && t && z(t.y) && r < t.y
	});
}
function Fl(e) {
	var t = e.allowEscapeViewBox, n = e.coordinate, r = e.key, i = e.offset, a = e.position, o = e.reverseDirection, s = e.tooltipDimension, c = e.viewBox, l = e.viewBoxDimension;
	if (a && z(a[r])) return a[r];
	var u = n[r] - s - (i > 0 ? i : 0), d = n[r] + i;
	if (t[r]) return o[r] ? u : d;
	var f = c[r];
	return f == null ? 0 : o[r] ? Math.max(u < f ? d : u, f) : l == null ? 0 : d + s > f + l ? Math.max(u, f) : Math.max(d, f);
}
function Il(e) {
	var t = e.translateX, n = e.translateY;
	return { transform: e.useTranslate3d ? `translate3d(${t}px, ${n}px, 0)` : `translate(${t}px, ${n}px)` };
}
function Ll(e) {
	var t = e.allowEscapeViewBox, n = e.coordinate, r = e.offsetTop, i = e.offsetLeft, a = e.position, o = e.reverseDirection, s = e.tooltipBox, c = e.useTranslate3d, l = e.viewBox, u, d, f;
	return s && s.height > 0 && s.width > 0 && n ? (d = Fl({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "x",
		offset: i,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.width,
		viewBox: l,
		viewBoxDimension: l.width
	}), f = Fl({
		allowEscapeViewBox: t,
		coordinate: n,
		key: "y",
		offset: r,
		position: a,
		reverseDirection: o,
		tooltipDimension: s.height,
		viewBox: l,
		viewBoxDimension: l.height
	}), u = Il({
		translateX: d,
		translateY: f,
		useTranslate3d: c
	})) : u = Nl, {
		cssProperties: u,
		cssClasses: Pl({
			translateX: d,
			translateY: f,
			coordinate: n
		})
	};
}
var Rl = {
	devToolsEnabled: !0,
	isSsr: !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout)
};
// analytics/node_modules/recharts/es6/util/usePrefersReducedMotion.js
function zl(e, t) {
	return Wl(e) || Ul(e, t) || Vl(e, t) || Bl();
}
function Bl() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Vl(e, t) {
	if (e) {
		if (typeof e == "string") return Hl(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Hl(e, t) : void 0;
	}
}
function Hl(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Ul(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Wl(e) {
	if (Array.isArray(e)) return e;
}
function Gl() {
	var e = zl((0, b.useState)(() => Rl.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches), 2), t = e[0], n = e[1];
	return (0, b.useEffect)(() => {
		if (window.matchMedia) {
			var e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => {
				n(e.matches);
			};
			return e.addEventListener("change", t), () => {
				e.removeEventListener("change", t);
			};
		}
	}, []), t;
}
// analytics/node_modules/recharts/es6/component/TooltipBoundingBox.js
function Kl(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ql(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Kl(Object(n), !0).forEach(function(t) {
			Jl(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Kl(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Jl(e, t, n) {
	return (t = Yl(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Yl(e) {
	var t = Xl(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Xl(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Zl(e, t) {
	return nu(e) || tu(e, t) || $l(e, t) || Ql();
}
function Ql() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function $l(e, t) {
	if (e) {
		if (typeof e == "string") return eu(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? eu(e, t) : void 0;
	}
}
function eu(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function tu(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function nu(e) {
	if (Array.isArray(e)) return e;
}
function ru(e) {
	if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) {
		var t = typeof e.animationEasing == "string" ? e.animationEasing : "ease";
		return `transform ${e.animationDuration}ms ${t}`;
	}
}
function iu(e) {
	var t = Gl(), n = Zl(b.useState(() => ({
		dismissed: !1,
		dismissedAtCoordinate: {
			x: 0,
			y: 0
		}
	})), 2), r = n[0], i = n[1];
	b.useEffect(() => {
		var t = (t) => {
			t.key === "Escape" && i({
				dismissed: !0,
				dismissedAtCoordinate: {
					x: e.coordinate?.x ?? 0,
					y: e.coordinate?.y ?? 0
				}
			});
		};
		return document.addEventListener("keydown", t), () => {
			document.removeEventListener("keydown", t);
		};
	}, [e.coordinate?.x, e.coordinate?.y]), r.dismissed && ((e.coordinate?.x ?? 0) !== r.dismissedAtCoordinate.x || (e.coordinate?.y ?? 0) !== r.dismissedAtCoordinate.y) && i(ql(ql({}, r), {}, { dismissed: !1 }));
	var a = Ll({
		allowEscapeViewBox: e.allowEscapeViewBox,
		coordinate: e.coordinate,
		offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
		offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
		position: e.position,
		reverseDirection: e.reverseDirection,
		tooltipBox: e.lastBoundingBox,
		useTranslate3d: e.useTranslate3d,
		viewBox: e.viewBox
	}), o = a.cssClasses, s = a.cssProperties, c = ql(ql({}, e.hasPortalFromProps ? {} : ql(ql({ transition: ru({
		prefersReducedMotion: t,
		isAnimationActive: e.isAnimationActive,
		active: e.active,
		animationDuration: e.animationDuration,
		animationEasing: e.animationEasing
	}) }, s), {}, {
		pointerEvents: "none",
		position: "absolute",
		top: 0,
		left: 0
	})), {}, { visibility: !r.dismissed && e.active && e.hasPayload ? "visible" : "hidden" }, e.wrapperStyle);
	return /*#__PURE__*/ b.createElement("div", {
		xmlns: "http://www.w3.org/1999/xhtml",
		tabIndex: -1,
		className: o,
		style: c,
		ref: e.innerRef
	}, e.children);
}
var au = /*#__PURE__*/ b.memo(iu), ou = () => V((e) => e.rootProps.accessibilityLayer) ?? !0;
// analytics/node_modules/recharts/es6/shape/Curve.js
function su() {
	return su = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, su.apply(null, arguments);
}
function cu(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function lu(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? cu(Object(n), !0).forEach(function(t) {
			uu(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cu(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function uu(e, t, n) {
	return (t = du(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function du(e) {
	var t = fu(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function fu(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var pu = {
	curveBasisClosed: vt,
	curveBasisOpen: bt,
	curveBasis: gt,
	curveBumpX: dt,
	curveBumpY: ft,
	curveLinearClosed: St,
	curveLinear: at,
	curveMonotoneX: At,
	curveMonotoneY: jt,
	curveNatural: Pt,
	curveStep: It,
	curveStepAfter: Rt,
	curveStepBefore: Lt
}, mu = (e) => K(e.x) && K(e.y), hu = (e) => e.base != null && mu(e.base) && mu(e), gu = (e) => e.x, _u = (e) => e.y, vu = (e, t) => {
	if (typeof e == "function") return e;
	var n = `curve${Fe(e)}`;
	if ((n === "curveMonotone" || n === "curveBump") && t) {
		var r = pu[`${n}${t === "vertical" ? "Y" : "X"}`];
		if (r) return r;
	}
	return pu[n] || at;
}, yu = {
	connectNulls: !1,
	type: "linear"
}, bu = (e) => {
	var t = e.type, n = t === void 0 ? yu.type : t, r = e.points, i = r === void 0 ? [] : r, a = e.baseLine, o = e.layout, s = e.connectNulls, c = s === void 0 ? yu.connectNulls : s, l = vu(n, o), u = c ? i.filter(mu) : i;
	if (Array.isArray(a)) {
		var d, f = i.map((e, t) => lu(lu({}, e), {}, { base: a[t] }));
		return d = o === "vertical" ? lt().y(_u).x1(gu).x0((e) => e.base.x) : lt().x(gu).y1(_u).y0((e) => e.base.y), d.defined(hu).curve(l)(c ? f.filter(hu) : f);
	}
	return (o === "vertical" && z(a) ? lt().y(_u).x1(gu).x0(a) : z(a) ? lt().x(gu).y1(_u).y0(a) : ct().x(gu).y(_u)).defined(mu).curve(l)(u);
}, xu = (e) => {
	var t = e.className, n = e.points, r = e.path, i = e.pathRef, a = Vc();
	if ((!n || !n.length) && !r) return null;
	var o = {
		type: e.type,
		points: e.points,
		baseLine: e.baseLine,
		layout: e.layout || a,
		connectNulls: e.connectNulls
	}, s = n && n.length ? bu(o) : r;
	return /*#__PURE__*/ b.createElement("path", su({}, N(e), qt(e), {
		className: O("recharts-curve", t),
		d: s === null ? void 0 : s,
		ref: i
	}));
}, Su = [
	"x",
	"y",
	"top",
	"left",
	"width",
	"height",
	"className"
];
function Cu() {
	return Cu = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Cu.apply(null, arguments);
}
function wu(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Tu(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? wu(Object(n), !0).forEach(function(t) {
			Eu(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wu(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Eu(e, t, n) {
	return (t = Du(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Du(e) {
	var t = Ou(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ou(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function ku(e, t) {
	if (e == null) return {};
	var n, r, i = Au(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Au(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ju = (e, t, n, r, i, a) => `M${e},${i}v${r}M${a},${t}h${n}`, Mu = (e) => {
	var t = e.x, n = t === void 0 ? 0 : t, r = e.y, i = r === void 0 ? 0 : r, a = e.top, o = a === void 0 ? 0 : a, s = e.left, c = s === void 0 ? 0 : s, l = e.width, u = l === void 0 ? 0 : l, d = e.height, f = d === void 0 ? 0 : d, p = e.className, m = ku(e, Su), h = Tu({
		x: n,
		y: i,
		top: o,
		left: c,
		width: u,
		height: f
	}, m);
	return !z(n) || !z(i) || !z(u) || !z(f) || !z(o) || !z(c) ? null : /*#__PURE__*/ b.createElement("path", Cu({}, te(h), {
		className: O("recharts-cross", p),
		d: ju(n, i, u, f, o, c)
	}));
};
// analytics/node_modules/recharts/es6/util/cursor/getCursorRectangle.js
function Nu(e, t, n, r) {
	var i = r / 2;
	return {
		stroke: "none",
		fill: "#ccc",
		x: e === "horizontal" ? t.x - i : n.left + .5,
		y: e === "horizontal" ? n.top + .5 : t.y - i,
		width: e === "horizontal" ? r : n.width - 1,
		height: e === "horizontal" ? n.height - 1 : r
	};
}
var Pu = (e, t) => [
	0,
	3 * e,
	3 * t - 6 * e,
	3 * e - 3 * t + 1
], Fu = (e, t) => e.map((e, n) => e * t ** n).reduce((e, t) => e + t), Iu = (e, t) => (n) => Fu(Pu(e, t), n), Lu = (e, t) => (n) => Fu([...Pu(e, t).map((e, t) => e * t).slice(1), 0], n), Ru = (e) => {
	var t, n = e.split("(");
	if (n.length !== 2 || n[0] !== "cubic-bezier") return null;
	var r = (t = n[1]) == null || (t = t.split(")")[0]) == null ? void 0 : t.split(",");
	if (r == null || r.length !== 4) return null;
	var i = r.map((e) => parseFloat(e));
	return [
		i[0],
		i[1],
		i[2],
		i[3]
	];
}, zu = function() {
	var e = [...arguments];
	if (e.length === 1) switch (e[0]) {
		case "linear": return [
			0,
			0,
			1,
			1
		];
		case "ease": return [
			.25,
			.1,
			.25,
			1
		];
		case "ease-in": return [
			.42,
			0,
			1,
			1
		];
		case "ease-out": return [
			.42,
			0,
			.58,
			1
		];
		case "ease-in-out": return [
			0,
			0,
			.58,
			1
		];
		default:
			var t = Ru(e[0]);
			if (t) return t;
	}
	return e.length === 4 ? e : [
		0,
		0,
		1,
		1
	];
}, Bu = (e, t, n, r) => {
	var i = Iu(e, n), a = Iu(t, r), o = Lu(e, n), s = (e) => e > 1 ? 1 : e < 0 ? 0 : e, c = (e) => {
		for (var t = e > 1 ? 1 : e, n = t, r = 0; r < 8; ++r) {
			var c = i(n) - t, l = o(n);
			if (Math.abs(c - t) < 1e-4 || l < 1e-4) return a(n);
			n = s(n - c / l);
		}
		return a(n);
	};
	return c.isStepper = !1, c;
}, Vu = function() {
	return Bu(...zu(...arguments));
}, Hu = function() {
	for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = e.stiff, n = t === void 0 ? 100 : t, r = e.damping, i = r === void 0 ? 8 : r, a = e.dt, o = a === void 0 ? 16.67 : a, s = 1, c = [0], l = 0, u = 0, d = 1e4, f = 0; f < d;) {
		var p = -(l - s) * n, m = u * i;
		if (u += (p - m) * o / 1e3, l += u * o / 1e3, c.push(l), Math.abs(l - s) < 1e-4 && Math.abs(u) < 1e-4) break;
		f++;
	}
	c[c.length - 1] = s;
	var h = c.length - 1;
	return (e) => {
		if (e <= 0) return 0;
		if (e >= 1) return s;
		var t = e * h, n = Math.floor(t), r = t - n;
		return (c[n] ?? 0) + ((c[n + 1] ?? 0) - (c[n] ?? 0)) * r;
	};
}, Uu = (e) => {
	if (typeof e == "string") switch (e) {
		case "ease":
		case "ease-in-out":
		case "ease-out":
		case "ease-in":
		case "linear": return Vu(e);
		case "spring": return Hu();
		default: if (e.split("(")[0] === "cubic-bezier") return Vu(e);
	}
	return typeof e == "function" ? e : null;
}, Wu = /*#__PURE__*/ (0, b.createContext)((e, t, n) => {
	var r, i = (a) => {
		var o = t.tick(a);
		if (t.getState() === "active") {
			if (n(t.getInterpolated()), t.getProgress() === 1) {
				t.complete(), r = void 0;
				return;
			}
			r = e.setTimeout(i, o);
		} else r = e.setTimeout(i, o);
	};
	return r = e.setTimeout(i, 0), () => r?.();
});
Wu.Provider;
function Gu(e) {
	var t = (0, b.useContext)(Wu);
	return (0, b.useMemo)(() => e ?? t, [e, t]);
}
// analytics/node_modules/recharts/es6/animation/AnimationHandle.js
function Ku(e, t, n) {
	return (t = qu(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function qu(e) {
	var t = Ju(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ju(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Yu = "init", Xu = "pending", Zu = "active", J = "completed";
function Qu(e) {
	return Math.max(0, e);
}
var Y = class {
	getAnimationStartedTime() {
		return this.animationStartedTime;
	}
	getBeginStartedTime() {
		return this.beginStartedTime;
	}
	constructor(e) {
		var t;
		Ku(this, "state", Yu), this.animationId = e.animationId, this.onAnimationEnd = e.onAnimationEnd, this.animationDuration = Qu(e.animationDuration), this.animationBegin = Qu(e.animationBegin), this.progress = 0, this.from = e.from, this.to = e.to, this.easing = e.easing, (t = e.onAnimationStart) == null || t.call(e);
	}
	getState() {
		return this.state;
	}
	getEasing() {
		return this.easing;
	}
	getAnimationDuration() {
		return this.animationDuration;
	}
	tick(e) {
		if (this.getState() === Yu) return this.state = Xu, this.beginStartedTime = e, this.animationBegin;
		if (this.getState() === Xu) {
			if (this.beginStartedTime == null) throw Error();
			var t = e - this.beginStartedTime;
			return t >= this.animationBegin ? (this.state = Zu, this.animationStartedTime = e, this.nextAnimationUpdate(0)) : Qu(this.animationBegin - t);
		}
		if (this.getState() === Zu) {
			if (this.animationStartedTime == null) throw Error();
			var n = e - this.animationStartedTime;
			return this.setProgress(n / this.animationDuration), this.nextAnimationUpdate(n);
		}
		return 0;
	}
	setProgress(e) {
		this.progress = Math.min(1, Math.max(0, e));
	}
	getProgress() {
		return this.progress;
	}
	complete() {
		if (this.progress = 1, this.state === "active") {
			var e;
			(e = this.onAnimationEnd) == null || e.call(this);
		}
		this.state = J;
	}
	getFrom() {
		return this.from;
	}
	getTo() {
		return this.to;
	}
	getAnimationId() {
		return this.animationId;
	}
	getAnimationBegin() {
		return this.animationBegin;
	}
}, X = class extends Y {
	nextAnimationUpdate() {
		return 0;
	}
	getInterpolated() {
		return this.easing(Me(this.getFrom(), this.getTo(), this.getProgress()));
	}
}, $u = class {
	setTimeout(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), r = null, i = (a) => {
			a - n >= t ? e(a) : r = requestAnimationFrame(i);
		};
		return r = requestAnimationFrame(i), () => {
			r != null && cancelAnimationFrame(r);
		};
	}
};
// analytics/node_modules/recharts/es6/animation/JavascriptAnimate.js
function ed(e, t) {
	return ad(e) || id(e, t) || nd(e, t) || td();
}
function td() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function nd(e, t) {
	if (e) {
		if (typeof e == "string") return rd(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? rd(e, t) : void 0;
	}
}
function rd(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function id(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function ad(e) {
	if (Array.isArray(e)) return e;
}
var od = {
	begin: 0,
	duration: 1e3,
	easing: "ease",
	isActive: !0,
	canBegin: !0,
	onAnimationEnd: () => {},
	onAnimationStart: () => {}
}, sd = 0, cd = 1;
function ld(e) {
	var t = tn(e, od), n = t.animationId, r = t.isActive, i = t.canBegin, a = t.duration, o = t.easing, s = t.begin, c = t.onAnimationEnd, l = t.onAnimationStart, u = t.children, d = Gl(), f = r === "auto" ? !Rl.isSsr && !d : r, p = Gu(t.animationController), m = ed((0, b.useState)(f ? sd : cd), 2), h = m[0], g = m[1];
	return (0, b.useEffect)(() => {
		f || g(cd);
	}, [f]), (0, b.useEffect)(() => {
		var e = Uu(o);
		return !f || !i || e == null ? Le : p(new $u(), new X({
			animationId: n,
			easing: e,
			animationDuration: a,
			animationBegin: s,
			onAnimationStart: l,
			onAnimationEnd: c,
			from: sd,
			to: cd
		}), g);
	}, [
		p,
		n,
		f,
		i,
		a,
		o,
		s,
		l,
		c
	]), u(Number(h));
}
// analytics/node_modules/recharts/es6/util/useAnimationId.js
function ud(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", n = (0, b.useRef)(ke(t)), r = (0, b.useRef)(e);
	return r.current !== e && (n.current = ke(t), r.current = e), n.current;
}
// analytics/node_modules/recharts/es6/animation/util.js
var dd = (e) => e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`), fd = (e, t, n) => e.map((e) => `${dd(e)} ${t}ms ${n}`).join(","), pd = ["radius"], md = ["radius"], hd, gd, _d, vd, yd, bd, xd, Sd, Cd, wd;
function Td(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Ed(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Td(Object(n), !0).forEach(function(t) {
			Dd(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Td(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Dd(e, t, n) {
	return (t = Od(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Od(e) {
	var t = kd(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function kd(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Ad() {
	return Ad = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Ad.apply(null, arguments);
}
function jd(e, t) {
	if (e == null) return {};
	var n, r, i = Md(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Md(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Nd(e, t) {
	return Rd(e) || Ld(e, t) || Fd(e, t) || Pd();
}
function Pd() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Fd(e, t) {
	if (e) {
		if (typeof e == "string") return Id(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Id(e, t) : void 0;
	}
}
function Id(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Ld(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Rd(e) {
	if (Array.isArray(e)) return e;
}
function zd(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Bd = (e, t, n, r, i) => {
	var a = Se(n), o = Se(r), s = Math.min(Math.abs(a) / 2, Math.abs(o) / 2), c = o >= 0 ? 1 : -1, l = a >= 0 ? 1 : -1, u = +(o >= 0 && a >= 0 || o < 0 && a < 0), d;
	if (s > 0 && Array.isArray(i)) {
		for (var f = [
			0,
			0,
			0,
			0
		], p = 0, m = 4; p < m; p++) {
			var h = i[p] ?? 0;
			f[p] = h > s ? s : h;
		}
		d = Ce(hd ||= zd([
			"M",
			",",
			""
		]), e, t + c * f[0]), f[0] > 0 && (d += Ce(gd ||= zd([
			"A ",
			",",
			",0,0,",
			",",
			",",
			""
		]), f[0], f[0], u, e + l * f[0], t)), d += Ce(_d ||= zd([
			"L ",
			",",
			""
		]), e + n - l * f[1], t), f[1] > 0 && (d += Ce(vd ||= zd([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[1], f[1], u, e + n, t + c * f[1])), d += Ce(yd ||= zd([
			"L ",
			",",
			""
		]), e + n, t + r - c * f[2]), f[2] > 0 && (d += Ce(bd ||= zd([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[2], f[2], u, e + n - l * f[2], t + r)), d += Ce(xd ||= zd([
			"L ",
			",",
			""
		]), e + l * f[3], t + r), f[3] > 0 && (d += Ce(Sd ||= zd([
			"A ",
			",",
			",0,0,",
			",\n        ",
			",",
			""
		]), f[3], f[3], u, e, t + r - c * f[3])), d += "Z";
	} else if (s > 0 && i === +i && i > 0) {
		var g = Math.min(s, i);
		d = Ce(Cd ||= zd(/* @__PURE__ */ "M .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,.\n            L .,.\n            A .,.,0,0,.,.,. Z".split(".")), e, t + c * g, g, g, u, e + l * g, t, e + n - l * g, t, g, g, u, e + n, t + c * g, e + n, t + r - c * g, g, g, u, e + n - l * g, t + r, e + l * g, t + r, g, g, u, e, t + r - c * g);
	} else d = Ce(wd ||= zd([
		"M ",
		",",
		" h ",
		" v ",
		" h ",
		" Z"
	]), e, t, n, r, -n);
	return d;
}, Vd = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	radius: 0,
	isAnimationActive: !1,
	isUpdateAnimationActive: !1,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease"
}, Hd = (e) => {
	var t = tn(e, Vd), n = (0, b.useRef)(null), r = Nd((0, b.useState)(-1), 2), i = r[0], a = r[1];
	(0, b.useEffect)(() => {
		if (n.current && n.current.getTotalLength) try {
			var e = n.current.getTotalLength();
			e && a(e);
		} catch {}
	}, []);
	var o = t.x, s = t.y, c = t.width, l = t.height, u = t.radius, d = t.className, f = t.animationEasing, p = t.animationDuration, m = t.animationBegin, h = t.isAnimationActive, g = t.isUpdateAnimationActive, _ = (0, b.useRef)(c), v = (0, b.useRef)(l), y = (0, b.useRef)(o), x = (0, b.useRef)(s), S = ud((0, b.useMemo)(() => ({
		x: o,
		y: s,
		width: c,
		height: l,
		radius: u
	}), [
		o,
		s,
		c,
		l,
		u
	]), "rectangle-");
	if (o !== +o || s !== +s || c !== +c || l !== +l || c === 0 || l === 0) return null;
	var C = O("recharts-rectangle", d);
	if (!g) {
		var w = te(t);
		w.radius;
		var T = jd(w, pd);
		return /*#__PURE__*/ b.createElement("path", Ad({}, T, {
			x: Se(o),
			y: Se(s),
			width: Se(c),
			height: Se(l),
			radius: typeof u == "number" ? u : void 0,
			className: C,
			d: Bd(o, s, c, l, u)
		}));
	}
	var E = _.current, D = v.current, k = y.current, ee = x.current, A = `0px ${i === -1 ? 1 : i}px`, j = `${i}px ${i}px`, M = fd(["strokeDasharray"], p, typeof f == "string" ? f : Vd.animationEasing);
	return /*#__PURE__*/ b.createElement(ld, {
		animationId: S,
		key: S,
		canBegin: i > 0,
		duration: p,
		easing: f,
		isActive: g,
		begin: m
	}, (e) => {
		var r = Me(E, c, e), i = Me(D, l, e), a = Me(k, o, e), d = Me(ee, s, e);
		n.current && (_.current = r, v.current = i, y.current = a, x.current = d);
		var f = h ? e > 0 ? {
			transition: M,
			strokeDasharray: j
		} : { strokeDasharray: A } : { strokeDasharray: j }, p = te(t);
		p.radius;
		var m = jd(p, md);
		return /*#__PURE__*/ b.createElement("path", Ad({}, m, {
			radius: typeof u == "number" ? u : void 0,
			className: C,
			d: Bd(a, d, r, i, u),
			ref: n,
			style: Ed(Ed({}, f), t.style)
		}));
	});
};
// analytics/node_modules/recharts/es6/util/PolarUtils.js
function Ud(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Wd(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ud(Object(n), !0).forEach(function(t) {
			Gd(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ud(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Gd(e, t, n) {
	return (t = Kd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Kd(e) {
	var t = qd(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function qd(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Jd = Math.PI / 180, Yd = (e) => e * 180 / Math.PI, Xd = (e, t, n, r) => ({
	x: e + Math.cos(-Jd * r) * n,
	y: t + Math.sin(-Jd * r) * n
}), Zd = function(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 0,
		height: 0,
		brushBottom: 0
	};
	return Math.min(Math.abs(e - (n.left || 0) - (n.right || 0)), Math.abs(t - (n.top || 0) - (n.bottom || 0))) / 2;
}, Qd = (e, t) => {
	var n = e.x, r = e.y, i = t.x, a = t.y;
	return Math.sqrt((n - i) ** 2 + (r - a) ** 2);
}, $d = (e, t) => {
	var n = e.x, r = e.y, i = t.cx, a = t.cy, o = Qd({
		x: n,
		y: r
	}, {
		x: i,
		y: a
	});
	if (o <= 0) return {
		radius: o,
		angle: 0
	};
	var s = (n - i) / o, c = Math.acos(s);
	return r > a && (c = 2 * Math.PI - c), {
		radius: o,
		angle: Yd(c),
		angleInRadian: c
	};
}, ef = (e) => {
	var t = e.startAngle, n = e.endAngle, r = Math.floor(t / 360), i = Math.floor(n / 360), a = Math.min(r, i);
	return {
		startAngle: t - a * 360,
		endAngle: n - a * 360
	};
}, tf = (e, t) => {
	var n = t.startAngle, r = t.endAngle, i = Math.floor(n / 360), a = Math.floor(r / 360);
	return e + Math.min(i, a) * 360;
}, nf = (e, t) => {
	var n = e.relativeX, r = e.relativeY, i = $d({
		x: n,
		y: r
	}, t), a = i.radius, o = i.angle, s = t.innerRadius, c = t.outerRadius;
	if (a < s || a > c || a === 0) return null;
	var l = ef(t), u = l.startAngle, d = l.endAngle, f = o, p;
	if (u <= d) {
		for (; f > d;) f -= 360;
		for (; f < u;) f += 360;
		p = f >= u && f <= d;
	} else {
		for (; f > u;) f -= 360;
		for (; f < d;) f += 360;
		p = f >= d && f <= u;
	}
	return p ? Wd(Wd({}, t), {}, {
		radius: a,
		angle: tf(f, t)
	}) : null;
};
// analytics/node_modules/recharts/es6/util/cursor/getRadialCursorPoints.js
function rf(e) {
	var t = e.cx, n = e.cy, r = e.radius, i = e.startAngle, a = e.endAngle;
	return {
		points: [Xd(t, n, r, i), Xd(t, n, r, a)],
		cx: t,
		cy: n,
		radius: r,
		startAngle: i,
		endAngle: a
	};
}
// analytics/node_modules/recharts/es6/shape/Sector.js
var af, of, sf, cf, lf, uf, df;
function ff() {
	return ff = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, ff.apply(null, arguments);
}
function pf(e, t) {
	return t ||= e.slice(0), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var mf = (e, t) => we(t - e) * Math.min(Math.abs(t - e), 359.999), hf = (e) => {
	var t = e.cx, n = e.cy, r = e.radius, i = e.angle, a = e.sign, o = e.isExternal, s = e.cornerRadius, c = e.cornerIsExternal, l = s * (o ? 1 : -1) + r, u = Math.asin(s / l) / Jd, d = c ? i : i + a * u, f = Xd(t, n, l, d), p = Xd(t, n, r, d), m = c ? i - a * u : i;
	return {
		center: f,
		circleTangency: p,
		lineTangency: Xd(t, n, l * Math.cos(u * Jd), m),
		theta: u
	};
}, gf = (e) => {
	var t = e.cx, n = e.cy, r = e.innerRadius, i = e.outerRadius, a = e.startAngle, o = e.endAngle, s = mf(a, o), c = a + s, l = Xd(t, n, i, a), u = Xd(t, n, i, c), d = Ce(af ||= pf([
		"M ",
		",",
		"\n    A ",
		",",
		",0,\n    ",
		",",
		",\n    ",
		",",
		"\n  "
	]), l.x, l.y, i, i, +(Math.abs(s) > 180), +(a > c), u.x, u.y);
	if (r > 0) {
		var f = Xd(t, n, r, a), p = Xd(t, n, r, c);
		d += Ce(of ||= pf([
			"L ",
			",",
			"\n            A ",
			",",
			",0,\n            ",
			",",
			",\n            ",
			",",
			" Z"
		]), p.x, p.y, r, r, +(Math.abs(s) > 180), +(a <= c), f.x, f.y);
	} else d += Ce(sf ||= pf([
		"L ",
		",",
		" Z"
	]), t, n);
	return d;
}, _f = (e) => {
	var t = e.cx, n = e.cy, r = e.innerRadius, i = e.outerRadius, a = e.cornerRadius, o = e.forceCornerRadius, s = e.cornerIsExternal, c = e.startAngle, l = e.endAngle, u = we(l - c), d = hf({
		cx: t,
		cy: n,
		radius: i,
		angle: c,
		sign: u,
		cornerRadius: a,
		cornerIsExternal: s
	}), f = d.circleTangency, p = d.lineTangency, m = d.theta, h = hf({
		cx: t,
		cy: n,
		radius: i,
		angle: l,
		sign: -u,
		cornerRadius: a,
		cornerIsExternal: s
	}), g = h.circleTangency, _ = h.lineTangency, v = h.theta, y = s ? Math.abs(c - l) : Math.abs(c - l) - m - v;
	if (y < 0) return o ? Ce(cf ||= pf([
		"M ",
		",",
		"\n        a",
		",",
		",0,0,1,",
		",0\n        a",
		",",
		",0,0,1,",
		",0\n      "
	]), p.x, p.y, a, a, a * 2, a, a, -a * 2) : gf({
		cx: t,
		cy: n,
		innerRadius: r,
		outerRadius: i,
		startAngle: c,
		endAngle: l
	});
	var b = Ce(lf ||= pf([
		"M ",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n    A",
		",",
		",0,",
		",",
		",",
		",",
		"\n    A",
		",",
		",0,0,",
		",",
		",",
		"\n  "
	]), p.x, p.y, a, a, +(u < 0), f.x, f.y, i, i, +(y > 180), +(u < 0), g.x, g.y, a, a, +(u < 0), _.x, _.y);
	if (r > 0) {
		var x = hf({
			cx: t,
			cy: n,
			radius: r,
			angle: c,
			sign: u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), S = x.circleTangency, C = x.lineTangency, w = x.theta, T = hf({
			cx: t,
			cy: n,
			radius: r,
			angle: l,
			sign: -u,
			isExternal: !0,
			cornerRadius: a,
			cornerIsExternal: s
		}), E = T.circleTangency, D = T.lineTangency, O = T.theta, k = s ? Math.abs(c - l) : Math.abs(c - l) - w - O;
		if (k < 0 && a === 0) return `${b}L${t},${n}Z`;
		b += Ce(uf ||= pf([
			"L",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"\n      A",
			",",
			",0,",
			",",
			",",
			",",
			"\n      A",
			",",
			",0,0,",
			",",
			",",
			"Z"
		]), D.x, D.y, a, a, +(u < 0), E.x, E.y, r, r, +(k > 180), +(u > 0), S.x, S.y, a, a, +(u < 0), C.x, C.y);
	} else b += Ce(df ||= pf([
		"L",
		",",
		"Z"
	]), t, n);
	return b;
}, vf = {
	cx: 0,
	cy: 0,
	innerRadius: 0,
	outerRadius: 0,
	startAngle: 0,
	endAngle: 0,
	cornerRadius: 0,
	forceCornerRadius: !1,
	cornerIsExternal: !1
}, yf = (e) => {
	var t = tn(e, vf), n = t.cx, r = t.cy, i = t.innerRadius, a = t.outerRadius, o = t.cornerRadius, s = t.forceCornerRadius, c = t.cornerIsExternal, l = t.startAngle, u = t.endAngle, d = t.className;
	if (a < i || l === u) return null;
	var f = O("recharts-sector", d), p = a - i, m = Ae(o, p, 0, !0), h = m > 0 && Math.abs(l - u) < 360 ? _f({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		cornerRadius: Math.min(m, p / 2),
		forceCornerRadius: s,
		cornerIsExternal: c,
		startAngle: l,
		endAngle: u
	}) : gf({
		cx: n,
		cy: r,
		innerRadius: i,
		outerRadius: a,
		startAngle: l,
		endAngle: u
	});
	return /*#__PURE__*/ b.createElement("path", ff({}, te(t), {
		className: f,
		d: h
	}));
};
// analytics/node_modules/recharts/es6/util/cursor/getCursorPoints.js
function bf(e, t, n) {
	if (e === "horizontal") return [{
		x: t.x,
		y: n.top
	}, {
		x: t.x,
		y: n.top + n.height
	}];
	if (e === "vertical") return [{
		x: n.left,
		y: t.y
	}, {
		x: n.left + n.width,
		y: t.y
	}];
	if (Kt(t)) {
		if (e === "centric") {
			var r = t.cx, i = t.cy, a = t.innerRadius, o = t.outerRadius, s = t.angle, c = Xd(r, i, a, s), l = Xd(r, i, o, s);
			return [{
				x: c.x,
				y: c.y
			}, {
				x: l.x,
				y: l.y
			}];
		}
		return rf(t);
	}
}
// analytics/node_modules/es-toolkit/dist/compat/util/toNumber.mjs
function xf(e) {
	return ge(e) ? NaN : Number(e);
}
// analytics/node_modules/es-toolkit/dist/compat/util/toFinite.mjs
function Sf(e) {
	return e ? (e = xf(e), e === Infinity || e === -Infinity ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
// analytics/node_modules/es-toolkit/dist/compat/math/range.mjs
function Cf(e, t, n) {
	n && typeof n != "number" && Rr(e, t, n) && (t = n = void 0), e = Sf(e), t === void 0 ? (t = e, e = 0) : t = Sf(t), n = n === void 0 ? e < t ? 1 : -1 : Sf(n);
	let r = Math.max(Math.ceil((t - e) / (n || 1)), 0), i = Array(r);
	for (let t = 0; t < r; t++) i[t] = e, e += n;
	return i;
}
// analytics/node_modules/recharts/es6/state/selectors/dataSelectors.js
var wf = (e) => e.chartData, Tf = H([wf], (e) => {
	var t = e.chartData == null ? 0 : e.chartData.length - 1;
	return {
		chartData: e.chartData,
		computedData: e.computedData,
		dataEndIndex: t,
		dataStartIndex: 0
	};
}), Ef = (e, t, n, r) => r ? Tf(e) : wf(e), Df = (e, t, n) => n ? Tf(e) : wf(e), Of = H([Ef], (e) => {
	var t = e.chartData, n = e.dataStartIndex, r = e.dataEndIndex;
	return t == null ? [] : t.slice(n, r + 1);
});
H([Tf], (e) => {
	var t = e.chartData, n = e.dataStartIndex, r = e.dataEndIndex;
	return t == null ? [] : t.slice(n, r + 1);
});
var kf = H([wf], (e) => {
	var t = e.chartData, n = e.dataStartIndex, r = e.dataEndIndex;
	return t == null ? [] : t.slice(n, r + 1);
});
// analytics/node_modules/recharts/es6/util/isDomainSpecifiedByUser.js
function Af(e, t) {
	return Ff(e) || Pf(e, t) || Mf(e, t) || jf();
}
function jf() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Mf(e, t) {
	if (e) {
		if (typeof e == "string") return Nf(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Nf(e, t) : void 0;
	}
}
function Nf(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Pf(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Ff(e) {
	if (Array.isArray(e)) return e;
}
function If(e) {
	if (Array.isArray(e) && e.length === 2) {
		var t = Af(e, 2), n = t[0], r = t[1];
		if (K(n) && K(r)) return !0;
	}
	return !1;
}
function Lf(e, t, n) {
	return n ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function Rf(e, t) {
	if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
		var n = Af(e, 2), r = n[0], i = n[1], a, o;
		if (K(r)) a = r;
		else if (typeof r == "function") return;
		if (K(i)) o = i;
		else if (typeof i == "function") return;
		var s = [a, o];
		if (If(s)) return s;
	}
}
function zf(e, t, n) {
	if (n || t != null) {
		if (typeof e == "function" && t != null) try {
			var r = e(t, n);
			if (If(r)) return Lf(r, t, n);
		} catch {}
		if (Array.isArray(e) && e.length === 2) {
			var i = Af(e, 2), a = i[0], o = i[1], s, c;
			if (a === "auto") t != null && (s = Math.min(...t));
			else if (z(a)) s = a;
			else if (typeof a == "function") try {
				t != null && (s = a(t?.[0]));
			} catch {}
			else if (typeof a == "string" && Es.test(a)) {
				var l = Es.exec(a);
				if (l == null || l[1] == null || t == null) s = void 0;
				else {
					var u = +l[1];
					s = t[0] - u;
				}
			} else s = t?.[0];
			if (o === "auto") t != null && (c = Math.max(...t));
			else if (z(o)) c = o;
			else if (typeof o == "function") try {
				t != null && (c = o(t?.[1]));
			} catch {}
			else if (typeof o == "string" && Ds.test(o)) {
				var d = Ds.exec(o);
				if (d == null || d[1] == null || t == null) c = void 0;
				else {
					var f = +d[1];
					c = t[1] + f;
				}
			} else c = t?.[1];
			var p = [s, c];
			if (If(p)) return t == null ? p : Lf(p, t, n);
		}
	}
}
// analytics/node_modules/recharts/es6/util/scale/util/arithmetic.js
var Z = /* @__PURE__ */ l((/* @__PURE__ */ o(((e, t, n) => {
	(function(e) {
		var n = 1e9, r = {
			precision: 20,
			rounding: 4,
			toExpNeg: -7,
			toExpPos: 21,
			LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
		}, i = !0, a = "[DecimalError] ", o = a + "Invalid argument: ", s = a + "Exponent out of range: ", c = Math.floor, l = Math.pow, u = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, d, f = 1e7, p = 7, m = 9007199254740991, h = c(m / p), g = {};
		g.absoluteValue = g.abs = function() {
			var e = new this.constructor(this);
			return e.s &&= 1, e;
		}, g.comparedTo = g.cmp = function(e) {
			var t, n, r, i, a = this;
			if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
			if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
			for (r = a.d.length, i = e.d.length, t = 0, n = r < i ? r : i; t < n; ++t) if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
			return r === i ? 0 : r > i ^ a.s < 0 ? 1 : -1;
		}, g.decimalPlaces = g.dp = function() {
			var e = this, t = e.d.length - 1, n = (t - e.e) * p;
			if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) n--;
			return n < 0 ? 0 : n;
		}, g.dividedBy = g.div = function(e) {
			return b(this, new this.constructor(e));
		}, g.dividedToIntegerBy = g.idiv = function(e) {
			var t = this, n = t.constructor;
			return D(b(t, new n(e), 0, 1), n.precision);
		}, g.equals = g.eq = function(e) {
			return !this.cmp(e);
		}, g.exponent = function() {
			return S(this);
		}, g.greaterThan = g.gt = function(e) {
			return this.cmp(e) > 0;
		}, g.greaterThanOrEqualTo = g.gte = function(e) {
			return this.cmp(e) >= 0;
		}, g.isInteger = g.isint = function() {
			return this.e > this.d.length - 2;
		}, g.isNegative = g.isneg = function() {
			return this.s < 0;
		}, g.isPositive = g.ispos = function() {
			return this.s > 0;
		}, g.isZero = function() {
			return this.s === 0;
		}, g.lessThan = g.lt = function(e) {
			return this.cmp(e) < 0;
		}, g.lessThanOrEqualTo = g.lte = function(e) {
			return this.cmp(e) < 1;
		}, g.logarithm = g.log = function(e) {
			var t, n = this, r = n.constructor, o = r.precision, s = o + 5;
			if (e === void 0) e = new r(10);
			else if (e = new r(e), e.s < 1 || e.eq(d)) throw Error(a + "NaN");
			if (n.s < 1) throw Error(a + (n.s ? "NaN" : "-Infinity"));
			return n.eq(d) ? new r(0) : (i = !1, t = b(T(n, s), T(e, s), s), i = !0, D(t, o));
		}, g.minus = g.sub = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? O(t, e) : _(t, (e.s = -e.s, e));
		}, g.modulo = g.mod = function(e) {
			var t, n = this, r = n.constructor, o = r.precision;
			if (e = new r(e), !e.s) throw Error(a + "NaN");
			return n.s ? (i = !1, t = b(n, e, 0, 1).times(e), i = !0, n.minus(t)) : D(new r(n), o);
		}, g.naturalExponential = g.exp = function() {
			return x(this);
		}, g.naturalLogarithm = g.ln = function() {
			return T(this);
		}, g.negated = g.neg = function() {
			var e = new this.constructor(this);
			return e.s = -e.s || 0, e;
		}, g.plus = g.add = function(e) {
			var t = this;
			return e = new t.constructor(e), t.s == e.s ? _(t, e) : O(t, (e.s = -e.s, e));
		}, g.precision = g.sd = function(e) {
			var t, n, r, i = this;
			if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(o + e);
			if (t = S(i) + 1, r = i.d.length - 1, n = r * p + 1, r = i.d[r], r) {
				for (; r % 10 == 0; r /= 10) n--;
				for (r = i.d[0]; r >= 10; r /= 10) n++;
			}
			return e && t > n ? t : n;
		}, g.squareRoot = g.sqrt = function() {
			var e, t, n, r, o, s, l, u = this, d = u.constructor;
			if (u.s < 1) {
				if (!u.s) return new d(0);
				throw Error(a + "NaN");
			}
			for (e = S(u), i = !1, o = Math.sqrt(+u), o == 0 || o == 1 / 0 ? (t = y(u.d), (t.length + e) % 2 == 0 && (t += "0"), o = Math.sqrt(t), e = c((e + 1) / 2) - (e < 0 || e % 2), o == 1 / 0 ? t = "5e" + e : (t = o.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), r = new d(t)) : r = new d(o.toString()), n = d.precision, o = l = n + 3;;) if (s = r, r = s.plus(b(u, s, l + 2)).times(.5), y(s.d).slice(0, l) === (t = y(r.d)).slice(0, l)) {
				if (t = t.slice(l - 3, l + 1), o == l && t == "4999") {
					if (D(s, n + 1, 0), s.times(s).eq(u)) {
						r = s;
						break;
					}
				} else if (t != "9999") break;
				l += 4;
			}
			return i = !0, D(r, n);
		}, g.times = g.mul = function(e) {
			var t, n, r, a, o, s, c, l, u, d = this, p = d.constructor, m = d.d, h = (e = new p(e)).d;
			if (!d.s || !e.s) return new p(0);
			for (e.s *= d.s, n = d.e + e.e, l = m.length, u = h.length, l < u && (o = m, m = h, h = o, s = l, l = u, u = s), o = [], s = l + u, r = s; r--;) o.push(0);
			for (r = u; --r >= 0;) {
				for (t = 0, a = l + r; a > r;) c = o[a] + h[r] * m[a - r - 1] + t, o[a--] = c % f | 0, t = c / f | 0;
				o[a] = (o[a] + t) % f | 0;
			}
			for (; !o[--s];) o.pop();
			return t ? ++n : o.shift(), e.d = o, e.e = n, i ? D(e, p.precision) : e;
		}, g.toDecimalPlaces = g.todp = function(e, t) {
			var r = this, i = r.constructor;
			return r = new i(r), e === void 0 ? r : (v(e, 0, n), t === void 0 ? t = i.rounding : v(t, 0, 8), D(r, e + S(r) + 1, t));
		}, g.toExponential = function(e, t) {
			var r, i = this, a = i.constructor;
			return e === void 0 ? r = k(i, !0) : (v(e, 0, n), t === void 0 ? t = a.rounding : v(t, 0, 8), i = D(new a(i), e + 1, t), r = k(i, !0, e + 1)), r;
		}, g.toFixed = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? k(a) : (v(e, 0, n), t === void 0 ? t = o.rounding : v(t, 0, 8), i = D(new o(a), e + S(a) + 1, t), r = k(i.abs(), !1, e + S(i) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
		}, g.toInteger = g.toint = function() {
			var e = this, t = e.constructor;
			return D(new t(e), S(e) + 1, t.rounding);
		}, g.toNumber = function() {
			return +this;
		}, g.toPower = g.pow = function(e) {
			var t, n, r, o, s, l, u = this, f = u.constructor, h = 12, g = +(e = new f(e));
			if (!e.s) return new f(d);
			if (u = new f(u), !u.s) {
				if (e.s < 1) throw Error(a + "Infinity");
				return u;
			}
			if (u.eq(d)) return u;
			if (r = f.precision, e.eq(d)) return D(u, r);
			if (t = e.e, n = e.d.length - 1, l = t >= n, s = u.s, !l) {
				if (s < 0) throw Error(a + "NaN");
			} else if ((n = g < 0 ? -g : g) <= m) {
				for (o = new f(d), t = Math.ceil(r / p + 4), i = !1; n % 2 && (o = o.times(u), ee(o.d, t)), n = c(n / 2), n !== 0;) u = u.times(u), ee(u.d, t);
				return i = !0, e.s < 0 ? new f(d).div(o) : D(o, r);
			}
			return s = s < 0 && e.d[Math.max(t, n)] & 1 ? -1 : 1, u.s = 1, i = !1, o = e.times(T(u, r + h)), i = !0, o = x(o), o.s = s, o;
		}, g.toPrecision = function(e, t) {
			var r, i, a = this, o = a.constructor;
			return e === void 0 ? (r = S(a), i = k(a, r <= o.toExpNeg || r >= o.toExpPos)) : (v(e, 1, n), t === void 0 ? t = o.rounding : v(t, 0, 8), a = D(new o(a), e, t), r = S(a), i = k(a, e <= r || r <= o.toExpNeg, e)), i;
		}, g.toSignificantDigits = g.tosd = function(e, t) {
			var r = this, i = r.constructor;
			return e === void 0 ? (e = i.precision, t = i.rounding) : (v(e, 1, n), t === void 0 ? t = i.rounding : v(t, 0, 8)), D(new i(r), e, t);
		}, g.toString = g.valueOf = g.val = g.toJSON = function() {
			var e = this, t = S(e), n = e.constructor;
			return k(e, t <= n.toExpNeg || t >= n.toExpPos);
		};
		function _(e, t) {
			var n, r, a, o, s, c, l, u, d = e.constructor, m = d.precision;
			if (!e.s || !t.s) return t.s || (t = new d(e)), i ? D(t, m) : t;
			if (l = e.d, u = t.d, s = e.e, a = t.e, l = l.slice(), o = s - a, o) {
				for (o < 0 ? (r = l, o = -o, c = u.length) : (r = u, a = s, c = l.length), s = Math.ceil(m / p), c = s > c ? s + 1 : c + 1, o > c && (o = c, r.length = 1), r.reverse(); o--;) r.push(0);
				r.reverse();
			}
			for (c = l.length, o = u.length, c - o < 0 && (o = c, r = u, u = l, l = r), n = 0; o;) n = (l[--o] = l[o] + u[o] + n) / f | 0, l[o] %= f;
			for (n && (l.unshift(n), ++a), c = l.length; l[--c] == 0;) l.pop();
			return t.d = l, t.e = a, i ? D(t, m) : t;
		}
		function v(e, t, n) {
			if (e !== ~~e || e < t || e > n) throw Error(o + e);
		}
		function y(e) {
			var t, n, r, i = e.length - 1, a = "", o = e[0];
			if (i > 0) {
				for (a += o, t = 1; t < i; t++) r = e[t] + "", n = p - r.length, n && (a += w(n)), a += r;
				o = e[t], r = o + "", n = p - r.length, n && (a += w(n));
			} else if (o === 0) return "0";
			for (; o % 10 == 0;) o /= 10;
			return a + o;
		}
		var b = (function() {
			function e(e, t) {
				var n, r = 0, i = e.length;
				for (e = e.slice(); i--;) n = e[i] * t + r, e[i] = n % f | 0, r = n / f | 0;
				return r && e.unshift(r), e;
			}
			function t(e, t, n, r) {
				var i, a;
				if (n != r) a = n > r ? 1 : -1;
				else for (i = a = 0; i < n; i++) if (e[i] != t[i]) {
					a = e[i] > t[i] ? 1 : -1;
					break;
				}
				return a;
			}
			function n(e, t, n) {
				for (var r = 0; n--;) e[n] -= r, r = +(e[n] < t[n]), e[n] = r * f + e[n] - t[n];
				for (; !e[0] && e.length > 1;) e.shift();
			}
			return function(r, i, o, s) {
				var c, l, u, d, m, h, g, _, v, y, b, x, C, w, T, E, O, k, ee = r.constructor, A = r.s == i.s ? 1 : -1, j = r.d, M = i.d;
				if (!r.s) return new ee(r);
				if (!i.s) throw Error(a + "Division by zero");
				for (l = r.e - i.e, O = M.length, T = j.length, g = new ee(A), _ = g.d = [], u = 0; M[u] == (j[u] || 0);) ++u;
				if (M[u] > (j[u] || 0) && --l, x = o == null ? o = ee.precision : s ? o + (S(r) - S(i)) + 1 : o, x < 0) return new ee(0);
				if (x = x / p + 2 | 0, u = 0, O == 1) for (d = 0, M = M[0], x++; (u < T || d) && x--; u++) C = d * f + (j[u] || 0), _[u] = C / M | 0, d = C % M | 0;
				else {
					for (d = f / (M[0] + 1) | 0, d > 1 && (M = e(M, d), j = e(j, d), O = M.length, T = j.length), w = O, v = j.slice(0, O), y = v.length; y < O;) v[y++] = 0;
					k = M.slice(), k.unshift(0), E = M[0], M[1] >= f / 2 && ++E;
					do
						d = 0, c = t(M, v, O, y), c < 0 ? (b = v[0], O != y && (b = b * f + (v[1] || 0)), d = b / E | 0, d > 1 ? (d >= f && (d = f - 1), m = e(M, d), h = m.length, y = v.length, c = t(m, v, h, y), c == 1 && (d--, n(m, O < h ? k : M, h))) : (d == 0 && (c = d = 1), m = M.slice()), h = m.length, h < y && m.unshift(0), n(v, m, y), c == -1 && (y = v.length, c = t(M, v, O, y), c < 1 && (d++, n(v, O < y ? k : M, y))), y = v.length) : c === 0 && (d++, v = [0]), _[u++] = d, c && v[0] ? v[y++] = j[w] || 0 : (v = [j[w]], y = 1);
					while ((w++ < T || v[0] !== void 0) && x--);
				}
				return _[0] || _.shift(), g.e = l, D(g, s ? o + S(g) + 1 : o);
			};
		})();
		function x(e, t) {
			var n, r, a, o, c, u, f = 0, p = 0, m = e.constructor, h = m.precision;
			if (S(e) > 16) throw Error(s + S(e));
			if (!e.s) return new m(d);
			for (t == null ? (i = !1, u = h) : u = t, c = new m(.03125); e.abs().gte(.1);) e = e.times(c), p += 5;
			for (r = Math.log(l(2, p)) / Math.LN10 * 2 + 5 | 0, u += r, n = a = o = new m(d), m.precision = u;;) {
				if (a = D(a.times(e), u), n = n.times(++f), c = o.plus(b(a, n, u)), y(c.d).slice(0, u) === y(o.d).slice(0, u)) {
					for (; p--;) o = D(o.times(o), u);
					return m.precision = h, t == null ? (i = !0, D(o, h)) : o;
				}
				o = c;
			}
		}
		function S(e) {
			for (var t = e.e * p, n = e.d[0]; n >= 10; n /= 10) t++;
			return t;
		}
		function C(e, t, n) {
			if (t > e.LN10.sd()) throw i = !0, n && (e.precision = n), Error(a + "LN10 precision limit exceeded");
			return D(new e(e.LN10), t);
		}
		function w(e) {
			for (var t = ""; e--;) t += "0";
			return t;
		}
		function T(e, t) {
			var n, r, o, s, c, l, u, f, p, m = 1, h = 10, g = e, _ = g.d, v = g.constructor, x = v.precision;
			if (g.s < 1) throw Error(a + (g.s ? "NaN" : "-Infinity"));
			if (g.eq(d)) return new v(0);
			if (t == null ? (i = !1, f = x) : f = t, g.eq(10)) return t ?? (i = !0), C(v, f);
			if (f += h, v.precision = f, n = y(_), r = n.charAt(0), s = S(g), Math.abs(s) < 0x5543df729c000) {
				for (; r < 7 && r != 1 || r == 1 && n.charAt(1) > 3;) g = g.times(e), n = y(g.d), r = n.charAt(0), m++;
				s = S(g), r > 1 ? (g = new v("0." + n), s++) : g = new v(r + "." + n.slice(1));
			} else return u = C(v, f + 2, x).times(s + ""), g = T(new v(r + "." + n.slice(1)), f - h).plus(u), v.precision = x, t == null ? (i = !0, D(g, x)) : g;
			for (l = c = g = b(g.minus(d), g.plus(d), f), p = D(g.times(g), f), o = 3;;) {
				if (c = D(c.times(p), f), u = l.plus(b(c, new v(o), f)), y(u.d).slice(0, f) === y(l.d).slice(0, f)) return l = l.times(2), s !== 0 && (l = l.plus(C(v, f + 2, x).times(s + ""))), l = b(l, new v(m), f), v.precision = x, t == null ? (i = !0, D(l, x)) : l;
				l = u, o += 2;
			}
		}
		function E(e, t) {
			var n, r, a;
			for ((n = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (r = t.search(/e/i)) > 0 ? (n < 0 && (n = r), n += +t.slice(r + 1), t = t.substring(0, r)) : n < 0 && (n = t.length), r = 0; t.charCodeAt(r) === 48;) ++r;
			for (a = t.length; t.charCodeAt(a - 1) === 48;) --a;
			if (t = t.slice(r, a), t) {
				if (a -= r, n = n - r - 1, e.e = c(n / p), e.d = [], r = (n + 1) % p, n < 0 && (r += p), r < a) {
					for (r && e.d.push(+t.slice(0, r)), a -= p; r < a;) e.d.push(+t.slice(r, r += p));
					t = t.slice(r), r = p - t.length;
				} else r -= a;
				for (; r--;) t += "0";
				if (e.d.push(+t), i && (e.e > h || e.e < -h)) throw Error(s + n);
			} else e.s = 0, e.e = 0, e.d = [0];
			return e;
		}
		function D(e, t, n) {
			var r, a, o, u, d, m, g, _, v = e.d;
			for (u = 1, o = v[0]; o >= 10; o /= 10) u++;
			if (r = t - u, r < 0) r += p, a = t, g = v[_ = 0];
			else {
				if (_ = Math.ceil((r + 1) / p), o = v.length, _ >= o) return e;
				for (g = o = v[_], u = 1; o >= 10; o /= 10) u++;
				r %= p, a = r - p + u;
			}
			if (n !== void 0 && (o = l(10, u - a - 1), d = g / o % 10 | 0, m = t < 0 || v[_ + 1] !== void 0 || g % o, m = n < 4 ? (d || m) && (n == 0 || n == (e.s < 0 ? 3 : 2)) : d > 5 || d == 5 && (n == 4 || m || n == 6 && (r > 0 ? a > 0 ? g / l(10, u - a) : 0 : v[_ - 1]) % 10 & 1 || n == (e.s < 0 ? 8 : 7))), t < 1 || !v[0]) return m ? (o = S(e), v.length = 1, t = t - o - 1, v[0] = l(10, (p - t % p) % p), e.e = c(-t / p) || 0) : (v.length = 1, v[0] = e.e = e.s = 0), e;
			if (r == 0 ? (v.length = _, o = 1, _--) : (v.length = _ + 1, o = l(10, p - r), v[_] = a > 0 ? (g / l(10, u - a) % l(10, a) | 0) * o : 0), m) for (;;) if (_ == 0) {
				(v[0] += o) == f && (v[0] = 1, ++e.e);
				break;
			} else {
				if (v[_] += o, v[_] != f) break;
				v[_--] = 0, o = 1;
			}
			for (r = v.length; v[--r] === 0;) v.pop();
			if (i && (e.e > h || e.e < -h)) throw Error(s + S(e));
			return e;
		}
		function O(e, t) {
			var n, r, a, o, s, c, l, u, d, m, h = e.constructor, g = h.precision;
			if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new h(e), i ? D(t, g) : t;
			if (l = e.d, m = t.d, r = t.e, u = e.e, l = l.slice(), s = u - r, s) {
				for (d = s < 0, d ? (n = l, s = -s, c = m.length) : (n = m, r = u, c = l.length), a = Math.max(Math.ceil(g / p), c) + 2, s > a && (s = a, n.length = 1), n.reverse(), a = s; a--;) n.push(0);
				n.reverse();
			} else {
				for (a = l.length, c = m.length, d = a < c, d && (c = a), a = 0; a < c; a++) if (l[a] != m[a]) {
					d = l[a] < m[a];
					break;
				}
				s = 0;
			}
			for (d && (n = l, l = m, m = n, t.s = -t.s), c = l.length, a = m.length - c; a > 0; --a) l[c++] = 0;
			for (a = m.length; a > s;) {
				if (l[--a] < m[a]) {
					for (o = a; o && l[--o] === 0;) l[o] = f - 1;
					--l[o], l[a] += f;
				}
				l[a] -= m[a];
			}
			for (; l[--c] === 0;) l.pop();
			for (; l[0] === 0; l.shift()) --r;
			return l[0] ? (t.d = l, t.e = r, i ? D(t, g) : t) : new h(0);
		}
		function k(e, t, n) {
			var r, i = S(e), a = y(e.d), o = a.length;
			return t ? (n && (r = n - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + w(r) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + w(-i - 1) + a, n && (r = n - o) > 0 && (a += w(r))) : i >= o ? (a += w(i + 1 - o), n && (r = n - i - 1) > 0 && (a = a + "." + w(r))) : ((r = i + 1) < o && (a = a.slice(0, r) + "." + a.slice(r)), n && (r = n - o) > 0 && (i + 1 === o && (a += "."), a += w(r))), e.s < 0 ? "-" + a : a;
		}
		function ee(e, t) {
			if (e.length > t) return e.length = t, !0;
		}
		function A(e) {
			var t, n, r;
			function i(e) {
				var t = this;
				if (!(t instanceof i)) return new i(e);
				if (t.constructor = i, e instanceof i) t.s = e.s, t.e = e.e, t.d = (e = e.d) ? e.slice() : e;
				else {
					if (typeof e == "number") {
						if (e * 0 != 0) throw Error(o + e);
						if (e > 0) t.s = 1;
						else if (e < 0) e = -e, t.s = -1;
						else {
							t.s = 0, t.e = 0, t.d = [0];
							return;
						}
						if (e === ~~e && e < 1e7) {
							t.e = 0, t.d = [e];
							return;
						}
						return E(t, e.toString());
					}
					if (typeof e != "string") throw Error(o + e);
					if (e.charCodeAt(0) === 45 ? (e = e.slice(1), t.s = -1) : t.s = 1, u.test(e)) E(t, e);
					else throw Error(o + e);
				}
			}
			if (i.prototype = g, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = A, i.config = i.set = j, e === void 0 && (e = {}), e) for (r = [
				"precision",
				"rounding",
				"toExpNeg",
				"toExpPos",
				"LN10"
			], t = 0; t < r.length;) e.hasOwnProperty(n = r[t++]) || (e[n] = this[n]);
			return i.config(e), i;
		}
		function j(e) {
			if (!e || typeof e != "object") throw Error(a + "Object expected");
			var t, r, i, s = [
				"precision",
				1,
				n,
				"rounding",
				0,
				8,
				"toExpNeg",
				-1 / 0,
				0,
				"toExpPos",
				0,
				1 / 0
			];
			for (t = 0; t < s.length; t += 3) if ((i = e[r = s[t]]) !== void 0) {
				if (c(i) === i && i >= s[t + 1] && i <= s[t + 2]) this[r] = i;
				else throw Error(o + r + ": " + i);
			}
			if ((i = e[r = "LN10"]) !== void 0) {
				if (i == Math.LN10) this[r] = new this(i);
				else throw Error(o + r + ": " + i);
			}
			return this;
		}
		r = A(r), r.default = r.Decimal = r, d = new r(1), typeof define == "function" && define.amd ? define(function() {
			return r;
		}) : t !== void 0 && t.exports ? t.exports = r : (e ||= typeof self < "u" && self && self.self == self ? self : Function("return this")(), e.Decimal = r);
	})(n);
})))());
function Bf(e) {
	return e === 0 ? 1 : Math.floor(new Z.default(e).abs().log(10).toNumber()) + 1;
}
function Vf(e, t, n) {
	for (var r = new Z.default(e), i = 0, a = []; r.lt(t) && i < 1e5;) a.push(r.toNumber()), r = r.add(n), i++;
	return a;
}
// analytics/node_modules/recharts/es6/util/scale/getNiceTickValues.js
function Q(e, t) {
	return Kf(e) || Gf(e, t) || Uf(e, t) || Hf();
}
function Hf() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Uf(e, t) {
	if (e) {
		if (typeof e == "string") return Wf(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Wf(e, t) : void 0;
	}
}
function Wf(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Gf(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Kf(e) {
	if (Array.isArray(e)) return e;
}
var qf = (e) => {
	var t = Q(e, 2), n = t[0], r = t[1], i = n, a = r;
	return n > r && (i = r, a = n), [i, a];
}, Jf = (e, t, n) => {
	if (e.lte(0)) return new Z.default(0);
	var r = Bf(e.toNumber()), i = new Z.default(10).pow(r), a = e.div(i), o = r === 1 ? .1 : .05, s = new Z.default(Math.ceil(a.div(o).toNumber())).add(n).mul(o).mul(i);
	return t ? new Z.default(s.toNumber()) : new Z.default(Math.ceil(s.toNumber()));
}, Yf = (e, t, n) => {
	if (e.lte(0)) return new Z.default(0);
	var r = [
		1,
		2,
		2.5,
		5
	], i = e.toNumber(), a = Math.floor(new Z.default(i).abs().log(10).toNumber()), o = new Z.default(10).pow(a), s = e.div(o).toNumber(), c = r.findIndex((e) => e >= s - 1e-10);
	if (c === -1 && (o = o.mul(10), c = 0), c += n, c >= r.length) {
		var l = Math.floor(c / r.length);
		c %= r.length, o = o.mul(new Z.default(10).pow(l));
	}
	var u = r[c] ?? 1, d = new Z.default(u).mul(o);
	return t ? d : new Z.default(Math.ceil(d.toNumber()));
}, Xf = (e, t, n) => {
	var r = new Z.default(1), i = new Z.default(e);
	if (!i.isint() && n) {
		var a = Math.abs(e);
		a < 1 ? (r = new Z.default(10).pow(Bf(e) - 1), i = new Z.default(Math.floor(i.div(r).toNumber())).mul(r)) : a > 1 && (i = new Z.default(Math.floor(e)));
	} else e === 0 ? i = new Z.default(Math.floor((t - 1) / 2)) : n || (i = new Z.default(Math.floor(e)));
	for (var o = Math.floor((t - 1) / 2), s = [], c = 0; c < t; c++) s.push(i.add(new Z.default(c - o).mul(r)).toNumber());
	return s;
}, Zf = function(e, t, n, r) {
	var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Jf;
	if (!Number.isFinite((t - e) / (n - 1))) return {
		step: new Z.default(0),
		tickMin: new Z.default(0),
		tickMax: new Z.default(0)
	};
	var o = a(new Z.default(t).sub(e).div(n - 1), r, i), s;
	e <= 0 && t >= 0 ? s = new Z.default(0) : (s = new Z.default(e).add(t).div(2), s = s.sub(new Z.default(s).mod(o)));
	var c = Math.ceil(s.sub(e).div(o).toNumber()), l = Math.ceil(new Z.default(t).sub(s).div(o).toNumber()), u = c + l + 1;
	return u > n ? Zf(e, t, n, r, i + 1, a) : (u < n && (l = t > 0 ? l + (n - u) : l, c = t > 0 ? c : c + (n - u)), {
		step: o,
		tickMin: s.sub(new Z.default(c).mul(o)),
		tickMax: s.add(new Z.default(l).mul(o))
	});
}, Qf = function(e) {
	var t = Q(e, 2), n = t[0], r = t[1], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", s = Math.max(i, 2), c = Q(qf([n, r]), 2), l = c[0], u = c[1];
	if (l === -Infinity || u === Infinity) {
		var d = u === Infinity ? [l, ...Array(i - 1).fill(Infinity)] : [...Array(i - 1).fill(-Infinity), u];
		return n > r ? d.reverse() : d;
	}
	if (l === u) return Xf(l, i, a);
	var f = Zf(l, u, s, a, 0, o === "snap125" ? Yf : Jf), p = f.step, m = f.tickMin, h = f.tickMax, g = Vf(m, h.add(new Z.default(.1).mul(p)), p);
	return n > r ? g.reverse() : g;
}, $f = function(e, t) {
	var n = Q(e, 2), r = n[0], i = n[1], a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", s = Q(qf([r, i]), 2), c = s[0], l = s[1];
	if (c === -Infinity || l === Infinity) return [r, i];
	if (c === l) return [c];
	var u = o === "snap125" ? Yf : Jf, d = Math.max(t, 2), f = u(new Z.default(l).sub(c).div(d - 1), a, 0), p = [...Vf(new Z.default(c), new Z.default(l), f), l];
	if (a === !1) {
		p = p.map((e) => Math.round(e));
		var m = p.length - 1;
		m > 0 && p[m] === p[m - 1] && (p = p.slice(0, m));
	}
	return r > i ? p.reverse() : p;
}, ep = (e) => e.rootProps.maxBarSize, tp = (e) => e.rootProps.barGap, np = (e) => e.rootProps.barCategoryGap, rp = (e) => e.rootProps.barSize, ip = (e) => e.rootProps.stackOffset, ap = (e) => e.rootProps.reverseStackOrder, op = (e) => e.options.chartName, sp = (e) => e.rootProps.syncId, cp = (e) => e.rootProps.syncMethod, lp = (e) => e.options.eventEmitter, up = (e) => e.rootProps.baseValue, dp = {
	grid: -100,
	barBackground: -50,
	area: 100,
	cursorRectangle: 200,
	bar: 300,
	line: 400,
	axis: 500,
	scatter: 600,
	activeBar: 1e3,
	cursorLine: 1100,
	activeDot: 1200,
	label: 2e3
}, fp = {
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	allowDataOverflow: !1,
	angle: 0,
	angleAxisId: 0,
	axisLine: !0,
	axisLineType: "polygon",
	cx: 0,
	cy: 0,
	hide: !1,
	includeHidden: !1,
	label: !1,
	niceTicks: "auto",
	orientation: "outer",
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickLine: !0,
	tickSize: 8,
	type: "auto",
	zIndex: dp.axis
}, pp = {
	allowDataOverflow: !1,
	allowDecimals: !1,
	allowDuplicatedCategory: !0,
	angle: 0,
	axisLine: !0,
	includeHidden: !1,
	hide: !1,
	niceTicks: "auto",
	label: !1,
	orientation: "right",
	radiusAxisId: 0,
	reversed: !1,
	scale: "auto",
	stroke: "#ccc",
	tick: !0,
	tickCount: 5,
	tickLine: !0,
	type: "auto",
	zIndex: dp.axis
}, mp = (e, t) => {
	if (e && t) return e != null && e.reversed ? [t[1], t[0]] : t;
};
// analytics/node_modules/recharts/es6/util/getAxisTypeBasedOnLayout.js
function hp(e, t, n) {
	if (n !== "auto") return n;
	if (e != null) return ps(e, t) ? "category" : "number";
}
// analytics/node_modules/recharts/es6/state/selectors/polarAxisSelectors.js
function gp(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function _p(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? gp(Object(n), !0).forEach(function(t) {
			vp(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : gp(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function vp(e, t, n) {
	return (t = yp(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function yp(e) {
	var t = bp(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function bp(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var xp = {
	allowDataOverflow: fp.allowDataOverflow,
	allowDecimals: fp.allowDecimals,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	domain: void 0,
	id: fp.angleAxisId,
	includeHidden: !1,
	name: void 0,
	reversed: fp.reversed,
	scale: fp.scale,
	tick: fp.tick,
	tickCount: void 0,
	ticks: void 0,
	type: fp.type,
	unit: void 0,
	niceTicks: "auto"
}, Sp = {
	allowDataOverflow: pp.allowDataOverflow,
	allowDecimals: pp.allowDecimals,
	allowDuplicatedCategory: pp.allowDuplicatedCategory,
	dataKey: void 0,
	domain: void 0,
	id: pp.radiusAxisId,
	includeHidden: pp.includeHidden,
	name: void 0,
	reversed: pp.reversed,
	scale: pp.scale,
	tick: pp.tick,
	tickCount: pp.tickCount,
	ticks: void 0,
	type: pp.type,
	unit: void 0,
	niceTicks: "auto"
}, Cp = H([(e, t) => {
	if (t != null) return e.polarAxis.angleAxis[t];
}, Uc], (e, t) => {
	if (e != null) return e;
	var n = hp(t, "angleAxis", xp.type) ?? "category";
	return _p(_p({}, xp), {}, { type: n });
}), wp = H([(e, t) => e.polarAxis.radiusAxis[t], Uc], (e, t) => {
	if (e != null) return e;
	var n = hp(t, "radiusAxis", Sp.type) ?? "category";
	return _p(_p({}, Sp), {}, { type: n });
}), Tp = (e) => e.polarOptions, Ep = H([
	Ns,
	Ps,
	Xs
], Zd), Dp = H([Tp, Ep], (e, t) => {
	if (e != null) return Ae(e.innerRadius, t, 0);
}), Op = H([Tp, Ep], (e, t) => {
	if (e != null) return Ae(e.outerRadius, t, t * .8);
}), kp = H([Tp], (e) => e == null ? [0, 0] : [e.startAngle, e.endAngle]);
H([Cp, kp], mp);
var Ap = H([
	Ep,
	Dp,
	Op
], (e, t, n) => {
	if (e != null && t != null && n != null) return [t, n];
});
H([wp, Ap], mp);
var jp = H([
	q,
	Tp,
	Dp,
	Op,
	Ns,
	Ps
], (e, t, n, r, i, a) => {
	if (!(e !== "centric" && e !== "radial" || t == null || n == null || r == null)) {
		var o = t.cx, s = t.cy, c = t.startAngle, l = t.endAngle;
		return {
			cx: Ae(o, i, i / 2),
			cy: Ae(s, a, a / 2),
			innerRadius: n,
			outerRadius: r,
			startAngle: c,
			endAngle: l,
			clockWise: !1
		};
	}
}), Mp = (e, t) => t, Np = (e, t, n) => n;
// analytics/node_modules/recharts/es6/util/stacks/getStackSeriesIdentifier.js
function Pp(e) {
	return e?.id;
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineDisplayedStackedData.js
function Fp(e, t, n) {
	var r = t.chartData, i = r === void 0 ? [] : r, a = n.allowDuplicatedCategory, o = n.dataKey, s = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		var t = e.data ?? i;
		if (t != null && t.length !== 0) {
			var n = Pp(e);
			t.forEach((t, r) => {
				var i = o == null || a ? r : String(ds(t, o, null)), c = ds(t, e.dataKey, 0), l = s.has(i) ? s.get(i) : {};
				Object.assign(l, { [n]: c }), s.set(i, l);
			});
		}
	}), Array.from(s.values());
}
// analytics/node_modules/recharts/es6/state/types/StackedGraphicalItem.js
function Ip(e) {
	return "stackId" in e && e.stackId != null && e.dataKey != null;
}
// analytics/node_modules/recharts/es6/state/selectors/numberDomainEqualityCheck.js
var Lp = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
// analytics/node_modules/recharts/es6/state/selectors/arrayEqualityCheck.js
function Rp(e, t) {
	return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function zp(e, t) {
	if (e.length === t.length) {
		for (var n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
		return !0;
	}
	return !1;
}
// analytics/node_modules/recharts/es6/state/selectors/selectTooltipAxisType.js
var Bp = (e) => {
	var t = q(e);
	return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, Vp = (e) => e.tooltip.settings.axisId;
// analytics/node_modules/recharts/es6/util/scale/RechartsScale.js
function Hp(e) {
	if (e != null) {
		var t = e.ticks, n = e.bandwidth, r = e.range(), i = [Math.min(...r), Math.max(...r)];
		return {
			domain: () => e.domain(),
			range: function(e) {
				function t() {
					return e.apply(this, arguments);
				}
				return t.toString = function() {
					return e.toString();
				}, t;
			}(() => i),
			rangeMin: () => i[0],
			rangeMax: () => i[1],
			isInRange(e) {
				var t = i[0], n = i[1];
				return t <= n ? e >= t && e <= n : e >= n && e <= t;
			},
			bandwidth: n ? () => n.call(e) : void 0,
			ticks: t ? (n) => t.call(e, n) : void 0,
			map: (t, n) => {
				var r = e(t);
				if (r != null) {
					if (e.bandwidth && n != null && n.position) {
						var i = e.bandwidth();
						switch (n.position) {
							case "middle":
								r += i / 2;
								break;
							case "end": r += i;
						}
					}
					return r;
				}
			}
		};
	}
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineCheckedDomain.js
var Up = (e, t) => {
	if (t != null) switch (e) {
		case "linear":
			if (!If(t)) {
				for (var n, r, i = 0; i < t.length; i++) {
					var a = t[i];
					K(a) && ((n === void 0 || a < n) && (n = a), (r === void 0 || a > r) && (r = a));
				}
				return n !== void 0 && r !== void 0 ? [n, r] : void 0;
			}
			return t;
		default: return t;
	}
};
// analytics/node_modules/d3-array/src/ascending.js
function Wp(e, t) {
	return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
// analytics/node_modules/d3-array/src/descending.js
function Gp(e, t) {
	return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
// analytics/node_modules/d3-array/src/bisector.js
function Kp(e) {
	let t, n, r;
	e.length === 2 ? (t = e === Wp || e === Gp ? e : qp, n = e, r = e) : (t = Wp, n = (t, n) => Wp(e(t), n), r = (t, n) => e(t) - n);
	function i(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) < 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function a(e, r, i = 0, a = e.length) {
		if (i < a) {
			if (t(r, r) !== 0) return a;
			do {
				let t = i + a >>> 1;
				n(e[t], r) <= 0 ? i = t + 1 : a = t;
			} while (i < a);
		}
		return i;
	}
	function o(e, t, n = 0, a = e.length) {
		let o = i(e, t, n, a - 1);
		return o > n && r(e[o - 1], t) > -r(e[o], t) ? o - 1 : o;
	}
	return {
		left: i,
		center: o,
		right: a
	};
}
function qp() {
	return 0;
}
// analytics/node_modules/d3-array/src/number.js
function Jp(e) {
	return e === null ? NaN : +e;
}
function* Yp(e, t) {
	if (t === void 0) for (let t of e) t != null && (t = +t) >= t && (yield t);
	else {
		let n = -1;
		for (let r of e) (r = t(r, ++n, e)) != null && (r = +r) >= r && (yield r);
	}
}
// analytics/node_modules/d3-array/src/bisect.js
var Xp = Kp(Wp), Zp = Xp.right;
Xp.left, Kp(Jp).center;
// analytics/node_modules/internmap/src/index.js
var Qp = class extends Map {
	constructor(e, t = nm) {
		if (super(), Object.defineProperties(this, {
			_intern: { value: /* @__PURE__ */ new Map() },
			_key: { value: t }
		}), e != null) for (let [t, n] of e) this.set(t, n);
	}
	get(e) {
		return super.get($p(this, e));
	}
	has(e) {
		return super.has($p(this, e));
	}
	set(e, t) {
		return super.set(em(this, e), t);
	}
	delete(e) {
		return super.delete(tm(this, e));
	}
};
function $p({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : n;
}
function em({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function tm({ _intern: e, _key: t }, n) {
	let r = t(n);
	return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function nm(e) {
	return typeof e == "object" && e ? e.valueOf() : e;
}
// analytics/node_modules/d3-array/src/sort.js
function rm(e = Wp) {
	if (e === Wp) return im;
	if (typeof e != "function") throw TypeError("compare is not a function");
	return (t, n) => {
		let r = e(t, n);
		return r || r === 0 ? r : (e(n, n) === 0) - (e(t, t) === 0);
	};
}
function im(e, t) {
	return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : +(e > t));
}
// analytics/node_modules/d3-array/src/ticks.js
var am = Math.sqrt(50), om = Math.sqrt(10), sm = Math.sqrt(2);
function cm(e, t, n) {
	let r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), a = r / 10 ** i, o = a >= am ? 10 : a >= om ? 5 : a >= sm ? 2 : 1, s, c, l;
	return i < 0 ? (l = 10 ** -i / o, s = Math.round(e * l), c = Math.round(t * l), s / l < e && ++s, c / l > t && --c, l = -l) : (l = 10 ** i * o, s = Math.round(e / l), c = Math.round(t / l), s * l < e && ++s, c * l > t && --c), c < s && .5 <= n && n < 2 ? cm(e, t, n * 2) : [
		s,
		c,
		l
	];
}
function lm(e, t, n) {
	if (t = +t, e = +e, n = +n, !(n > 0)) return [];
	if (e === t) return [e];
	let r = t < e, [i, a, o] = r ? cm(t, e, n) : cm(e, t, n);
	if (!(a >= i)) return [];
	let s = a - i + 1, c = Array(s);
	if (r) {
		if (o < 0) for (let e = 0; e < s; ++e) c[e] = (a - e) / -o;
		else for (let e = 0; e < s; ++e) c[e] = (a - e) * o;
	} else if (o < 0) for (let e = 0; e < s; ++e) c[e] = (i + e) / -o;
	else for (let e = 0; e < s; ++e) c[e] = (i + e) * o;
	return c;
}
function um(e, t, n) {
	return t = +t, e = +e, n = +n, cm(e, t, n)[2];
}
function dm(e, t, n) {
	t = +t, e = +e, n = +n;
	let r = t < e, i = r ? um(t, e, n) : um(e, t, n);
	return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
// analytics/node_modules/d3-array/src/max.js
function fm(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n < t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n < i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
// analytics/node_modules/d3-array/src/min.js
function pm(e, t) {
	let n;
	if (t === void 0) for (let t of e) t != null && (n > t || n === void 0 && t >= t) && (n = t);
	else {
		let r = -1;
		for (let i of e) (i = t(i, ++r, e)) != null && (n > i || n === void 0 && i >= i) && (n = i);
	}
	return n;
}
// analytics/node_modules/d3-array/src/quickselect.js
function mm(e, t, n = 0, r = Infinity, i) {
	if (t = Math.floor(t), n = Math.floor(Math.max(0, n)), r = Math.floor(Math.min(e.length - 1, r)), !(n <= t && t <= r)) return e;
	for (i = i === void 0 ? im : rm(i); r > n;) {
		if (r - n > 600) {
			let a = r - n + 1, o = t - n + 1, s = Math.log(a), c = .5 * Math.exp(2 * s / 3), l = .5 * Math.sqrt(s * c * (a - c) / a) * (o - a / 2 < 0 ? -1 : 1), u = Math.max(n, Math.floor(t - o * c / a + l)), d = Math.min(r, Math.floor(t + (a - o) * c / a + l));
			mm(e, t, u, d, i);
		}
		let a = e[t], o = n, s = r;
		for (hm(e, n, t), i(e[r], a) > 0 && hm(e, n, r); o < s;) {
			for (hm(e, o, s), ++o, --s; i(e[o], a) < 0;) ++o;
			for (; i(e[s], a) > 0;) --s;
		}
		i(e[n], a) === 0 ? hm(e, n, s) : (++s, hm(e, s, r)), s <= t && (n = s + 1), t <= s && (r = s - 1);
	}
	return e;
}
function hm(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
// analytics/node_modules/d3-array/src/quantile.js
function gm(e, t, n) {
	if (e = Float64Array.from(Yp(e, n)), (r = e.length) && !isNaN(t = +t)) {
		if (t <= 0 || r < 2) return pm(e);
		if (t >= 1) return fm(e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = fm(mm(e, a).subarray(0, a + 1));
		return o + (pm(e.subarray(a + 1)) - o) * (i - a);
	}
}
function _m(e, t, n = Jp) {
	if ((r = e.length) && !isNaN(t = +t)) {
		if (t <= 0 || r < 2) return +n(e[0], 0, e);
		if (t >= 1) return +n(e[r - 1], r - 1, e);
		var r, i = (r - 1) * t, a = Math.floor(i), o = +n(e[a], a, e);
		return o + (+n(e[a + 1], a + 1, e) - o) * (i - a);
	}
}
// analytics/node_modules/d3-array/src/range.js
function vm(e, t, n) {
	e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n;
	for (var r = -1, i = Math.max(0, Math.ceil((t - e) / n)) | 0, a = Array(i); ++r < i;) a[r] = e + r * n;
	return a;
}
// analytics/node_modules/d3-scale/src/init.js
function ym(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			this.range(e);
			break;
		default: this.range(t).domain(e);
	}
	return this;
}
function bm(e, t) {
	switch (arguments.length) {
		case 0: break;
		case 1:
			typeof e == "function" ? this.interpolator(e) : this.range(e);
			break;
		default: this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
	}
	return this;
}
// analytics/node_modules/d3-scale/src/ordinal.js
var xm = Symbol("implicit");
function Sm() {
	var e = new Qp(), t = [], n = [], r = xm;
	function i(i) {
		let a = e.get(i);
		if (a === void 0) {
			if (r !== xm) return r;
			e.set(i, a = t.push(i) - 1);
		}
		return n[a % n.length];
	}
	return i.domain = function(n) {
		if (!arguments.length) return t.slice();
		t = [], e = new Qp();
		for (let r of n) e.has(r) || e.set(r, t.push(r) - 1);
		return i;
	}, i.range = function(e) {
		return arguments.length ? (n = Array.from(e), i) : n.slice();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return Sm(t, n).unknown(r);
	}, ym.apply(i, arguments), i;
}
// analytics/node_modules/d3-scale/src/band.js
function Cm() {
	var e = Sm().unknown(void 0), t = e.domain, n = e.range, r = 0, i = 1, a, o, s = !1, c = 0, l = 0, u = .5;
	delete e.unknown;
	function d() {
		var e = t().length, d = i < r, f = d ? i : r, p = d ? r : i;
		a = (p - f) / Math.max(1, e - c + l * 2), s && (a = Math.floor(a)), f += (p - f - a * (e - c)) * u, o = a * (1 - c), s && (f = Math.round(f), o = Math.round(o));
		var m = vm(e).map(function(e) {
			return f + a * e;
		});
		return n(d ? m.reverse() : m);
	}
	return e.domain = function(e) {
		return arguments.length ? (t(e), d()) : t();
	}, e.range = function(e) {
		return arguments.length ? ([r, i] = e, r = +r, i = +i, d()) : [r, i];
	}, e.rangeRound = function(e) {
		return [r, i] = e, r = +r, i = +i, s = !0, d();
	}, e.bandwidth = function() {
		return o;
	}, e.step = function() {
		return a;
	}, e.round = function(e) {
		return arguments.length ? (s = !!e, d()) : s;
	}, e.padding = function(e) {
		return arguments.length ? (c = Math.min(1, l = +e), d()) : c;
	}, e.paddingInner = function(e) {
		return arguments.length ? (c = Math.min(1, e), d()) : c;
	}, e.paddingOuter = function(e) {
		return arguments.length ? (l = +e, d()) : l;
	}, e.align = function(e) {
		return arguments.length ? (u = Math.max(0, Math.min(1, e)), d()) : u;
	}, e.copy = function() {
		return Cm(t(), [r, i]).round(s).paddingInner(c).paddingOuter(l).align(u);
	}, ym.apply(d(), arguments);
}
function wm(e) {
	var t = e.copy;
	return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
		return wm(t());
	}, e;
}
function Tm() {
	return wm(Cm.apply(null, arguments).paddingInner(1));
}
// analytics/node_modules/d3-color/src/define.js
function Em(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function Dm(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
// analytics/node_modules/d3-color/src/color.js
function Om() {}
var km = .7, Am = 1 / km, jm = "\\s*([+-]?\\d+)\\s*", Mm = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Nm = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Pm = /^#([0-9a-f]{3,8})$/, Fm = RegExp(`^rgb\\(${jm},${jm},${jm}\\)$`), Im = RegExp(`^rgb\\(${Nm},${Nm},${Nm}\\)$`), Lm = RegExp(`^rgba\\(${jm},${jm},${jm},${Mm}\\)$`), Rm = RegExp(`^rgba\\(${Nm},${Nm},${Nm},${Mm}\\)$`), zm = RegExp(`^hsl\\(${Mm},${Nm},${Nm}\\)$`), Bm = RegExp(`^hsla\\(${Mm},${Nm},${Nm},${Mm}\\)$`), Vm = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
Em(Om, Km, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: Hm,
	formatHex: Hm,
	formatHex8: Um,
	formatHsl: Wm,
	formatRgb: Gm,
	toString: Gm
});
function Hm() {
	return this.rgb().formatHex();
}
function Um() {
	return this.rgb().formatHex8();
}
function Wm() {
	return ah(this).formatHsl();
}
function Gm() {
	return this.rgb().formatRgb();
}
function Km(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = Pm.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? qm(t) : n === 3 ? new Zm(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Jm(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Jm(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Fm.exec(e)) ? new Zm(t[1], t[2], t[3], 1) : (t = Im.exec(e)) ? new Zm(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Lm.exec(e)) ? Jm(t[1], t[2], t[3], t[4]) : (t = Rm.exec(e)) ? Jm(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = zm.exec(e)) ? ih(t[1], t[2] / 100, t[3] / 100, 1) : (t = Bm.exec(e)) ? ih(t[1], t[2] / 100, t[3] / 100, t[4]) : Vm.hasOwnProperty(e) ? qm(Vm[e]) : e === "transparent" ? new Zm(NaN, NaN, NaN, 0) : null;
}
function qm(e) {
	return new Zm(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Jm(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new Zm(e, t, n, r);
}
function Ym(e) {
	return e instanceof Om || (e = Km(e)), e ? (e = e.rgb(), new Zm(e.r, e.g, e.b, e.opacity)) : new Zm();
}
function Xm(e, t, n, r) {
	return arguments.length === 1 ? Ym(e) : new Zm(e, t, n, r ?? 1);
}
function Zm(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Em(Zm, Xm, Dm(Om, {
	brighter(e) {
		return e = e == null ? Am : Am ** +e, new Zm(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? km : km ** +e, new Zm(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Zm(nh(this.r), nh(this.g), nh(this.b), th(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Qm,
	formatHex: Qm,
	formatHex8: $m,
	formatRgb: eh,
	toString: eh
}));
function Qm() {
	return `#${rh(this.r)}${rh(this.g)}${rh(this.b)}`;
}
function $m() {
	return `#${rh(this.r)}${rh(this.g)}${rh(this.b)}${rh((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function eh() {
	let e = th(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${nh(this.r)}, ${nh(this.g)}, ${nh(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function th(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function nh(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function rh(e) {
	return e = nh(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ih(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new sh(e, t, n, r);
}
function ah(e) {
	if (e instanceof sh) return new sh(e.h, e.s, e.l, e.opacity);
	if (e instanceof Om || (e = Km(e)), !e) return new sh();
	if (e instanceof sh) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new sh(o, s, c, e.opacity);
}
function oh(e, t, n, r) {
	return arguments.length === 1 ? ah(e) : new sh(e, t, n, r ?? 1);
}
function sh(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Em(sh, oh, Dm(Om, {
	brighter(e) {
		return e = e == null ? Am : Am ** +e, new sh(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? km : km ** +e, new sh(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new Zm(uh(e >= 240 ? e - 240 : e + 120, i, r), uh(e, i, r), uh(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new sh(ch(this.h), lh(this.s), lh(this.l), th(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = th(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${ch(this.h)}, ${lh(this.s) * 100}%, ${lh(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function ch(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function lh(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function uh(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
// analytics/node_modules/d3-interpolate/src/constant.js
var dh = (e) => () => e;
// analytics/node_modules/d3-interpolate/src/color.js
function fh(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function ph(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function mh(e) {
	return (e = +e) == 1 ? hh : function(t, n) {
		return n - t ? ph(t, n, e) : dh(isNaN(t) ? n : t);
	};
}
function hh(e, t) {
	var n = t - e;
	return n ? fh(e, n) : dh(isNaN(e) ? t : e);
}
// analytics/node_modules/d3-interpolate/src/rgb.js
var gh = (function e(t) {
	var n = mh(t);
	function r(e, t) {
		var r = n((e = Xm(e)).r, (t = Xm(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = hh(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
// analytics/node_modules/d3-interpolate/src/numberArray.js
function _h(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function vh(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
// analytics/node_modules/d3-interpolate/src/array.js
function yh(e, t) {
	for (var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o = 0; o < r; ++o) i[o] = Oh(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
// analytics/node_modules/d3-interpolate/src/date.js
function bh(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
// analytics/node_modules/d3-interpolate/src/number.js
function xh(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
// analytics/node_modules/d3-interpolate/src/object.js
function Sh(e, t) {
	var n = {}, r = {}, i;
	for (i in typeof e == "object" && e || (e = {}), typeof t == "object" && t || (t = {}), t) i in e ? n[i] = Oh(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
// analytics/node_modules/d3-interpolate/src/string.js
var Ch = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, wh = new RegExp(Ch.source, "g");
function Th(e) {
	return function() {
		return e;
	};
}
function Eh(e) {
	return function(t) {
		return e(t) + "";
	};
}
function Dh(e, t) {
	var n = Ch.lastIndex = wh.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = Ch.exec(e)) && (i = wh.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: xh(r, i)
	})), n = wh.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? Eh(c[0].x) : Th(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
// analytics/node_modules/d3-interpolate/src/value.js
function Oh(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? dh(t) : (n === "number" ? xh : n === "string" ? (r = Km(t)) ? (t = r, gh) : Dh : t instanceof Km ? gh : t instanceof Date ? bh : vh(t) ? _h : Array.isArray(t) ? yh : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Sh : xh)(e, t);
}
// analytics/node_modules/d3-interpolate/src/round.js
function kh(e, t) {
	return e = +e, t = +t, function(n) {
		return Math.round(e * (1 - n) + t * n);
	};
}
// analytics/node_modules/d3-interpolate/src/piecewise.js
function Ah(e, t) {
	t === void 0 && (t = e, e = Oh);
	for (var n = 0, r = t.length - 1, i = t[0], a = Array(r < 0 ? 0 : r); n < r;) a[n] = e(i, i = t[++n]);
	return function(e) {
		var t = Math.max(0, Math.min(r - 1, Math.floor(e *= r)));
		return a[t](e - t);
	};
}
// analytics/node_modules/d3-scale/src/constant.js
function jh(e) {
	return function() {
		return e;
	};
}
// analytics/node_modules/d3-scale/src/number.js
function Mh(e) {
	return +e;
}
// analytics/node_modules/d3-scale/src/continuous.js
var Nh = [0, 1];
function Ph(e) {
	return e;
}
function Fh(e, t) {
	return (t -= e = +e) ? function(n) {
		return (n - e) / t;
	} : jh(isNaN(t) ? NaN : .5);
}
function Ih(e, t) {
	var n;
	return e > t && (n = e, e = t, t = n), function(n) {
		return Math.max(e, Math.min(t, n));
	};
}
function Lh(e, t, n) {
	var r = e[0], i = e[1], a = t[0], o = t[1];
	return i < r ? (r = Fh(i, r), a = n(o, a)) : (r = Fh(r, i), a = n(a, o)), function(e) {
		return a(r(e));
	};
}
function Rh(e, t, n) {
	var r = Math.min(e.length, t.length) - 1, i = Array(r), a = Array(r), o = -1;
	for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < r;) i[o] = Fh(e[o], e[o + 1]), a[o] = n(t[o], t[o + 1]);
	return function(t) {
		var n = Zp(e, t, 1, r) - 1;
		return a[n](i[n](t));
	};
}
function zh(e, t) {
	return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function Bh() {
	var e = Nh, t = Nh, n = Oh, r, i, a, o = Ph, s, c, l;
	function u() {
		var n = Math.min(e.length, t.length);
		return o !== Ph && (o = Ih(e[0], e[n - 1])), s = n > 2 ? Rh : Lh, c = l = null, d;
	}
	function d(i) {
		return i == null || isNaN(i = +i) ? a : (c ||= s(e.map(r), t, n))(r(o(i)));
	}
	return d.invert = function(n) {
		return o(i((l ||= s(t, e.map(r), xh))(n)));
	}, d.domain = function(t) {
		return arguments.length ? (e = Array.from(t, Mh), u()) : e.slice();
	}, d.range = function(e) {
		return arguments.length ? (t = Array.from(e), u()) : t.slice();
	}, d.rangeRound = function(e) {
		return t = Array.from(e), n = kh, u();
	}, d.clamp = function(e) {
		return arguments.length ? (o = e ? !0 : Ph, u()) : o !== Ph;
	}, d.interpolate = function(e) {
		return arguments.length ? (n = e, u()) : n;
	}, d.unknown = function(e) {
		return arguments.length ? (a = e, d) : a;
	}, function(e, t) {
		return r = e, i = t, u();
	};
}
function Vh() {
	return Bh()(Ph, Ph);
}
// analytics/node_modules/d3-format/src/formatDecimal.js
function Hh(e) {
	return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Uh(e, t) {
	if (!isFinite(e) || e === 0) return null;
	var n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), r = e.slice(0, n);
	return [r.length > 1 ? r[0] + r.slice(2) : r, +e.slice(n + 1)];
}
// analytics/node_modules/d3-format/src/exponent.js
function Wh(e) {
	return e = Uh(Math.abs(e)), e ? e[1] : NaN;
}
// analytics/node_modules/d3-format/src/formatGroup.js
function Gh(e, t) {
	return function(n, r) {
		for (var i = n.length, a = [], o = 0, s = e[0], c = 0; i > 0 && s > 0 && (c + s + 1 > r && (s = Math.max(1, r - c)), a.push(n.substring(i -= s, i + s)), !((c += s + 1) > r));) s = e[o = (o + 1) % e.length];
		return a.reverse().join(t);
	};
}
// analytics/node_modules/d3-format/src/formatNumerals.js
function Kh(e) {
	return function(t) {
		return t.replace(/[0-9]/g, function(t) {
			return e[+t];
		});
	};
}
// analytics/node_modules/d3-format/src/formatSpecifier.js
var qh = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Jh(e) {
	if (!(t = qh.exec(e))) throw Error("invalid format: " + e);
	var t;
	return new Yh({
		fill: t[1],
		align: t[2],
		sign: t[3],
		symbol: t[4],
		zero: t[5],
		width: t[6],
		comma: t[7],
		precision: t[8] && t[8].slice(1),
		trim: t[9],
		type: t[10]
	});
}
Jh.prototype = Yh.prototype;
function Yh(e) {
	this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Yh.prototype.toString = function() {
	return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
// analytics/node_modules/d3-format/src/formatTrim.js
function Xh(e) {
	out: for (var t = e.length, n = 1, r = -1, i; n < t; ++n) switch (e[n]) {
		case ".":
			r = i = n;
			break;
		case "0":
			r === 0 && (r = n), i = n;
			break;
		default:
			if (!+e[n]) break out;
			r > 0 && (r = 0);
	}
	return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
// analytics/node_modules/d3-format/src/formatPrefixAuto.js
var Zh;
function Qh(e, t) {
	var n = Uh(e, t);
	if (!n) return Zh = void 0, e.toPrecision(t);
	var r = n[0], i = n[1], a = i - (Zh = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = r.length;
	return a === o ? r : a > o ? r + Array(a - o + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + Array(1 - a).join("0") + Uh(e, Math.max(0, t + a - 1))[0];
}
// analytics/node_modules/d3-format/src/formatRounded.js
function $h(e, t) {
	var n = Uh(e, t);
	if (!n) return e + "";
	var r = n[0], i = n[1];
	return i < 0 ? "0." + Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + Array(i - r.length + 2).join("0");
}
// analytics/node_modules/d3-format/src/formatTypes.js
var eg = {
	"%": (e, t) => (e * 100).toFixed(t),
	b: (e) => Math.round(e).toString(2),
	c: (e) => e + "",
	d: Hh,
	e: (e, t) => e.toExponential(t),
	f: (e, t) => e.toFixed(t),
	g: (e, t) => e.toPrecision(t),
	o: (e) => Math.round(e).toString(8),
	p: (e, t) => $h(e * 100, t),
	r: $h,
	s: Qh,
	X: (e) => Math.round(e).toString(16).toUpperCase(),
	x: (e) => Math.round(e).toString(16)
};
// analytics/node_modules/d3-format/src/identity.js
function tg(e) {
	return e;
}
// analytics/node_modules/d3-format/src/locale.js
var ng = Array.prototype.map, rg = [
	"y",
	"z",
	"a",
	"f",
	"p",
	"n",
	"µ",
	"m",
	"",
	"k",
	"M",
	"G",
	"T",
	"P",
	"E",
	"Z",
	"Y"
];
function ig(e) {
	var t = e.grouping === void 0 || e.thousands === void 0 ? tg : Gh(ng.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? tg : Kh(ng.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", s = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
	function l(e, l) {
		e = Jh(e);
		var u = e.fill, d = e.align, f = e.sign, p = e.symbol, m = e.zero, h = e.width, g = e.comma, _ = e.precision, v = e.trim, y = e.type;
		y === "n" ? (g = !0, y = "g") : eg[y] || (_ === void 0 && (_ = 12), v = !0, y = "g"), (m || u === "0" && d === "=") && (m = !0, u = "0", d = "=");
		var b = (l && l.prefix !== void 0 ? l.prefix : "") + (p === "$" ? n : p === "#" && /[boxX]/.test(y) ? "0" + y.toLowerCase() : ""), x = (p === "$" ? r : /[%p]/.test(y) ? o : "") + (l && l.suffix !== void 0 ? l.suffix : ""), S = eg[y], C = /[defgprs%]/.test(y);
		_ = _ === void 0 ? 6 : /[gprs]/.test(y) ? Math.max(1, Math.min(21, _)) : Math.max(0, Math.min(20, _));
		function w(e) {
			var n = b, r = x, o, l, p;
			if (y === "c") r = S(e) + r, e = "";
			else {
				e = +e;
				var w = e < 0 || 1 / e < 0;
				if (e = isNaN(e) ? c : S(Math.abs(e), _), v && (e = Xh(e)), w && +e == 0 && f !== "+" && (w = !1), n = (w ? f === "(" ? f : s : f === "-" || f === "(" ? "" : f) + n, r = (y === "s" && !isNaN(e) && Zh !== void 0 ? rg[8 + Zh / 3] : "") + r + (w && f === "(" ? ")" : ""), C) {
					for (o = -1, l = e.length; ++o < l;) if (p = e.charCodeAt(o), 48 > p || p > 57) {
						r = (p === 46 ? i + e.slice(o + 1) : e.slice(o)) + r, e = e.slice(0, o);
						break;
					}
				}
			}
			g && !m && (e = t(e, Infinity));
			var T = n.length + e.length + r.length, E = T < h ? Array(h - T + 1).join(u) : "";
			switch (g && m && (e = t(E + e, E.length ? h - r.length : Infinity), E = ""), d) {
				case "<":
					e = n + e + r + E;
					break;
				case "=":
					e = n + E + e + r;
					break;
				case "^":
					e = E.slice(0, T = E.length >> 1) + n + e + r + E.slice(T);
					break;
				default: e = E + n + e + r;
			}
			return a(e);
		}
		return w.toString = function() {
			return e + "";
		}, w;
	}
	function u(e, t) {
		var n = Math.max(-8, Math.min(8, Math.floor(Wh(t) / 3))) * 3, r = 10 ** -n, i = l((e = Jh(e), e.type = "f", e), { suffix: rg[8 + n / 3] });
		return function(e) {
			return i(r * e);
		};
	}
	return {
		format: l,
		formatPrefix: u
	};
}
// analytics/node_modules/d3-format/src/defaultLocale.js
var ag, og, sg;
cg({
	thousands: ",",
	grouping: [3],
	currency: ["$", ""]
});
function cg(e) {
	return ag = ig(e), og = ag.format, sg = ag.formatPrefix, ag;
}
// analytics/node_modules/d3-format/src/precisionFixed.js
function lg(e) {
	return Math.max(0, -Wh(Math.abs(e)));
}
// analytics/node_modules/d3-format/src/precisionPrefix.js
function ug(e, t) {
	return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Wh(t) / 3))) * 3 - Wh(Math.abs(e)));
}
// analytics/node_modules/d3-format/src/precisionRound.js
function dg(e, t) {
	return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Wh(t) - Wh(e)) + 1;
}
// analytics/node_modules/d3-scale/src/tickFormat.js
function fg(e, t, n, r) {
	var i = dm(e, t, n), a;
	switch (r = Jh(r ?? ",f"), r.type) {
		case "s":
			var o = Math.max(Math.abs(e), Math.abs(t));
			return r.precision == null && !isNaN(a = ug(i, o)) && (r.precision = a), sg(r, o);
		case "":
		case "e":
		case "g":
		case "p":
		case "r":
			r.precision == null && !isNaN(a = dg(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = a - (r.type === "e"));
			break;
		case "f":
		case "%": r.precision == null && !isNaN(a = lg(i)) && (r.precision = a - (r.type === "%") * 2);
	}
	return og(r);
}
// analytics/node_modules/d3-scale/src/linear.js
function pg(e) {
	var t = e.domain;
	return e.ticks = function(e) {
		var n = t();
		return lm(n[0], n[n.length - 1], e ?? 10);
	}, e.tickFormat = function(e, n) {
		var r = t();
		return fg(r[0], r[r.length - 1], e ?? 10, n);
	}, e.nice = function(n) {
		n ??= 10;
		var r = t(), i = 0, a = r.length - 1, o = r[i], s = r[a], c, l, u = 10;
		for (s < o && (l = o, o = s, s = l, l = i, i = a, a = l); u-- > 0;) {
			if (l = um(o, s, n), l === c) return r[i] = o, r[a] = s, t(r);
			if (l > 0) o = Math.floor(o / l) * l, s = Math.ceil(s / l) * l;
			else if (l < 0) o = Math.ceil(o * l) / l, s = Math.floor(s * l) / l;
			else break;
			c = l;
		}
		return e;
	}, e;
}
function mg() {
	var e = Vh();
	return e.copy = function() {
		return zh(e, mg());
	}, ym.apply(e, arguments), pg(e);
}
// analytics/node_modules/d3-scale/src/identity.js
function hg(e) {
	var t;
	function n(e) {
		return e == null || isNaN(e = +e) ? t : e;
	}
	return n.invert = n, n.domain = n.range = function(t) {
		return arguments.length ? (e = Array.from(t, Mh), n) : e.slice();
	}, n.unknown = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.copy = function() {
		return hg(e).unknown(t);
	}, e = arguments.length ? Array.from(e, Mh) : [0, 1], pg(n);
}
// analytics/node_modules/d3-scale/src/nice.js
function gg(e, t) {
	e = e.slice();
	var n = 0, r = e.length - 1, i = e[n], a = e[r], o;
	return a < i && (o = n, n = r, r = o, o = i, i = a, a = o), e[n] = t.floor(i), e[r] = t.ceil(a), e;
}
// analytics/node_modules/d3-scale/src/log.js
function _g(e) {
	return Math.log(e);
}
function vg(e) {
	return Math.exp(e);
}
function yg(e) {
	return -Math.log(-e);
}
function bg(e) {
	return -Math.exp(-e);
}
function xg(e) {
	return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function Sg(e) {
	return e === 10 ? xg : e === Math.E ? Math.exp : (t) => e ** +t;
}
function Cg(e) {
	return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function wg(e) {
	return (t, n) => -e(-t, n);
}
function Tg(e) {
	let t = e(_g, vg), n = t.domain, r = 10, i, a;
	function o() {
		return i = Cg(r), a = Sg(r), n()[0] < 0 ? (i = wg(i), a = wg(a), e(yg, bg)) : e(_g, vg), t;
	}
	return t.base = function(e) {
		return arguments.length ? (r = +e, o()) : r;
	}, t.domain = function(e) {
		return arguments.length ? (n(e), o()) : n();
	}, t.ticks = (e) => {
		let t = n(), o = t[0], s = t[t.length - 1], c = s < o;
		c && ([o, s] = [s, o]);
		let l = i(o), u = i(s), d, f, p = e == null ? 10 : +e, m = [];
		if (!(r % 1) && u - l < p) {
			if (l = Math.floor(l), u = Math.ceil(u), o > 0) {
				for (; l <= u; ++l) for (d = 1; d < r; ++d) if (f = l < 0 ? d / a(-l) : d * a(l), !(f < o)) {
					if (f > s) break;
					m.push(f);
				}
			} else for (; l <= u; ++l) for (d = r - 1; d >= 1; --d) if (f = l > 0 ? d / a(-l) : d * a(l), !(f < o)) {
				if (f > s) break;
				m.push(f);
			}
			m.length * 2 < p && (m = lm(o, s, p));
		} else m = lm(l, u, Math.min(u - l, p)).map(a);
		return c ? m.reverse() : m;
	}, t.tickFormat = (e, n) => {
		if (e ??= 10, n ??= r === 10 ? "s" : ",", typeof n != "function" && (!(r % 1) && (n = Jh(n)).precision == null && (n.trim = !0), n = og(n)), e === Infinity) return n;
		let o = Math.max(1, r * e / t.ticks().length);
		return (e) => {
			let t = e / a(Math.round(i(e)));
			return t * r < r - .5 && (t *= r), t <= o ? n(e) : "";
		};
	}, t.nice = () => n(gg(n(), {
		floor: (e) => a(Math.floor(i(e))),
		ceil: (e) => a(Math.ceil(i(e)))
	})), t;
}
function Eg() {
	let e = Tg(Bh()).domain([1, 10]);
	return e.copy = () => zh(e, Eg()).base(e.base()), ym.apply(e, arguments), e;
}
// analytics/node_modules/d3-scale/src/symlog.js
function Dg(e) {
	return function(t) {
		return Math.sign(t) * Math.log1p(Math.abs(t / e));
	};
}
function Og(e) {
	return function(t) {
		return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
	};
}
function kg(e) {
	var t = 1, n = e(Dg(t), Og(t));
	return n.constant = function(n) {
		return arguments.length ? e(Dg(t = +n), Og(t)) : t;
	}, pg(n);
}
function Ag() {
	var e = kg(Bh());
	return e.copy = function() {
		return zh(e, Ag()).constant(e.constant());
	}, ym.apply(e, arguments);
}
// analytics/node_modules/d3-scale/src/pow.js
function jg(e) {
	return function(t) {
		return t < 0 ? -((-t) ** +e) : t ** +e;
	};
}
function Mg(e) {
	return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function Ng(e) {
	return e < 0 ? -e * e : e * e;
}
function Pg(e) {
	var t = e(Ph, Ph), n = 1;
	function r() {
		return n === 1 ? e(Ph, Ph) : n === .5 ? e(Mg, Ng) : e(jg(n), jg(1 / n));
	}
	return t.exponent = function(e) {
		return arguments.length ? (n = +e, r()) : n;
	}, pg(t);
}
function Fg() {
	var e = Pg(Bh());
	return e.copy = function() {
		return zh(e, Fg()).exponent(e.exponent());
	}, ym.apply(e, arguments), e;
}
function Ig() {
	return Fg.apply(null, arguments).exponent(.5);
}
// analytics/node_modules/d3-scale/src/radial.js
function Lg(e) {
	return Math.sign(e) * e * e;
}
function Rg(e) {
	return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function zg() {
	var e = Vh(), t = [0, 1], n = !1, r;
	function i(t) {
		var i = Rg(e(t));
		return isNaN(i) ? r : n ? Math.round(i) : i;
	}
	return i.invert = function(t) {
		return e.invert(Lg(t));
	}, i.domain = function(t) {
		return arguments.length ? (e.domain(t), i) : e.domain();
	}, i.range = function(n) {
		return arguments.length ? (e.range((t = Array.from(n, Mh)).map(Lg)), i) : t.slice();
	}, i.rangeRound = function(e) {
		return i.range(e).round(!0);
	}, i.round = function(e) {
		return arguments.length ? (n = !!e, i) : n;
	}, i.clamp = function(t) {
		return arguments.length ? (e.clamp(t), i) : e.clamp();
	}, i.unknown = function(e) {
		return arguments.length ? (r = e, i) : r;
	}, i.copy = function() {
		return zg(e.domain(), t).round(n).clamp(e.clamp()).unknown(r);
	}, ym.apply(i, arguments), pg(i);
}
// analytics/node_modules/d3-scale/src/quantile.js
function Bg() {
	var e = [], t = [], n = [], r;
	function i() {
		var r = 0, i = Math.max(1, t.length);
		for (n = Array(i - 1); ++r < i;) n[r - 1] = _m(e, r / i);
		return a;
	}
	function a(e) {
		return e == null || isNaN(e = +e) ? r : t[Zp(n, e)];
	}
	return a.invertExtent = function(r) {
		var i = t.indexOf(r);
		return i < 0 ? [NaN, NaN] : [i > 0 ? n[i - 1] : e[0], i < n.length ? n[i] : e[e.length - 1]];
	}, a.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(Wp), i();
	}, a.range = function(e) {
		return arguments.length ? (t = Array.from(e), i()) : t.slice();
	}, a.unknown = function(e) {
		return arguments.length ? (r = e, a) : r;
	}, a.quantiles = function() {
		return n.slice();
	}, a.copy = function() {
		return Bg().domain(e).range(t).unknown(r);
	}, ym.apply(a, arguments);
}
// analytics/node_modules/d3-scale/src/quantize.js
function Vg() {
	var e = 0, t = 1, n = 1, r = [.5], i = [0, 1], a;
	function o(e) {
		return e != null && e <= e ? i[Zp(r, e, 0, n)] : a;
	}
	function s() {
		var i = -1;
		for (r = Array(n); ++i < n;) r[i] = ((i + 1) * t - (i - n) * e) / (n + 1);
		return o;
	}
	return o.domain = function(n) {
		return arguments.length ? ([e, t] = n, e = +e, t = +t, s()) : [e, t];
	}, o.range = function(e) {
		return arguments.length ? (n = (i = Array.from(e)).length - 1, s()) : i.slice();
	}, o.invertExtent = function(a) {
		var o = i.indexOf(a);
		return o < 0 ? [NaN, NaN] : o < 1 ? [e, r[0]] : o >= n ? [r[n - 1], t] : [r[o - 1], r[o]];
	}, o.unknown = function(e) {
		return arguments.length && (a = e), o;
	}, o.thresholds = function() {
		return r.slice();
	}, o.copy = function() {
		return Vg().domain([e, t]).range(i).unknown(a);
	}, ym.apply(pg(o), arguments);
}
// analytics/node_modules/d3-scale/src/threshold.js
function Hg() {
	var e = [.5], t = [0, 1], n, r = 1;
	function i(i) {
		return i != null && i <= i ? t[Zp(e, i, 0, r)] : n;
	}
	return i.domain = function(n) {
		return arguments.length ? (e = Array.from(n), r = Math.min(e.length, t.length - 1), i) : e.slice();
	}, i.range = function(n) {
		return arguments.length ? (t = Array.from(n), r = Math.min(e.length, t.length - 1), i) : t.slice();
	}, i.invertExtent = function(n) {
		var r = t.indexOf(n);
		return [e[r - 1], e[r]];
	}, i.unknown = function(e) {
		return arguments.length ? (n = e, i) : n;
	}, i.copy = function() {
		return Hg().domain(e).range(t).unknown(n);
	}, ym.apply(i, arguments);
}
// analytics/node_modules/d3-time/src/interval.js
var Ug = /* @__PURE__ */ new Date(), Wg = /* @__PURE__ */ new Date();
function Gg(e, t, n, r) {
	function i(t) {
		return e(t = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+t)), t;
	}
	return i.floor = (t) => (e(t = /* @__PURE__ */ new Date(+t)), t), i.ceil = (n) => (e(n = /* @__PURE__ */ new Date(n - 1)), t(n, 1), e(n), n), i.round = (e) => {
		let t = i(e), n = i.ceil(e);
		return e - t < n - e ? t : n;
	}, i.offset = (e, n) => (t(e = /* @__PURE__ */ new Date(+e), n == null ? 1 : Math.floor(n)), e), i.range = (n, r, a) => {
		let o = [];
		if (n = i.ceil(n), a = a == null ? 1 : Math.floor(a), !(n < r) || !(a > 0)) return o;
		let s;
		do
			o.push(s = /* @__PURE__ */ new Date(+n)), t(n, a), e(n);
		while (s < n && n < r);
		return o;
	}, i.filter = (n) => Gg((t) => {
		if (t >= t) for (; e(t), !n(t);) t.setTime(t - 1);
	}, (e, r) => {
		if (e >= e) {
			if (r < 0) for (; ++r <= 0;) for (; t(e, -1), !n(e););
			else for (; --r >= 0;) for (; t(e, 1), !n(e););
		}
	}), n && (i.count = (t, r) => (Ug.setTime(+t), Wg.setTime(+r), e(Ug), e(Wg), Math.floor(n(Ug, Wg))), i.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? i.filter(r ? (t) => r(t) % e === 0 : (t) => i.count(0, t) % e === 0) : i)), i;
}
// analytics/node_modules/d3-time/src/millisecond.js
var Kg = Gg(() => {}, (e, t) => {
	e.setTime(+e + t);
}, (e, t) => t - e);
Kg.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? Gg((t) => {
	t.setTime(Math.floor(t / e) * e);
}, (t, n) => {
	t.setTime(+t + n * e);
}, (t, n) => (n - t) / e) : Kg), Kg.range;
// analytics/node_modules/d3-time/src/duration.js
var qg = 1e3, Jg = qg * 60, Yg = Jg * 60, Xg = Yg * 24, Zg = Xg * 7, Qg = Xg * 30, $g = Xg * 365, e_ = Gg((e) => {
	e.setTime(e - e.getMilliseconds());
}, (e, t) => {
	e.setTime(+e + t * qg);
}, (e, t) => (t - e) / qg, (e) => e.getUTCSeconds());
e_.range;
// analytics/node_modules/d3-time/src/minute.js
var t_ = Gg((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * qg);
}, (e, t) => {
	e.setTime(+e + t * Jg);
}, (e, t) => (t - e) / Jg, (e) => e.getMinutes());
t_.range;
var n_ = Gg((e) => {
	e.setUTCSeconds(0, 0);
}, (e, t) => {
	e.setTime(+e + t * Jg);
}, (e, t) => (t - e) / Jg, (e) => e.getUTCMinutes());
n_.range;
// analytics/node_modules/d3-time/src/hour.js
var r_ = Gg((e) => {
	e.setTime(e - e.getMilliseconds() - e.getSeconds() * qg - e.getMinutes() * Jg);
}, (e, t) => {
	e.setTime(+e + t * Yg);
}, (e, t) => (t - e) / Yg, (e) => e.getHours());
r_.range;
var i_ = Gg((e) => {
	e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
	e.setTime(+e + t * Yg);
}, (e, t) => (t - e) / Yg, (e) => e.getUTCHours());
i_.range;
// analytics/node_modules/d3-time/src/day.js
var a_ = Gg((e) => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Jg) / Xg, (e) => e.getDate() - 1);
a_.range;
var o_ = Gg((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Xg, (e) => e.getUTCDate() - 1);
o_.range;
var s_ = Gg((e) => {
	e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Xg, (e) => Math.floor(e / Xg));
s_.range;
// analytics/node_modules/d3-time/src/week.js
function c_(e) {
	return Gg((t) => {
		t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setDate(e.getDate() + t * 7);
	}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Jg) / Zg);
}
var l_ = c_(0), u_ = c_(1), d_ = c_(2), f_ = c_(3), p_ = c_(4), m_ = c_(5), h_ = c_(6);
l_.range, u_.range, d_.range, f_.range, p_.range, m_.range, h_.range;
function g_(e) {
	return Gg((t) => {
		t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t * 7);
	}, (e, t) => (t - e) / Zg);
}
var __ = g_(0), v_ = g_(1), y_ = g_(2), b_ = g_(3), x_ = g_(4), S_ = g_(5), C_ = g_(6);
__.range, v_.range, y_.range, b_.range, x_.range, S_.range, C_.range;
// analytics/node_modules/d3-time/src/month.js
var w_ = Gg((e) => {
	e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
w_.range;
var T_ = Gg((e) => {
	e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
T_.range;
// analytics/node_modules/d3-time/src/year.js
var E_ = Gg((e) => {
	e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
	e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
E_.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Gg((t) => {
	t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
	t.setFullYear(t.getFullYear() + n * e);
}), E_.range;
var D_ = Gg((e) => {
	e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
	e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
D_.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Gg((t) => {
	t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
	t.setUTCFullYear(t.getUTCFullYear() + n * e);
}), D_.range;
// analytics/node_modules/d3-time/src/ticks.js
function O_(e, t, n, r, i, a) {
	let o = [
		[
			e_,
			1,
			qg
		],
		[
			e_,
			5,
			5 * qg
		],
		[
			e_,
			15,
			15 * qg
		],
		[
			e_,
			30,
			30 * qg
		],
		[
			a,
			1,
			Jg
		],
		[
			a,
			5,
			5 * Jg
		],
		[
			a,
			15,
			15 * Jg
		],
		[
			a,
			30,
			30 * Jg
		],
		[
			i,
			1,
			Yg
		],
		[
			i,
			3,
			3 * Yg
		],
		[
			i,
			6,
			6 * Yg
		],
		[
			i,
			12,
			12 * Yg
		],
		[
			r,
			1,
			Xg
		],
		[
			r,
			2,
			2 * Xg
		],
		[
			n,
			1,
			Zg
		],
		[
			t,
			1,
			Qg
		],
		[
			t,
			3,
			3 * Qg
		],
		[
			e,
			1,
			$g
		]
	];
	function s(e, t, n) {
		let r = t < e;
		r && ([e, t] = [t, e]);
		let i = n && typeof n.range == "function" ? n : c(e, t, n), a = i ? i.range(e, +t + 1) : [];
		return r ? a.reverse() : a;
	}
	function c(t, n, r) {
		let i = Math.abs(n - t) / r, a = Kp(([, , e]) => e).right(o, i);
		if (a === o.length) return e.every(dm(t / $g, n / $g, r));
		if (a === 0) return Kg.every(Math.max(dm(t, n, r), 1));
		let [s, c] = o[i / o[a - 1][2] < o[a][2] / i ? a - 1 : a];
		return s.every(c);
	}
	return [s, c];
}
var [k_, A_] = O_(D_, T_, __, s_, i_, n_), [j_, M_] = O_(E_, w_, l_, a_, r_, t_);
// analytics/node_modules/d3-time-format/src/locale.js
function N_(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
		return t.setFullYear(e.y), t;
	}
	return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function P_(e) {
	if (0 <= e.y && e.y < 100) {
		var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
		return t.setUTCFullYear(e.y), t;
	}
	return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function F_(e, t, n) {
	return {
		y: e,
		m: t,
		d: n,
		H: 0,
		M: 0,
		S: 0,
		L: 0
	};
}
function I_(e) {
	var t = e.dateTime, n = e.date, r = e.time, i = e.periods, a = e.days, o = e.shortDays, s = e.months, c = e.shortMonths, l = H_(i), u = U_(i), d = H_(a), f = U_(a), p = H_(o), m = U_(o), h = H_(s), g = U_(s), _ = H_(c), v = U_(c), y = {
		a: M,
		A: N,
		b: P,
		B: te,
		c: null,
		d: uv,
		e: uv,
		f: hv,
		g: Ev,
		G: Ov,
		H: dv,
		I: fv,
		j: pv,
		L: mv,
		m: gv,
		M: _v,
		p: ne,
		q: re,
		Q: Zv,
		s: Qv,
		S: vv,
		u: yv,
		U: bv,
		V: Sv,
		w: Cv,
		W: wv,
		x: null,
		X: null,
		y: Tv,
		Y: Dv,
		Z: kv,
		"%": Xv
	}, b = {
		a: ie,
		A: ae,
		b: F,
		B: oe,
		c: null,
		d: Av,
		e: Av,
		f: Fv,
		g: Kv,
		G: Jv,
		H: jv,
		I: Mv,
		j: Nv,
		L: Pv,
		m: Iv,
		M: Lv,
		p: se,
		q: ce,
		Q: Zv,
		s: Qv,
		S: Rv,
		u: zv,
		U: Bv,
		V: Hv,
		w: Uv,
		W: Wv,
		x: null,
		X: null,
		y: Gv,
		Y: qv,
		Z: Yv,
		"%": Xv
	}, x = {
		a: E,
		A: D,
		b: O,
		B: k,
		c: ee,
		d: ev,
		e: ev,
		f: ov,
		g: X_,
		G: Y_,
		H: nv,
		I: nv,
		j: tv,
		L: av,
		m: $_,
		M: rv,
		p: T,
		q: Q_,
		Q: cv,
		s: lv,
		S: iv,
		u: G_,
		U: K_,
		V: q_,
		w: W_,
		W: J_,
		x: A,
		X: j,
		y: X_,
		Y: Y_,
		Z: Z_,
		"%": sv
	};
	y.x = S(n, y), y.X = S(r, y), y.c = S(t, y), b.x = S(n, b), b.X = S(r, b), b.c = S(t, b);
	function S(e, t) {
		return function(n) {
			var r = [], i = -1, a = 0, o = e.length, s, c, l;
			for (n instanceof Date || (n = /* @__PURE__ */ new Date(+n)); ++i < o;) e.charCodeAt(i) === 37 && (r.push(e.slice(a, i)), (c = L_[s = e.charAt(++i)]) == null ? c = s === "e" ? " " : "0" : s = e.charAt(++i), (l = t[s]) && (s = l(n, c)), r.push(s), a = i + 1);
			return r.push(e.slice(a, i)), r.join("");
		};
	}
	function C(e, t) {
		return function(n) {
			var r = F_(1900, void 0, 1), i = w(r, e, n += "", 0), a, o;
			if (i != n.length) return null;
			if ("Q" in r) return new Date(r.Q);
			if ("s" in r) return new Date(r.s * 1e3 + ("L" in r ? r.L : 0));
			if (t && !("Z" in r) && (r.Z = 0), "p" in r && (r.H = r.H % 12 + r.p * 12), r.m === void 0 && (r.m = "q" in r ? r.q : 0), "V" in r) {
				if (r.V < 1 || r.V > 53) return null;
				"w" in r || (r.w = 1), "Z" in r ? (a = P_(F_(r.y, 0, 1)), o = a.getUTCDay(), a = o > 4 || o === 0 ? v_.ceil(a) : v_(a), a = o_.offset(a, (r.V - 1) * 7), r.y = a.getUTCFullYear(), r.m = a.getUTCMonth(), r.d = a.getUTCDate() + (r.w + 6) % 7) : (a = N_(F_(r.y, 0, 1)), o = a.getDay(), a = o > 4 || o === 0 ? u_.ceil(a) : u_(a), a = a_.offset(a, (r.V - 1) * 7), r.y = a.getFullYear(), r.m = a.getMonth(), r.d = a.getDate() + (r.w + 6) % 7);
			} else ("W" in r || "U" in r) && ("w" in r || (r.w = "u" in r ? r.u % 7 : +("W" in r)), o = "Z" in r ? P_(F_(r.y, 0, 1)).getUTCDay() : N_(F_(r.y, 0, 1)).getDay(), r.m = 0, r.d = "W" in r ? (r.w + 6) % 7 + r.W * 7 - (o + 5) % 7 : r.w + r.U * 7 - (o + 6) % 7);
			return "Z" in r ? (r.H += r.Z / 100 | 0, r.M += r.Z % 100, P_(r)) : N_(r);
		};
	}
	function w(e, t, n, r) {
		for (var i = 0, a = t.length, o = n.length, s, c; i < a;) {
			if (r >= o) return -1;
			if (s = t.charCodeAt(i++), s === 37) {
				if (s = t.charAt(i++), c = x[s in L_ ? t.charAt(i++) : s], !c || (r = c(e, n, r)) < 0) return -1;
			} else if (s != n.charCodeAt(r++)) return -1;
		}
		return r;
	}
	function T(e, t, n) {
		var r = l.exec(t.slice(n));
		return r ? (e.p = u.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function E(e, t, n) {
		var r = p.exec(t.slice(n));
		return r ? (e.w = m.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function D(e, t, n) {
		var r = d.exec(t.slice(n));
		return r ? (e.w = f.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function O(e, t, n) {
		var r = _.exec(t.slice(n));
		return r ? (e.m = v.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function k(e, t, n) {
		var r = h.exec(t.slice(n));
		return r ? (e.m = g.get(r[0].toLowerCase()), n + r[0].length) : -1;
	}
	function ee(e, n, r) {
		return w(e, t, n, r);
	}
	function A(e, t, r) {
		return w(e, n, t, r);
	}
	function j(e, t, n) {
		return w(e, r, t, n);
	}
	function M(e) {
		return o[e.getDay()];
	}
	function N(e) {
		return a[e.getDay()];
	}
	function P(e) {
		return c[e.getMonth()];
	}
	function te(e) {
		return s[e.getMonth()];
	}
	function ne(e) {
		return i[+(e.getHours() >= 12)];
	}
	function re(e) {
		return 1 + ~~(e.getMonth() / 3);
	}
	function ie(e) {
		return o[e.getUTCDay()];
	}
	function ae(e) {
		return a[e.getUTCDay()];
	}
	function F(e) {
		return c[e.getUTCMonth()];
	}
	function oe(e) {
		return s[e.getUTCMonth()];
	}
	function se(e) {
		return i[+(e.getUTCHours() >= 12)];
	}
	function ce(e) {
		return 1 + ~~(e.getUTCMonth() / 3);
	}
	return {
		format: function(e) {
			var t = S(e += "", y);
			return t.toString = function() {
				return e;
			}, t;
		},
		parse: function(e) {
			var t = C(e += "", !1);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcFormat: function(e) {
			var t = S(e += "", b);
			return t.toString = function() {
				return e;
			}, t;
		},
		utcParse: function(e) {
			var t = C(e += "", !0);
			return t.toString = function() {
				return e;
			}, t;
		}
	};
}
var L_ = {
	"-": "",
	_: " ",
	0: "0"
}, R_ = /^\s*\d+/, z_ = /^%/, B_ = /[\\^$*+?|[\]().{}]/g;
function $(e, t, n) {
	var r = e < 0 ? "-" : "", i = (r ? -e : e) + "", a = i.length;
	return r + (a < n ? Array(n - a + 1).join(t) + i : i);
}
function V_(e) {
	return e.replace(B_, "\\$&");
}
function H_(e) {
	return RegExp("^(?:" + e.map(V_).join("|") + ")", "i");
}
function U_(e) {
	return new Map(e.map((e, t) => [e.toLowerCase(), t]));
}
function W_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 1));
	return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function G_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 1));
	return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function K_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function q_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function J_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function Y_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 4));
	return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function X_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function Z_(e, t, n) {
	var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
	return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function Q_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 1));
	return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function $_(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function ev(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function tv(e, t, n) {
	var r = R_.exec(t.slice(n, n + 3));
	return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function nv(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function rv(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function iv(e, t, n) {
	var r = R_.exec(t.slice(n, n + 2));
	return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function av(e, t, n) {
	var r = R_.exec(t.slice(n, n + 3));
	return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function ov(e, t, n) {
	var r = R_.exec(t.slice(n, n + 6));
	return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function sv(e, t, n) {
	var r = z_.exec(t.slice(n, n + 1));
	return r ? n + r[0].length : -1;
}
function cv(e, t, n) {
	var r = R_.exec(t.slice(n));
	return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function lv(e, t, n) {
	var r = R_.exec(t.slice(n));
	return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function uv(e, t) {
	return $(e.getDate(), t, 2);
}
function dv(e, t) {
	return $(e.getHours(), t, 2);
}
function fv(e, t) {
	return $(e.getHours() % 12 || 12, t, 2);
}
function pv(e, t) {
	return $(1 + a_.count(E_(e), e), t, 3);
}
function mv(e, t) {
	return $(e.getMilliseconds(), t, 3);
}
function hv(e, t) {
	return mv(e, t) + "000";
}
function gv(e, t) {
	return $(e.getMonth() + 1, t, 2);
}
function _v(e, t) {
	return $(e.getMinutes(), t, 2);
}
function vv(e, t) {
	return $(e.getSeconds(), t, 2);
}
function yv(e) {
	var t = e.getDay();
	return t === 0 ? 7 : t;
}
function bv(e, t) {
	return $(l_.count(E_(e) - 1, e), t, 2);
}
function xv(e) {
	var t = e.getDay();
	return t >= 4 || t === 0 ? p_(e) : p_.ceil(e);
}
function Sv(e, t) {
	return e = xv(e), $(p_.count(E_(e), e) + (E_(e).getDay() === 4), t, 2);
}
function Cv(e) {
	return e.getDay();
}
function wv(e, t) {
	return $(u_.count(E_(e) - 1, e), t, 2);
}
function Tv(e, t) {
	return $(e.getFullYear() % 100, t, 2);
}
function Ev(e, t) {
	return e = xv(e), $(e.getFullYear() % 100, t, 2);
}
function Dv(e, t) {
	return $(e.getFullYear() % 1e4, t, 4);
}
function Ov(e, t) {
	var n = e.getDay();
	return e = n >= 4 || n === 0 ? p_(e) : p_.ceil(e), $(e.getFullYear() % 1e4, t, 4);
}
function kv(e) {
	var t = e.getTimezoneOffset();
	return (t > 0 ? "-" : (t *= -1, "+")) + $(t / 60 | 0, "0", 2) + $(t % 60, "0", 2);
}
function Av(e, t) {
	return $(e.getUTCDate(), t, 2);
}
function jv(e, t) {
	return $(e.getUTCHours(), t, 2);
}
function Mv(e, t) {
	return $(e.getUTCHours() % 12 || 12, t, 2);
}
function Nv(e, t) {
	return $(1 + o_.count(D_(e), e), t, 3);
}
function Pv(e, t) {
	return $(e.getUTCMilliseconds(), t, 3);
}
function Fv(e, t) {
	return Pv(e, t) + "000";
}
function Iv(e, t) {
	return $(e.getUTCMonth() + 1, t, 2);
}
function Lv(e, t) {
	return $(e.getUTCMinutes(), t, 2);
}
function Rv(e, t) {
	return $(e.getUTCSeconds(), t, 2);
}
function zv(e) {
	var t = e.getUTCDay();
	return t === 0 ? 7 : t;
}
function Bv(e, t) {
	return $(__.count(D_(e) - 1, e), t, 2);
}
function Vv(e) {
	var t = e.getUTCDay();
	return t >= 4 || t === 0 ? x_(e) : x_.ceil(e);
}
function Hv(e, t) {
	return e = Vv(e), $(x_.count(D_(e), e) + (D_(e).getUTCDay() === 4), t, 2);
}
function Uv(e) {
	return e.getUTCDay();
}
function Wv(e, t) {
	return $(v_.count(D_(e) - 1, e), t, 2);
}
function Gv(e, t) {
	return $(e.getUTCFullYear() % 100, t, 2);
}
function Kv(e, t) {
	return e = Vv(e), $(e.getUTCFullYear() % 100, t, 2);
}
function qv(e, t) {
	return $(e.getUTCFullYear() % 1e4, t, 4);
}
function Jv(e, t) {
	var n = e.getUTCDay();
	return e = n >= 4 || n === 0 ? x_(e) : x_.ceil(e), $(e.getUTCFullYear() % 1e4, t, 4);
}
function Yv() {
	return "+0000";
}
function Xv() {
	return "%";
}
function Zv(e) {
	return +e;
}
function Qv(e) {
	return Math.floor(e / 1e3);
}
// analytics/node_modules/d3-time-format/src/defaultLocale.js
var $v, ey, ty;
ny({
	dateTime: "%x, %X",
	date: "%-m/%-d/%Y",
	time: "%-I:%M:%S %p",
	periods: ["AM", "PM"],
	days: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	shortDays: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],
	shortMonths: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
});
function ny(e) {
	return $v = I_(e), ey = $v.format, $v.parse, ty = $v.utcFormat, $v.utcParse, $v;
}
// analytics/node_modules/d3-scale/src/time.js
function ry(e) {
	return new Date(e);
}
function iy(e) {
	return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function ay(e, t, n, r, i, a, o, s, c, l) {
	var u = Vh(), d = u.invert, f = u.domain, p = l(".%L"), m = l(":%S"), h = l("%I:%M"), g = l("%I %p"), _ = l("%a %d"), v = l("%b %d"), y = l("%B"), b = l("%Y");
	function x(e) {
		return (c(e) < e ? p : s(e) < e ? m : o(e) < e ? h : a(e) < e ? g : r(e) < e ? i(e) < e ? _ : v : n(e) < e ? y : b)(e);
	}
	return u.invert = function(e) {
		return new Date(d(e));
	}, u.domain = function(e) {
		return arguments.length ? f(Array.from(e, iy)) : f().map(ry);
	}, u.ticks = function(t) {
		var n = f();
		return e(n[0], n[n.length - 1], t ?? 10);
	}, u.tickFormat = function(e, t) {
		return t == null ? x : l(t);
	}, u.nice = function(e) {
		var n = f();
		return e && typeof e.range == "function" || (e = t(n[0], n[n.length - 1], e ?? 10)), e ? f(gg(n, e)) : u;
	}, u.copy = function() {
		return zh(u, ay(e, t, n, r, i, a, o, s, c, l));
	}, u;
}
function oy() {
	return ym.apply(ay(j_, M_, E_, w_, l_, a_, r_, t_, e_, ey).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
// analytics/node_modules/d3-scale/src/utcTime.js
function sy() {
	return ym.apply(ay(k_, A_, D_, T_, __, o_, i_, n_, e_, ty).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
// analytics/node_modules/d3-scale/src/sequential.js
function cy() {
	var e = 0, t = 1, n, r, i, a, o = Ph, s = !1, c;
	function l(e) {
		return e == null || isNaN(e = +e) ? c : o(i === 0 ? .5 : (e = (a(e) - n) * i, s ? Math.max(0, Math.min(1, e)) : e));
	}
	l.domain = function(o) {
		return arguments.length ? ([e, t] = o, n = a(e = +e), r = a(t = +t), i = n === r ? 0 : 1 / (r - n), l) : [e, t];
	}, l.clamp = function(e) {
		return arguments.length ? (s = !!e, l) : s;
	}, l.interpolator = function(e) {
		return arguments.length ? (o = e, l) : o;
	};
	function u(e) {
		return function(t) {
			var n, r;
			return arguments.length ? ([n, r] = t, o = e(n, r), l) : [o(0), o(1)];
		};
	}
	return l.range = u(Oh), l.rangeRound = u(kh), l.unknown = function(e) {
		return arguments.length ? (c = e, l) : c;
	}, function(o) {
		return a = o, n = o(e), r = o(t), i = n === r ? 0 : 1 / (r - n), l;
	};
}
function ly(e, t) {
	return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function uy() {
	var e = pg(cy()(Ph));
	return e.copy = function() {
		return ly(e, uy());
	}, bm.apply(e, arguments);
}
function dy() {
	var e = Tg(cy()).domain([1, 10]);
	return e.copy = function() {
		return ly(e, dy()).base(e.base());
	}, bm.apply(e, arguments);
}
function fy() {
	var e = kg(cy());
	return e.copy = function() {
		return ly(e, fy()).constant(e.constant());
	}, bm.apply(e, arguments);
}
function py() {
	var e = Pg(cy());
	return e.copy = function() {
		return ly(e, py()).exponent(e.exponent());
	}, bm.apply(e, arguments);
}
function my() {
	return py.apply(null, arguments).exponent(.5);
}
// analytics/node_modules/d3-scale/src/sequentialQuantile.js
function hy() {
	var e = [], t = Ph;
	function n(n) {
		if (n != null && !isNaN(n = +n)) return t((Zp(e, n, 1) - 1) / (e.length - 1));
	}
	return n.domain = function(t) {
		if (!arguments.length) return e.slice();
		e = [];
		for (let n of t) n != null && !isNaN(n = +n) && e.push(n);
		return e.sort(Wp), n;
	}, n.interpolator = function(e) {
		return arguments.length ? (t = e, n) : t;
	}, n.range = function() {
		return e.map((n, r) => t(r / (e.length - 1)));
	}, n.quantiles = function(t) {
		return Array.from({ length: t + 1 }, (n, r) => gm(e, r / t));
	}, n.copy = function() {
		return hy(t).domain(e);
	}, bm.apply(n, arguments);
}
// analytics/node_modules/d3-scale/src/diverging.js
function gy() {
	var e = 0, t = .5, n = 1, r = 1, i, a, o, s, c, l = Ph, u, d = !1, f;
	function p(e) {
		return isNaN(e = +e) ? f : (e = .5 + ((e = +u(e)) - a) * (r * e < r * a ? s : c), l(d ? Math.max(0, Math.min(1, e)) : e));
	}
	p.domain = function(l) {
		return arguments.length ? ([e, t, n] = l, i = u(e = +e), a = u(t = +t), o = u(n = +n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p) : [
			e,
			t,
			n
		];
	}, p.clamp = function(e) {
		return arguments.length ? (d = !!e, p) : d;
	}, p.interpolator = function(e) {
		return arguments.length ? (l = e, p) : l;
	};
	function m(e) {
		return function(t) {
			var n, r, i;
			return arguments.length ? ([n, r, i] = t, l = Ah(e, [
				n,
				r,
				i
			]), p) : [
				l(0),
				l(.5),
				l(1)
			];
		};
	}
	return p.range = m(Oh), p.rangeRound = m(kh), p.unknown = function(e) {
		return arguments.length ? (f = e, p) : f;
	}, function(l) {
		return u = l, i = l(e), a = l(t), o = l(n), s = i === a ? 0 : .5 / (a - i), c = a === o ? 0 : .5 / (o - a), r = a < i ? -1 : 1, p;
	};
}
function _y() {
	var e = pg(gy()(Ph));
	return e.copy = function() {
		return ly(e, _y());
	}, bm.apply(e, arguments);
}
function vy() {
	var e = Tg(gy()).domain([
		.1,
		1,
		10
	]);
	return e.copy = function() {
		return ly(e, vy()).base(e.base());
	}, bm.apply(e, arguments);
}
function yy() {
	var e = kg(gy());
	return e.copy = function() {
		return ly(e, yy()).constant(e.constant());
	}, bm.apply(e, arguments);
}
function by() {
	var e = Pg(gy());
	return e.copy = function() {
		return ly(e, by()).exponent(e.exponent());
	}, bm.apply(e, arguments);
}
function xy() {
	return by.apply(null, arguments).exponent(.5);
}
// analytics/node_modules/victory-vendor/es/d3-scale.js
var Sy = /* @__PURE__ */ s({
	scaleBand: () => Cm,
	scaleDiverging: () => _y,
	scaleDivergingLog: () => vy,
	scaleDivergingPow: () => by,
	scaleDivergingSqrt: () => xy,
	scaleDivergingSymlog: () => yy,
	scaleIdentity: () => hg,
	scaleImplicit: () => xm,
	scaleLinear: () => mg,
	scaleLog: () => Eg,
	scaleOrdinal: () => Sm,
	scalePoint: () => Tm,
	scalePow: () => Fg,
	scaleQuantile: () => Bg,
	scaleQuantize: () => Vg,
	scaleRadial: () => zg,
	scaleSequential: () => uy,
	scaleSequentialLog: () => dy,
	scaleSequentialPow: () => py,
	scaleSequentialQuantile: () => hy,
	scaleSequentialSqrt: () => my,
	scaleSequentialSymlog: () => fy,
	scaleSqrt: () => Ig,
	scaleSymlog: () => Ag,
	scaleThreshold: () => Hg,
	scaleTime: () => oy,
	scaleUtc: () => sy,
	tickFormat: () => fg
});
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineConfiguredScale.js
function Cy(e) {
	var t = Sy;
	if (e in t && typeof t[e] == "function") return t[e]();
	var n = `scale${Fe(e)}`;
	if (n in t && typeof t[n] == "function") return t[n]();
}
function wy(e, t, n) {
	if (typeof e == "function") return e.copy().domain(t).range(n);
	if (e != null) {
		var r = Cy(e);
		if (r != null) return r.domain(t).range(n), r;
	}
}
function Ty(e, t, n, r) {
	if (n != null && r != null) return typeof e.scale == "function" ? wy(e.scale, n, r) : wy(t, n, r);
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineRealScaleType.js
function Ey(e) {
	return `scale${Fe(e)}`;
}
function Dy(e) {
	return Ey(e) in Sy;
}
var Oy = (e, t, n) => {
	if (e != null) {
		var r = e.scale, i = e.type;
		if (r === "auto") return i === "category" && n && (n.indexOf("LineChart") >= 0 || n.indexOf("AreaChart") >= 0 || n.indexOf("ComposedChart") >= 0 && !t) ? "point" : i === "category" ? "band" : "linear";
		if (typeof r == "string") return Dy(r) ? r : "point";
	}
};
// analytics/node_modules/recharts/es6/util/scale/createCategoricalInverse.js
function ky(e, t) {
	for (var n = 0, r = e.length, i = e[0] < e[e.length - 1]; n < r;) {
		var a = Math.floor((n + r) / 2);
		(i ? e[a] < t : e[a] > t) ? n = a + 1 : r = a;
	}
	return n;
}
function Ay(e, t) {
	if (e) {
		var n = t ?? e.domain(), r = n.map((t) => e(t) ?? 0), i = e.range();
		if (!(n.length === 0 || i.length < 2)) return (e) => {
			var t = ky(r, e);
			if (t <= 0) return n[0];
			if (t >= n.length) return n[n.length - 1];
			var i = r[t - 1] ?? 0, a = r[t] ?? 0;
			return Math.abs(e - i) <= Math.abs(e - a) ? n[t - 1] : n[t];
		};
	}
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineInverseScaleFunction.js
function jy(e) {
	if (e != null) return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : Ay(e, void 0);
}
// analytics/node_modules/recharts/es6/state/selectors/axisSelectors.js
function My(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Ny(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? My(Object(n), !0).forEach(function(t) {
			Py(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : My(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Py(e, t, n) {
	return (t = Fy(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Fy(e) {
	var t = Iy(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Iy(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Ly(e, t) {
	return Hy(e) || Vy(e, t) || zy(e, t) || Ry();
}
function Ry() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function zy(e, t) {
	if (e) {
		if (typeof e == "string") return By(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? By(e, t) : void 0;
	}
}
function By(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Vy(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Hy(e) {
	if (Array.isArray(e)) return e;
}
var Uy = [0, "auto"], Wy = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: void 0,
	height: 30,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "bottom",
	padding: {
		left: 0,
		right: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "category",
	unit: void 0,
	niceTicks: "auto"
}, Gy = (e, t) => e.cartesianAxis.xAxis[t], Ky = (e, t) => Gy(e, t) ?? Wy, qy = {
	allowDataOverflow: !1,
	allowDecimals: !0,
	allowDuplicatedCategory: !0,
	angle: 0,
	dataKey: void 0,
	domain: Uy,
	hide: !0,
	id: 0,
	includeHidden: !1,
	interval: "preserveEnd",
	minTickGap: 5,
	mirror: !1,
	name: void 0,
	orientation: "left",
	padding: {
		top: 0,
		bottom: 0
	},
	reversed: !1,
	scale: "auto",
	tick: !0,
	tickCount: 5,
	tickFormatter: void 0,
	ticks: void 0,
	type: "number",
	unit: void 0,
	niceTicks: "auto",
	width: 60
}, Jy = (e, t) => e.cartesianAxis.yAxis[t], Yy = (e, t) => Jy(e, t) ?? qy, Xy = {
	domain: [0, "auto"],
	includeHidden: !1,
	reversed: !1,
	allowDataOverflow: !1,
	allowDuplicatedCategory: !1,
	dataKey: void 0,
	id: 0,
	name: "",
	range: [64, 64],
	scale: "auto",
	type: "number",
	unit: ""
}, Zy = (e, t) => e.cartesianAxis.zAxis[t] ?? Xy, Qy = (e, t, n) => {
	switch (t) {
		case "xAxis": return Ky(e, n);
		case "yAxis": return Yy(e, n);
		case "zAxis": return Zy(e, n);
		case "angleAxis": return Cp(e, n);
		case "radiusAxis": return wp(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, $y = (e, t, n) => {
	switch (t) {
		case "xAxis": return Ky(e, n);
		case "yAxis": return Yy(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, eb = (e, t, n) => {
	switch (t) {
		case "xAxis": return Ky(e, n);
		case "yAxis": return Yy(e, n);
		case "angleAxis": return Cp(e, n);
		case "radiusAxis": return wp(e, n);
		default: throw Error(`Unexpected axis type: ${t}`);
	}
}, tb = (e) => e.graphicalItems.cartesianItems.some((e) => e.type === "bar") || e.graphicalItems.polarItems.some((e) => e.type === "radialBar");
function nb(e, t) {
	return (n) => {
		switch (e) {
			case "xAxis": return "xAxisId" in n && n.xAxisId === t;
			case "yAxis": return "yAxisId" in n && n.yAxisId === t;
			case "zAxis": return "zAxisId" in n && n.zAxisId === t;
			case "angleAxis": return "angleAxisId" in n && n.angleAxisId === t;
			case "radiusAxis": return "radiusAxisId" in n && n.radiusAxisId === t;
			default: return !1;
		}
	};
}
var rb = (e) => e.graphicalItems.cartesianItems, ib = H([Mp, Np], nb), ab = (e, t, n) => e.filter(n).filter((e) => t?.includeHidden === !0 || !e.hide), ob = H([
	rb,
	Qy,
	ib
], ab, { memoizeOptions: { resultEqualityCheck: Rp } }), sb = H([ob], (e) => e.filter((e) => e.type === "area" || e.type === "bar").filter(Ip)), cb = (e) => e.filter((e) => !("stackId" in e) || e.stackId === void 0), lb = H([ob], cb), ub = (e) => e.map((e) => e.data).filter(Boolean).flat(1), db = H([ob], (e) => e.some((e) => !e.data)), fb = H([ob], ub, { memoizeOptions: { resultEqualityCheck: Rp } }), pb = (e, t) => {
	var n = t.chartData, r = n === void 0 ? [] : n, i = t.dataStartIndex, a = t.dataEndIndex;
	return e.length > 0 ? e : r.slice(i, a + 1);
}, mb = H([fb, Ef], pb), hb = (e, t, n) => t?.dataKey == null ? n.length > 0 ? n.map((e) => e.dataKey).flatMap((t) => e.map((e) => ({ value: ds(e, t) }))) : e.map((e) => ({ value: e })) : e.map((e) => ({ value: ds(e, t.dataKey) })), gb = (e, t, n, r, i, a) => {
	var o = r.chartData, s = o === void 0 ? [] : o, c = r.dataStartIndex, l = r.dataEndIndex, u = hb(e, t, n);
	return i && t?.dataKey != null && a.length > 0 ? [...s.slice(c, l + 1).map((e) => ({ value: ds(e, t.dataKey) })).filter((e) => e.value != null), ...u] : u;
}, _b = H([
	mb,
	Qy,
	ob,
	Ef,
	db,
	fb
], gb);
function vb(e) {
	if (De(e) || e instanceof Date) {
		var t = Number(e);
		if (K(t)) return t;
	}
}
function yb(e) {
	if (Array.isArray(e)) {
		var t = [vb(e[0]), vb(e[1])];
		return If(t) ? t : void 0;
	}
	var n = vb(e);
	if (n != null) return [n, n];
}
function bb(e) {
	return e.map(vb).filter(Ie);
}
function xb(e, t) {
	var n = vb(e), r = vb(t);
	return n == null && r == null ? 0 : n == null ? -1 : r == null ? 1 : n - r;
}
var Sb = H([_b], (e) => e?.map((e) => e.value).sort(xb));
function Cb(e, t) {
	switch (e) {
		case "xAxis": return t.direction === "x";
		case "yAxis": return t.direction === "y";
		default: return !1;
	}
}
function wb(e, t, n) {
	if (!n || !n.length) return [];
	var r;
	if (typeof t == "number" && !Te(t)) r = t;
	else if (Array.isArray(t)) {
		var i = bb(t);
		i.length > 0 && (r = Math.max(...i));
	}
	return r == null ? [] : bb(n.flatMap((t) => {
		var n = ds(e, t.dataKey), i, a;
		if (Array.isArray(n)) {
			var o = Ly(n, 2);
			i = o[0], a = o[1];
		} else i = a = n;
		if (K(i) && K(a)) return [r - i, r + a];
	}));
}
var Tb = (e) => eb(e, Bp(e), Vp(e)), Eb = H([Tb], (e) => e?.dataKey), Db = H([
	sb,
	Ef,
	Tb
], Fp), Ob = (e, t, n, r) => {
	var i = t.reduce((e, t) => {
		if (t.stackId == null) return e;
		var n = e[t.stackId];
		return n ??= [], n.push(t), e[t.stackId] = n, e;
	}, {});
	return Object.fromEntries(Object.entries(i).map((t) => {
		var i = Ly(t, 2), a = i[0], o = i[1], s = r ? [...o].reverse() : o;
		return [a, {
			stackedData: vs(e, s.map(Pp), n),
			graphicalItems: s
		}];
	}));
}, kb = H([
	Db,
	sb,
	ip,
	ap
], Ob), Ab = (e, t, n, r) => {
	var i = t.dataStartIndex, a = t.dataEndIndex;
	if (r == null && n !== "zAxis") return Ts(e, i, a);
}, jb = H([Qy], (e) => e.allowDataOverflow), Mb = (e) => {
	if (e == null || !("domain" in e)) return Uy;
	if (e.domain != null) return e.domain;
	if ("ticks" in e && e.ticks != null) {
		if (e.type === "number") {
			var t = bb(e.ticks);
			return [Math.min(...t), Math.max(...t)];
		}
		if (e.type === "category") return e.ticks.map(String);
	}
	return e?.domain ?? Uy;
}, Nb = H([Qy], Mb), Pb = H([Nb, jb], Rf), Fb = H([
	kb,
	wf,
	Mp,
	Pb
], Ab, { memoizeOptions: { resultEqualityCheck: Lp } }), Ib = (e) => e.errorBars, Lb = (e, t, n) => e.flatMap((e) => t[e.id]).filter(Boolean).filter((e) => Cb(n, e)), Rb = function() {
	var e = [...arguments].filter(Boolean);
	if (e.length !== 0) {
		var t = e.flat();
		return [Math.min(...t), Math.max(...t)];
	}
}, zb = function(e, t, n, r, i) {
	var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [], o, s;
	if (n.length > 0 && n.forEach((e) => {
		var n = e.data == null ? a : [...e.data], c = r[e.id]?.filter((e) => Cb(i, e));
		n.forEach((n) => {
			var r = ds(n, t.dataKey ?? e.dataKey), i = wb(n, r, c);
			if (i.length >= 2) {
				var a = Math.min(...i), l = Math.max(...i);
				(o == null || a < o) && (o = a), (s == null || l > s) && (s = l);
			}
			var u = yb(r);
			u != null && (o = o == null ? u[0] : Math.min(o, u[0]), s = s == null ? u[1] : Math.max(s, u[1]));
		});
	}), t?.dataKey != null && n.length === 0 && e.forEach((e) => {
		var n = yb(ds(e, t.dataKey));
		n != null && (o = o == null ? n[0] : Math.min(o, n[0]), s = s == null ? n[1] : Math.max(s, n[1]));
	}), K(o) && K(s)) return [o, s];
}, Bb = H([
	mb,
	Qy,
	lb,
	Ib,
	Mp,
	Of
], zb, { memoizeOptions: { resultEqualityCheck: Lp } });
function Vb(e) {
	var t = e.value;
	if (De(t) || t instanceof Date) return t;
}
var Hb = (e, t, n) => {
	var r = e.map(Vb).filter((e) => e != null);
	return n && (t.dataKey == null || t.allowDuplicatedCategory && je(r)) ? Cf(0, e.length) : t.allowDuplicatedCategory ? r : Array.from(new Set(r));
}, Ub = (e) => e.referenceElements.dots, Wb = (e, t, n) => e.filter((e) => e.ifOverflow === "extendDomain").filter((e) => t === "xAxis" ? e.xAxisId === n : e.yAxisId === n), Gb = H([
	Ub,
	Mp,
	Np
], Wb), Kb = (e) => e.referenceElements.areas, qb = H([
	Kb,
	Mp,
	Np
], Wb), Jb = (e) => e.referenceElements.lines, Yb = H([
	Jb,
	Mp,
	Np
], Wb), Xb = (e, t) => {
	if (e != null) {
		var n = bb(e.map((e) => t === "xAxis" ? e.x : e.y));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, Zb = H(Gb, Mp, Xb), Qb = (e, t) => {
	if (e != null) {
		var n = bb(e.flatMap((e) => [t === "xAxis" ? e.x1 : e.y1, t === "xAxis" ? e.x2 : e.y2]));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, $b = H([qb, Mp], Qb);
function ex(e) {
	if (e.x != null) return bb([e.x]);
	var t = e.segment?.map((e) => e.x);
	return t == null || t.length === 0 ? [] : bb(t);
}
function tx(e) {
	if (e.y != null) return bb([e.y]);
	var t = e.segment?.map((e) => e.y);
	return t == null || t.length === 0 ? [] : bb(t);
}
var nx = (e, t) => {
	if (e != null) {
		var n = e.flatMap((e) => t === "xAxis" ? ex(e) : tx(e));
		if (n.length !== 0) return [Math.min(...n), Math.max(...n)];
	}
}, rx = H(Zb, H([Yb, Mp], nx), $b, (e, t, n) => Rb(e, n, t)), ix = (e, t, n, r, i, a, o, s, c) => {
	if (n != null) return n;
	var l = o === "vertical" && s === "xAxis" || o === "horizontal" && s === "yAxis" ? Rb(r, a, i) : Rb(a, i), u = zf(t, l, e.allowDataOverflow);
	return u == null && e.allowDataOverflow && l == null && c != null ? c : u;
}, ax = H([
	Qy,
	Nb,
	Pb,
	Fb,
	Bb,
	rx,
	q,
	Mp,
	H([Qy], (e) => {
		if (e != null && e.type === "number" && "ticks" in e && e.ticks != null) {
			var t = bb(e.ticks);
			if (t.length !== 0) return [Math.min(...t), Math.max(...t)];
		}
	}, { memoizeOptions: { resultEqualityCheck: Lp } })
], ix, { memoizeOptions: { resultEqualityCheck: Lp } }), ox = [0, 1], sx = (e, t, n, r, i, a, o) => {
	if (e != null && n != null && n.length !== 0 || o !== void 0) {
		var s = e.dataKey, c = e.type, l = ps(t, a);
		return l && s == null ? Cf(0, n?.length ?? 0) : c === "category" ? Hb(r, e, l) : i === "expand" && !l ? ox : o;
	}
}, cx = H([
	Qy,
	q,
	mb,
	_b,
	ip,
	Mp,
	ax
], sx), lx = H([
	Qy,
	tb,
	op
], Oy), ux = (e, t, n) => {
	var r = t.niceTicks;
	if (r !== "none") {
		var i = Mb(t), a = Array.isArray(i) && (i[0] === "auto" || i[1] === "auto");
		if ((r === "snap125" || r === "adaptive") && t != null && t.tickCount && If(e)) {
			if (a) return Qf(e, t.tickCount, t.allowDecimals, r);
			if (t.type === "number") return $f(e, t.tickCount, t.allowDecimals, r);
		}
		if (r === "auto" && n === "linear" && t != null && t.tickCount) {
			if (a && If(e)) return Qf(e, t.tickCount, t.allowDecimals, "adaptive");
			if (t.type === "number" && If(e)) return $f(e, t.tickCount, t.allowDecimals, "adaptive");
		}
	}
}, dx = H([
	cx,
	eb,
	lx
], ux), fx = (e, t, n, r) => {
	if (r !== "angleAxis" && e?.type === "number" && If(t) && Array.isArray(n) && n.length > 0) {
		var i = t[0], a = n[0] ?? 0, o = t[1], s = n[n.length - 1] ?? 0;
		return [Math.min(i, a), Math.max(o, s)];
	}
	return t;
}, px = H([
	Qy,
	cx,
	dx,
	Mp
], fx), mx = H(H(_b, Qy, (e, t) => {
	if (t && t.type === "number") {
		var n = Infinity, r = Array.from(bb(e.map((e) => e.value))).sort((e, t) => e - t), i = r[0], a = r[r.length - 1];
		if (i == null || a == null) return Infinity;
		var o = a - i;
		if (o === 0) return Infinity;
		for (var s = 0; s < r.length - 1; s++) {
			var c = r[s], l = r[s + 1];
			if (c != null && l != null) {
				var u = l - c;
				n = Math.min(n, u);
			}
		}
		return n / o;
	}
}), q, np, Xs, (e, t, n, r, i) => i, (e, t, n, r, i) => {
	if (!K(e)) return 0;
	var a = t === "vertical" ? r.height : r.width;
	if (i === "gap") return e * a / 2;
	if (i === "no-gap") {
		var o = Ae(n, e * a), s = e * a / 2;
		return s - o - (s - o) / a * o;
	}
	return 0;
}), hx = (e, t, n) => {
	var r = Ky(e, t);
	return r == null || typeof r.padding != "string" ? 0 : mx(e, "xAxis", t, n, r.padding);
}, gx = (e, t, n) => {
	var r = Yy(e, t);
	return r == null || typeof r.padding != "string" ? 0 : mx(e, "yAxis", t, n, r.padding);
}, _x = H(Ky, hx, (e, t) => {
	if (e == null) return {
		left: 0,
		right: 0
	};
	var n = e.padding;
	return typeof n == "string" ? {
		left: t,
		right: t
	} : {
		left: (n.left ?? 0) + t,
		right: (n.right ?? 0) + t
	};
}), vx = H(Yy, gx, (e, t) => {
	if (e == null) return {
		top: 0,
		bottom: 0
	};
	var n = e.padding;
	return typeof n == "string" ? {
		top: t,
		bottom: t
	} : {
		top: (n.top ?? 0) + t,
		bottom: (n.bottom ?? 0) + t
	};
}), yx = H([
	Xs,
	_x,
	nc,
	tc,
	(e, t, n) => n
], (e, t, n, r, i) => {
	var a = r.padding;
	return i ? [a.left, n.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
}), bx = H([
	Xs,
	q,
	vx,
	nc,
	tc,
	(e, t, n) => n
], (e, t, n, r, i, a) => {
	var o = i.padding;
	return a ? [r.height - o.bottom, o.top] : t === "horizontal" ? [e.top + e.height - n.bottom, e.top + n.top] : [e.top + n.top, e.top + e.height - n.bottom];
}), xx = (e, t, n, r) => {
	switch (t) {
		case "xAxis": return yx(e, n, r);
		case "yAxis": return bx(e, n, r);
		case "zAxis": return Zy(e, n)?.range;
		case "angleAxis": return kp(e);
		case "radiusAxis": return Ap(e, n);
		default: return;
	}
}, Sx = H([Qy, xx], mp), Cx = H([
	Qy,
	lx,
	H([lx, px], Up),
	Sx
], Ty), wx = (e, t, n, r) => {
	if (n != null && n.dataKey != null) {
		var i = n.type, a = n.scale;
		if (ps(e, r) && (i === "number" || a !== "auto")) return t.map((e) => e.value);
	}
}, Tx = H([
	q,
	_b,
	eb,
	Mp
], wx), Ex = H([Cx], Hp);
H([Cx], jy), H([Cx, Sb], Ay), H([
	ob,
	Ib,
	Mp
], Lb);
function Dx(e, t) {
	return e.id < t.id ? -1 : +(e.id > t.id);
}
var Ox = (e, t) => t, kx = (e, t, n) => n, Ax = H(Ls, Ox, kx, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(Dx)), jx = H(Rs, Ox, kx, (e, t, n) => e.filter((e) => e.orientation === t).filter((e) => e.mirror === n).sort(Dx)), Mx = (e, t) => {
	var n = typeof t.height == "number" ? t.height : 30;
	return {
		width: e.width,
		height: n
	};
}, Nx = (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
}), Px = H(Xs, Ky, Mx), Fx = (e, t, n) => {
	switch (t) {
		case "top": return e.top;
		case "bottom": return n - e.bottom;
		default: return 0;
	}
}, Ix = (e, t, n) => {
	switch (t) {
		case "left": return e.left;
		case "right": return n - e.right;
		default: return 0;
	}
}, Lx = H(Ps, Xs, Ax, Ox, kx, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = Mx(t, n);
		o ??= Fx(t, r, e);
		var c = r === "top" && !i || r === "bottom" && i;
		a[n.id] = o - Number(c) * s.height, o += (c ? -1 : 1) * s.height;
	}), a;
}), Rx = H(Ns, Xs, jx, Ox, kx, (e, t, n, r, i) => {
	var a = {}, o;
	return n.forEach((n) => {
		var s = Nx(t, n);
		o ??= Ix(t, r, e);
		var c = r === "left" && !i || r === "right" && i;
		a[n.id] = o - Number(c) * s.width, o += (c ? -1 : 1) * s.width;
	}), a;
}), zx = H([
	Xs,
	Ky,
	(e, t) => {
		var n = Ky(e, t);
		if (n != null) return Lx(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: e.left,
			y: 0
		} : {
			x: e.left,
			y: i
		};
	}
}), Bx = H([
	Xs,
	Yy,
	(e, t) => {
		var n = Yy(e, t);
		if (n != null) return Rx(e, n.orientation, n.mirror);
	},
	(e, t) => t
], (e, t, n, r) => {
	if (t != null) {
		var i = n?.[r];
		return i == null ? {
			x: 0,
			y: e.top
		} : {
			x: i,
			y: e.top
		};
	}
}), Vx = H(Xs, Yy, (e, t) => ({
	width: typeof t.width == "number" ? t.width : 60,
	height: e.height
})), Hx = (e, t, n) => {
	switch (t) {
		case "xAxis": return Px(e, n).width;
		case "yAxis": return Vx(e, n).height;
		default: return;
	}
}, Ux = (e, t, n, r) => {
	if (n != null) {
		var i = n.allowDuplicatedCategory, a = n.type, o = n.dataKey, s = ps(e, r), c = t.map((e) => e.value), l = c.filter((e) => e != null);
		if (o && s && a === "category" && i && je(l)) return c;
	}
}, Wx = H([
	q,
	_b,
	Qy,
	Mp
], Ux), Gx = H([
	q,
	$y,
	lx,
	Ex,
	Wx,
	Tx,
	xx,
	dx,
	Mp
], (e, t, n, r, i, a, o, s, c) => {
	if (t != null) {
		var l = ps(e, c);
		return {
			angle: t.angle,
			interval: t.interval,
			minTickGap: t.minTickGap,
			orientation: t.orientation,
			tick: t.tick,
			tickCount: t.tickCount,
			tickFormatter: t.tickFormatter,
			ticks: t.ticks,
			type: t.type,
			unit: t.unit,
			axisType: c,
			categoricalDomain: a,
			duplicateDomain: i,
			isCategorical: l,
			niceTicks: s,
			range: o,
			realScaleType: n,
			scale: r
		};
	}
}), Kx = H([
	q,
	eb,
	lx,
	Ex,
	dx,
	xx,
	Wx,
	Tx,
	Mp
], (e, t, n, r, i, a, o, s, c) => {
	if (t != null && r != null) {
		var l = ps(e, c), u = t.type, d = t.ticks, f = t.tickCount, p = n === "scaleBand" && typeof r.bandwidth == "function" ? r.bandwidth() / 2 : 2, m = u === "category" && r.bandwidth ? r.bandwidth() / p : 0;
		m = c === "angleAxis" && a != null && a.length >= 2 ? we(a[0] - a[1]) * 2 * m : m;
		var h = d || i;
		return h ? h.map((e, t) => {
			var n = o ? o.indexOf(e) : e, i = r.map(n);
			return K(i) ? {
				index: t,
				coordinate: i + m,
				value: e,
				offset: m
			} : null;
		}).filter(Ie) : l && s ? s.map((e, t) => {
			var n = r.map(e);
			return K(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter(Ie) : r.ticks ? r.ticks(f).map((e, t) => {
			var n = r.map(e);
			return K(n) ? {
				coordinate: n + m,
				value: e,
				index: t,
				offset: m
			} : null;
		}).filter(Ie) : r.domain().map((e, t) => {
			var n = r.map(e);
			return K(n) ? {
				coordinate: n + m,
				value: o ? o[e] : e,
				index: t,
				offset: m
			} : null;
		}).filter(Ie);
	}
}), qx = H([
	q,
	eb,
	Ex,
	xx,
	Wx,
	Tx,
	Mp
], (e, t, n, r, i, a, o) => {
	if (t != null && n != null && r != null && r[0] !== r[1]) {
		var s = ps(e, o), c = t.tickCount, l = 0;
		return l = o === "angleAxis" && r?.length >= 2 ? we(r[0] - r[1]) * 2 * l : l, s && a ? a.map((e, t) => {
			var r = n.map(e);
			return K(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter(Ie) : n.ticks ? n.ticks(c).map((e, t) => {
			var r = n.map(e);
			return K(r) ? {
				coordinate: r + l,
				value: e,
				index: t,
				offset: l
			} : null;
		}).filter(Ie) : n.domain().map((e, t) => {
			var r = n.map(e);
			return K(r) ? {
				coordinate: r + l,
				value: i ? i[e] : e,
				index: t,
				offset: l
			} : null;
		}).filter(Ie);
	}
}), Jx = H(Qy, Ex, (e, t) => {
	if (e != null && t != null) return Ny(Ny({}, e), {}, { scale: t });
});
H((e, t, n) => Zy(e, n), H([H([
	Qy,
	lx,
	cx,
	Sx
], Ty)], Hp), (e, t) => {
	if (e != null && t != null) return Ny(Ny({}, e), {}, { scale: t });
});
var Yx = H([
	q,
	Ls,
	Rs
], (e, t, n) => {
	switch (e) {
		case "horizontal": return t.some((e) => e.reversed) ? "right-to-left" : "left-to-right";
		case "vertical": return n.some((e) => e.reversed) ? "bottom-to-top" : "top-to-bottom";
		case "centric":
		case "radial": return "left-to-right";
		default: return;
	}
});
H([(e, t, n) => e.renderedTicks[t]?.[n]], (e) => {
	if (e && e.length !== 0) return (t) => {
		var n = Infinity, r = e[0];
		for (var i of e) {
			var a = Math.abs(i.coordinate - t);
			a < n && (n = a, r = i);
		}
		return r?.value;
	};
});
// analytics/node_modules/recharts/es6/state/selectors/selectTooltipEventType.js
var Xx = (e) => e.options.defaultTooltipEventType, Zx = (e) => e.options.validateTooltipEventTypes;
function Qx(e, t, n) {
	if (e == null) return t;
	var r = e ? "axis" : "item";
	return n == null ? t : n.includes(r) ? r : t;
}
function $x(e, t) {
	return Qx(t, Xx(e), Zx(e));
}
function eS(e) {
	return V((t) => $x(t, e));
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineActiveLabel.js
var tS = (e, t) => {
	var n, r = Number(t);
	if (!(Te(r) || t == null)) return r >= 0 ? e == null || (n = e[r]) == null ? void 0 : n.value : void 0;
}, nS = (e) => e.tooltip.settings, rS = {
	active: !1,
	index: null,
	dataKey: void 0,
	graphicalItemId: void 0,
	coordinate: void 0
}, iS = lo({
	name: "tooltip",
	initialState: {
		itemInteraction: {
			click: rS,
			hover: rS
		},
		axisInteraction: {
			click: rS,
			hover: rS
		},
		keyboardInteraction: rS,
		syncInteraction: {
			active: !1,
			index: null,
			dataKey: void 0,
			label: void 0,
			coordinate: void 0,
			sourceViewBox: void 0,
			graphicalItemId: void 0
		},
		tooltipItemPayloads: [],
		settings: {
			shared: void 0,
			trigger: "hover",
			axisId: 0,
			active: !1,
			defaultIndex: void 0
		}
	},
	reducers: {
		addTooltipEntrySettings: {
			reducer(e, t) {
				e.tooltipItemPayloads.push(W(t.payload));
			},
			prepare: Ja()
		},
		replaceTooltipEntrySettings: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next, a = Pa(e).tooltipItemPayloads.indexOf(W(r));
				a > -1 && (e.tooltipItemPayloads[a] = W(i));
			},
			prepare: Ja()
		},
		removeTooltipEntrySettings: {
			reducer(e, t) {
				var n = Pa(e).tooltipItemPayloads.indexOf(W(t.payload));
				n > -1 && e.tooltipItemPayloads.splice(n, 1);
			},
			prepare: Ja()
		},
		setTooltipSettingsState(e, t) {
			e.settings = t.payload;
		},
		setActiveMouseOverItemIndex(e, t) {
			e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		mouseLeaveChart(e) {
			e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1;
		},
		mouseLeaveItem(e) {
			e.itemInteraction.hover.active = !1;
		},
		setActiveClickItemIndex(e, t) {
			e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setMouseOverAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate;
		},
		setMouseClickAxisIndex(e, t) {
			e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate;
		},
		setSyncInteraction(e, t) {
			e.syncInteraction = t.payload;
		},
		setKeyboardInteraction(e, t) {
			e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate;
		}
	}
}), aS = iS.actions, oS = aS.addTooltipEntrySettings, sS = aS.replaceTooltipEntrySettings, cS = aS.removeTooltipEntrySettings, lS = aS.setTooltipSettingsState, uS = aS.setActiveMouseOverItemIndex, dS = aS.mouseLeaveItem, fS = aS.mouseLeaveChart, pS = aS.setActiveClickItemIndex, mS = aS.setMouseOverAxisIndex, hS = aS.setMouseClickAxisIndex, gS = aS.setSyncInteraction, _S = aS.setKeyboardInteraction, vS = iS.reducer;
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineTooltipInteractionState.js
function yS(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function bS(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? yS(Object(n), !0).forEach(function(t) {
			xS(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yS(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xS(e, t, n) {
	return (t = SS(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function SS(e) {
	var t = CS(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function CS(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function wS(e, t, n) {
	return t === "axis" ? n === "click" ? e.axisInteraction.click : e.axisInteraction.hover : n === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function TS(e) {
	return e.index != null;
}
var ES = (e, t, n, r) => {
	if (t == null) return rS;
	var i = wS(e, t, n);
	if (i == null) return rS;
	if (i.active) return i;
	if (e.keyboardInteraction.active) return e.keyboardInteraction;
	if (e.syncInteraction.active && e.syncInteraction.index != null) return e.syncInteraction;
	var a = e.settings.active === !0;
	if (TS(i)) {
		if (a) return bS(bS({}, i), {}, { active: !0 });
	} else if (r != null) return {
		active: !0,
		coordinate: void 0,
		dataKey: void 0,
		index: r,
		graphicalItemId: void 0
	};
	return bS(bS({}, rS), {}, { coordinate: i.coordinate });
};
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineActiveTooltipIndex.js
function DS(e) {
	if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
	if (e instanceof Date) {
		var t = e.valueOf();
		return Number.isFinite(t) ? t : void 0;
	}
	var n = Number(e);
	return Number.isFinite(n) ? n : void 0;
}
function OS(e, t) {
	var n = DS(e), r = t[0], i = t[1];
	return n !== void 0 && n >= Math.min(r, i) && n <= Math.max(r, i);
}
function kS(e, t, n) {
	if (n == null || t == null) return !0;
	var r = ds(e, t);
	return r == null || !If(n) || OS(r, n);
}
var AS = (e, t, n, r) => {
	var i = e?.index;
	if (i == null) return null;
	var a = Number(i);
	if (!K(a)) return i;
	var o = 0, s = Infinity;
	t.length > 0 && (s = t.length - 1);
	var c = Math.max(o, Math.min(a, s)), l = t[c];
	return l == null || kS(l, n, r) ? String(c) : null;
}, jS = (e, t, n, r, i, a, o) => {
	if (a != null) {
		var s = o[0]?.getPosition(a);
		if (s != null) return s;
		var c = i?.[Number(a)];
		if (c) switch (n) {
			case "horizontal": return {
				x: c.coordinate,
				y: (r.top + t) / 2
			};
			default: return {
				x: (r.left + e) / 2,
				y: c.coordinate
			};
		}
	}
}, MS = (e, t, n, r) => {
	if (t === "axis") return e.tooltipItemPayloads;
	if (e.tooltipItemPayloads.length === 0) return [];
	var i = n === "hover" ? e.itemInteraction.hover.graphicalItemId : e.itemInteraction.click.graphicalItemId;
	if (e.syncInteraction.active && i == null) return e.tooltipItemPayloads;
	if (i == null && (r != null || e.keyboardInteraction.active)) {
		var a = e.tooltipItemPayloads[0];
		return a == null ? [] : [a];
	}
	return e.tooltipItemPayloads.filter((e) => e.settings?.graphicalItemId === i);
}, NS = (e) => e.options.tooltipPayloadSearcher, PS = (e) => e.tooltip;
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineTooltipPayload.js
function FS(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function IS(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? FS(Object(n), !0).forEach(function(t) {
			LS(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : FS(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function LS(e, t, n) {
	return (t = RS(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function RS(e) {
	var t = zS(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function zS(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function BS(e) {
	if (typeof e == "string" || typeof e == "number") return e;
}
function VS(e) {
	if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
}
function HS(e) {
	if (typeof e == "string" || typeof e == "number") return e;
	if (typeof e == "function") return (t) => e(t);
}
function US(e) {
	if (typeof e == "string") return e;
}
function WS(e) {
	if (typeof e == "object" && e) return {
		name: "name" in e ? BS(e.name) : void 0,
		unit: "unit" in e ? VS(e.unit) : void 0,
		dataKey: "dataKey" in e ? HS(e.dataKey) : void 0,
		payload: "payload" in e ? e.payload : void 0,
		color: "color" in e ? US(e.color) : void 0,
		fill: "fill" in e ? US(e.fill) : void 0
	};
}
function GS(e, t) {
	return e ?? t;
}
var KS = (e, t, n, r, i, a, o) => {
	if (t != null && a != null) {
		var s = n.chartData, c = n.computedData, l = n.dataStartIndex, u = n.dataEndIndex;
		return e.reduce((e, n) => {
			var d = n.dataDefinedOnItem, f = n.settings, p = GS(d, s), m = Array.isArray(p) ? is(p, l, u) : p, h = f?.dataKey ?? r, g = f?.nameKey, _;
			return r && Array.isArray(m) && !Array.isArray(m[0]) && o === "axis" ? (_ = Ne(m, r, i), _ ??= a(m, t, c, g)) : _ = a(m, t, c, g), Array.isArray(_) ? _.forEach((t) => {
				var n = WS(t), r = n?.name, i = n?.dataKey, a = n?.payload, o = IS(IS({}, f), {}, {
					name: r,
					unit: n?.unit,
					color: n?.color ?? f?.color,
					fill: n?.fill ?? f?.fill
				});
				e.push(ks({
					tooltipEntrySettings: o,
					dataKey: i,
					payload: a,
					value: ds(a, i),
					name: r == null ? void 0 : String(r)
				}));
			}) : e.push(ks({
				tooltipEntrySettings: f,
				dataKey: h,
				payload: _,
				value: ds(_, h),
				name: ds(_, g) ?? f?.name
			})), e;
		}, []);
	}
}, qS = H([
	Tb,
	tb,
	op
], Oy), JS = H([
	H([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
	Tb,
	H([Bp, Vp], nb)
], ab, { memoizeOptions: { resultEqualityCheck: Rp } }), YS = H([JS], (e) => e.filter(Ip)), XS = H([JS], ub, { memoizeOptions: { resultEqualityCheck: Rp } }), ZS = H([JS], (e) => e.some((e) => !e.data)), QS = H([XS, wf], pb), $S = H([
	YS,
	wf,
	Tb
], Fp), eC = H([
	QS,
	Tb,
	JS,
	wf,
	ZS,
	XS
], gb), tC = H([Tb], Mb), nC = H([tC, H([Tb], (e) => e.allowDataOverflow)], Rf), rC = H([
	H([
		$S,
		H([JS], (e) => e.filter(Ip)),
		ip,
		ap
	], Ob),
	wf,
	Bp,
	nC
], Ab), iC = H([
	QS,
	Tb,
	H([JS], cb),
	Ib,
	Bp,
	kf
], zb, { memoizeOptions: { resultEqualityCheck: Lp } }), aC = H([H([
	Ub,
	Bp,
	Vp
], Wb), Bp], Xb), oC = H([H([
	Kb,
	Bp,
	Vp
], Wb), Bp], Qb), sC = H([
	Tb,
	q,
	QS,
	eC,
	ip,
	Bp,
	H([
		Tb,
		tC,
		nC,
		rC,
		iC,
		H([
			aC,
			H([H([
				Jb,
				Bp,
				Vp
			], Wb), Bp], nx),
			oC
		], Rb),
		q,
		Bp
	], ix)
], sx), cC = H([
	Tb,
	sC,
	H([
		sC,
		Tb,
		qS
	], ux),
	Bp
], fx), lC = (e) => xx(e, Bp(e), Vp(e), !1), uC = H([Tb, lC], mp), dC = H([H([
	Tb,
	qS,
	cC,
	uC
], Ty)], Hp), fC = H([
	q,
	Tb,
	qS,
	dC,
	lC,
	H([
		q,
		eC,
		Tb,
		Bp
	], Ux),
	H([
		q,
		eC,
		Tb,
		Bp
	], wx),
	Bp
], (e, t, n, r, i, a, o, s) => {
	if (t) {
		var c = t.type, l = ps(e, s);
		if (r) {
			var u = n === "scaleBand" && r.bandwidth ? r.bandwidth() / 2 : 2, d = c === "category" && r.bandwidth ? r.bandwidth() / u : 0;
			return d = s === "angleAxis" && i != null && i?.length >= 2 ? we(i[0] - i[1]) * 2 * d : d, l && o ? o.map((e, t) => {
				var n = r.map(e);
				return K(n) ? {
					coordinate: n + d,
					value: e,
					index: t,
					offset: d
				} : null;
			}).filter(Ie) : r.domain().map((e, t) => {
				var n = r.map(e);
				return K(n) ? {
					coordinate: n + d,
					value: a ? a[e] : e,
					index: t,
					offset: d
				} : null;
			}).filter(Ie);
		}
	}
}), pC = H([
	Xx,
	Zx,
	nS
], (e, t, n) => Qx(n.shared, e, t)), mC = (e) => e.tooltip.settings.trigger, hC = (e) => e.tooltip.settings.defaultIndex, gC = H([
	PS,
	pC,
	mC,
	hC
], ES), _C = H([
	gC,
	QS,
	Eb,
	sC
], AS), vC = H([fC, _C], tS), yC = H([gC], (e) => {
	if (e) return e.dataKey;
}), bC = H([gC], (e) => {
	if (e) return e.graphicalItemId;
}), xC = H([
	PS,
	pC,
	mC,
	hC
], MS), SC = H([gC, H([
	Ns,
	Ps,
	q,
	Xs,
	fC,
	hC,
	xC
], jS)], (e, t) => e != null && e.coordinate ? e.coordinate : t), CC = H([gC], (e) => e?.active ?? !1), wC = H([H([
	xC,
	_C,
	wf,
	Eb,
	vC,
	NS,
	pC
], KS)], (e) => {
	if (e != null) {
		var t = e.map((e) => e.payload).filter((e) => e != null);
		return Array.from(new Set(t));
	}
});
// analytics/node_modules/recharts/es6/context/useTooltipAxis.js
function TC(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function EC(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? TC(Object(n), !0).forEach(function(t) {
			DC(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : TC(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function DC(e, t, n) {
	return (t = OC(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function OC(e) {
	var t = kC(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function kC(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var AC = () => V(Tb), jC = () => {
	var e = AC(), t = V(fC), n = V(dC);
	return Os(!e || !n ? void 0 : EC(EC({}, e), {}, { scale: n }), t);
};
// analytics/node_modules/recharts/es6/util/getActiveCoordinate.js
function MC(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function NC(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? MC(Object(n), !0).forEach(function(t) {
			PC(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : MC(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function PC(e, t, n) {
	return (t = FC(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function FC(e) {
	var t = IC(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function IC(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var LC = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "horizontal") return {
			x: i.coordinate,
			y: r.relativeY
		};
		if (e === "vertical") return {
			x: r.relativeX,
			y: i.coordinate
		};
	}
	return {
		x: 0,
		y: 0
	};
}, RC = (e, t, n, r) => {
	var i = t.find((e) => e && e.index === n);
	if (i) {
		if (e === "centric") {
			var a = i.coordinate, o = r.radius;
			return NC(NC(NC({}, r), Xd(r.cx, r.cy, o, a)), {}, {
				angle: a,
				radius: o
			});
		}
		var s = i.coordinate, c = r.angle;
		return NC(NC(NC({}, r), Xd(r.cx, r.cy, s, c)), {}, {
			angle: c,
			radius: s
		});
	}
	return {
		angle: 0,
		clockWise: !1,
		cx: 0,
		cy: 0,
		endAngle: 0,
		innerRadius: 0,
		outerRadius: 0,
		radius: 0,
		startAngle: 0,
		x: 0,
		y: 0
	};
};
function zC(e, t) {
	var n = e.relativeX, r = e.relativeY;
	return n >= t.left && n <= t.left + t.width && r >= t.top && r <= t.top + t.height;
}
var BC = (e, t, n, r, i) => {
	var a = t?.length ?? 0;
	if (a <= 1 || e == null) return 0;
	if (r === "angleAxis" && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6) for (var o = i[1] - i[0], s = (t, n, r) => [
		e,
		e + o,
		e - o
	].some((e) => (r ? e >= t : e > t) && e <= n), c = 0; c < a; c++) {
		var l = c > 0 ? n[c - 1]?.coordinate : n[a - 1]?.coordinate, u = n[c]?.coordinate, d = c >= a - 1 ? n[0]?.coordinate : n[c + 1]?.coordinate, f = void 0;
		if (l != null && u != null && d != null) {
			if (we(u - l) !== we(d - u)) {
				var p = [];
				if (we(d - u) === we(i[1] - i[0])) {
					f = d;
					var m = u + i[1] - i[0];
					p[0] = Math.min(m, (m + l) / 2), p[1] = Math.max(m, (m + l) / 2);
				} else {
					f = l;
					var h = d + i[1] - i[0];
					p[0] = Math.min(u, (h + u) / 2), p[1] = Math.max(u, (h + u) / 2);
				}
				var g = [Math.min(u, (f + u) / 2), Math.max(u, (f + u) / 2)];
				if (s(g[0], g[1], !1) || s(p[0], p[1], !0)) return n[c]?.index;
			} else {
				var _ = Math.min(l, d), v = Math.max(l, d);
				if (s((_ + u) / 2, (v + u) / 2, !1)) return n[c]?.index;
			}
		}
	}
	else if (t) for (var y = 0; y < a; y++) {
		var b = t[y];
		if (b != null) {
			var x = t[y + 1], S = t[y - 1];
			if (y === 0 && x != null && e <= (b.coordinate + x.coordinate) / 2 || y === a - 1 && S != null && e > (b.coordinate + S.coordinate) / 2 || y > 0 && y < a - 1 && S != null && x != null && e > (b.coordinate + S.coordinate) / 2 && e <= (b.coordinate + x.coordinate) / 2) return b.index;
		}
	}
	return -1;
}, VC = () => V(op), HC = (e, t) => t, UC = (e, t, n) => n, WC = (e, t, n, r) => r, GC = H(fC, (e) => Kr(e, (e) => e.coordinate)), KC = H([
	PS,
	HC,
	UC,
	WC
], ES), qC = H([
	KC,
	QS,
	Eb,
	sC
], AS), JC = (e, t, n) => {
	if (t != null) {
		var r = PS(e);
		return t === "axis" ? n === "hover" ? r.axisInteraction.hover.dataKey : r.axisInteraction.click.dataKey : n === "hover" ? r.itemInteraction.hover.dataKey : r.itemInteraction.click.dataKey;
	}
}, YC = H([
	PS,
	HC,
	UC,
	WC
], MS), XC = H([
	Ns,
	Ps,
	q,
	Xs,
	fC,
	WC,
	YC
], jS), ZC = H([KC, XC], (e, t) => e.coordinate ?? t), QC = H([fC, qC], tS), $C = H([
	YC,
	qC,
	wf,
	Eb,
	QC,
	NS,
	HC
], KS), ew = H([KC, qC], (e, t) => ({
	isActive: e.active && t != null,
	activeIndex: t
})), tw = (e, t, n, r, i, a, o) => {
	if (e && n && r && i && zC(e, o)) {
		var s = BC(js(e, t), a, i, n, r), c = LC(t, i, s, e);
		return {
			activeIndex: String(s),
			activeCoordinate: c
		};
	}
}, nw = (e, t, n, r, i, a, o) => {
	if (e && r && i && a && n) {
		var s = nf(e, n);
		if (s) {
			var c = BC(Ms(s, t), o, a, r, i), l = RC(t, a, c, s);
			return {
				activeIndex: String(c),
				activeCoordinate: l
			};
		}
	}
}, rw = (e, t, n, r, i, a, o, s) => {
	if (e && t && r && i && a) return t === "horizontal" || t === "vertical" ? tw(e, t, r, i, a, o, s) : nw(e, t, n, r, i, a, o);
}, iw = H((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, n) => n, (e, t, n) => {
	if (t != null) {
		var r = e[t];
		if (r != null) return n ? r.panoramaElement : r.element;
	}
}), aw = H((e) => e.zIndex.zIndexMap, (e) => {
	var t = Object.keys(e).map((e) => parseInt(e, 10)).concat(Object.values(dp));
	return Array.from(new Set(t)).sort((e, t) => e - t);
}, { memoizeOptions: { resultEqualityCheck: zp } });
// analytics/node_modules/recharts/es6/state/zIndexSlice.js
function ow(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function sw(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ow(Object(n), !0).forEach(function(t) {
			cw(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ow(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function cw(e, t, n) {
	return (t = lw(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function lw(e) {
	var t = uw(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function uw(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var dw = { zIndexMap: Object.values(dp).reduce((e, t) => sw(sw({}, e), {}, { [t]: {
	element: void 0,
	panoramaElement: void 0,
	consumers: 0
} }), {}) }, fw = new Set(Object.values(dp));
function pw(e) {
	return fw.has(e);
}
var mw = lo({
	name: "zIndex",
	initialState: dw,
	reducers: {
		registerZIndexPortal: {
			reducer: (e, t) => {
				var n = t.payload.zIndex;
				e.zIndexMap[n] ? e.zIndexMap[n].consumers += 1 : e.zIndexMap[n] = {
					consumers: 1,
					element: void 0,
					panoramaElement: void 0
				};
			},
			prepare: Ja()
		},
		unregisterZIndexPortal: {
			reducer: (e, t) => {
				var n = t.payload.zIndex;
				e.zIndexMap[n] && (--e.zIndexMap[n].consumers, e.zIndexMap[n].consumers <= 0 && !pw(n) && delete e.zIndexMap[n]);
			},
			prepare: Ja()
		},
		registerZIndexPortalElement: {
			reducer: (e, t) => {
				var n = t.payload, r = n.zIndex, i = n.element, a = n.isPanorama;
				e.zIndexMap[r] ? a ? e.zIndexMap[r].panoramaElement = W(i) : e.zIndexMap[r].element = W(i) : e.zIndexMap[r] = {
					consumers: 0,
					element: a ? void 0 : W(i),
					panoramaElement: a ? W(i) : void 0
				};
			},
			prepare: Ja()
		},
		unregisterZIndexPortalElement: {
			reducer: (e, t) => {
				var n = t.payload.zIndex;
				e.zIndexMap[n] && (t.payload.isPanorama ? e.zIndexMap[n].panoramaElement = void 0 : e.zIndexMap[n].element = void 0);
			},
			prepare: Ja()
		}
	}
}), hw = mw.actions, gw = hw.registerZIndexPortal, _w = hw.unregisterZIndexPortal, vw = hw.registerZIndexPortalElement, yw = hw.unregisterZIndexPortalElement, bw = mw.reducer, xw = h();
function Sw(e) {
	var t = e.zIndex, n = e.children, r = Wc() && t !== void 0 && t !== 0, i = ec(), a = (0, b.useRef)(void 0), o = (0, b.useRef)(/* @__PURE__ */ new Set()), s = br(), c = V((e) => iw(e, t, i));
	if ((0, b.useLayoutEffect)(() => {
		if (!r) {
			var e = o.current;
			e.forEach((e) => {
				s(_w({ zIndex: e }));
			}), e.clear(), a.current = void 0;
		} else if (o.current.has(t) || (s(gw({ zIndex: t })), o.current.add(t)), c) {
			a.current = c;
			var n = o.current;
			n.forEach((e) => {
				e !== t && (s(_w({ zIndex: e })), n.delete(e));
			});
		}
	}, [
		s,
		t,
		r,
		c
	]), (0, b.useLayoutEffect)(() => {
		var e = o.current;
		return () => {
			e.forEach((e) => {
				s(_w({ zIndex: e }));
			}), e.clear();
		};
	}, [s]), !r) return n;
	var l = c ?? a.current;
	return l ? /*#__PURE__*/ (0, xw.createPortal)(n, l) : null;
}
// analytics/node_modules/recharts/es6/component/Cursor.js
function Cw() {
	return Cw = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Cw.apply(null, arguments);
}
function ww(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Tw(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? ww(Object(n), !0).forEach(function(t) {
			Ew(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ww(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Ew(e, t, n) {
	return (t = Dw(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Dw(e) {
	var t = Ow(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ow(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function kw(e) {
	var t = e.cursor, n = e.cursorComp, r = e.cursorProps;
	return /*#__PURE__*/ (0, b.isValidElement)(t) ? /*#__PURE__*/ (0, b.cloneElement)(t, r) : /*#__PURE__*/ (0, b.createElement)(n, r);
}
function Aw(e) {
	var t = e.coordinate, n = e.payload, r = e.index, i = e.offset, a = e.tooltipAxisBandSize, o = e.layout, s = e.cursor, c = e.tooltipEventType, l = e.chartName, u = t, d = n, f = r;
	if (!s || !u || l !== "ScatterChart" && c !== "axis") return null;
	var p, m, h;
	if (l === "ScatterChart") p = u, m = Mu, h = dp.cursorLine;
	else if (l === "BarChart") p = Nu(o, u, i, a), m = Hd, h = dp.cursorRectangle;
	else if (o === "radial" && Kt(u)) {
		var g = rf(u), _ = g.cx, v = g.cy, y = g.radius;
		p = {
			cx: _,
			cy: v,
			startAngle: g.startAngle,
			endAngle: g.endAngle,
			innerRadius: y,
			outerRadius: y
		}, m = yf, h = dp.cursorLine;
	} else p = { points: bf(o, u, i) }, m = xu, h = dp.cursorLine;
	var x = typeof s == "object" && "className" in s ? s.className : void 0, S = Tw(Tw(Tw(Tw({
		stroke: "#ccc",
		pointerEvents: "none"
	}, i), p), P(s)), {}, {
		payload: d,
		payloadIndex: f,
		className: O("recharts-tooltip-cursor", x)
	});
	return /*#__PURE__*/ b.createElement(Sw, { zIndex: e.zIndex ?? h }, /*#__PURE__*/ b.createElement(kw, {
		cursor: s,
		cursorComp: m,
		cursorProps: S
	}));
}
function jw(e) {
	var t = jC(), n = Rc(), r = Vc(), i = VC();
	return t == null || n == null || r == null || i == null ? null : /*#__PURE__*/ b.createElement(Aw, Cw({}, e, {
		offset: n,
		layout: r,
		tooltipAxisBandSize: t,
		chartName: i
	}));
}
// analytics/node_modules/recharts/es6/context/tooltipPortalContext.js
var Mw = /*#__PURE__*/ (0, b.createContext)(null), Nw = () => (0, b.useContext)(Mw), Pw = (/* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn !== t || i && !o.once || n && o.context !== n || s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})))(), 1)).default, Fw = new Pw(), Iw = "recharts.syncEvent.tooltip", Lw = "recharts.syncEvent.brush", Rw = (e, t) => {
	if (t && Array.isArray(e)) {
		var n = Number.parseInt(t, 10);
		if (!Te(n)) return e[n];
	}
}, zw = lo({
	name: "options",
	initialState: {
		chartName: "",
		tooltipPayloadSearcher: () => void 0,
		eventEmitter: void 0,
		defaultTooltipEventType: "axis"
	},
	reducers: { createEventEmitter: (e) => {
		e.eventEmitter ??= Symbol("rechartsEventEmitter");
	} }
}), Bw = zw.reducer, Vw = zw.actions.createEventEmitter;
// analytics/node_modules/recharts/es6/synchronisation/syncSelectors.js
function Hw(e) {
	return e.tooltip.syncInteraction;
}
var Uw = lo({
	name: "chartData",
	initialState: {
		chartData: void 0,
		computedData: void 0,
		dataStartIndex: 0,
		dataEndIndex: 0
	},
	reducers: {
		setChartData(e, t) {
			e.chartData = W(t.payload), t.payload == null ? (e.dataStartIndex = 0, e.dataEndIndex = 0) : t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
		},
		setComputedData(e, t) {
			e.computedData = t.payload;
		},
		setDataStartEndIndexes(e, t) {
			var n = t.payload, r = n.startIndex, i = n.endIndex;
			r != null && (e.dataStartIndex = r), i != null && (e.dataEndIndex = i);
		}
	}
}), Ww = Uw.actions, Gw = Ww.setChartData, Kw = Ww.setDataStartEndIndexes;
Ww.setComputedData;
var qw = Uw.reducer, Jw = ["x", "y"];
function Yw(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Xw(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Yw(Object(n), !0).forEach(function(t) {
			Zw(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Yw(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Zw(e, t, n) {
	return (t = Qw(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Qw(e) {
	var t = $w(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function $w(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function eT(e, t) {
	if (e == null) return {};
	var n, r, i = tT(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function tT(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function nT() {
	var e = V(sp), t = V(lp), n = br(), r = V(cp), i = V(fC), a = Vc(), o = Ic(), s = V((e) => e.rootProps.className);
	(0, b.useEffect)(() => {
		if (e == null) return Le;
		var s = (s, c, l) => {
			if (t !== l && e === s) {
				if (c.payload.active === !1) n(gS({
					active: !1,
					coordinate: void 0,
					dataKey: void 0,
					index: null,
					label: void 0,
					sourceViewBox: void 0,
					graphicalItemId: void 0
				}));
				else if (r === "index") {
					var u;
					if (o && c != null && (u = c.payload) != null && u.coordinate && c.payload.sourceViewBox) {
						var d = c.payload.coordinate, f = d.x, p = d.y, m = eT(d, Jw), h = c.payload.sourceViewBox, g = h.x, _ = h.y, v = h.width, y = h.height, b = Xw(Xw({}, m), {}, {
							x: o.x + (v ? (f - g) / v : 0) * o.width,
							y: o.y + (y ? (p - _) / y : 0) * o.height
						});
						n(Xw(Xw({}, c), {}, { payload: Xw(Xw({}, c.payload), {}, { coordinate: b }) }));
					} else n(c);
				} else if (i != null) {
					var x;
					typeof r == "function" ? x = i[r(i, {
						activeTooltipIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						isTooltipActive: c.payload.active,
						activeIndex: c.payload.index == null ? void 0 : Number(c.payload.index),
						activeLabel: c.payload.label,
						activeDataKey: c.payload.dataKey,
						activeCoordinate: c.payload.coordinate
					})] : r === "value" && (x = i.find((e) => String(e.value) === c.payload.label));
					var S = c.payload.coordinate;
					if (S == null || o == null) n(gS({
						active: !1,
						coordinate: void 0,
						dataKey: void 0,
						index: null,
						label: void 0,
						sourceViewBox: void 0,
						graphicalItemId: void 0
					}));
					else if (x == null) n(gS({
						active: !1,
						coordinate: void 0,
						dataKey: void 0,
						index: null,
						label: void 0,
						sourceViewBox: c.payload.sourceViewBox,
						graphicalItemId: void 0
					}));
					else {
						var C = S.x, w = S.y, T = Math.min(C, o.x + o.width), E = Math.min(w, o.y + o.height), D = {
							x: a === "horizontal" ? x.coordinate : T,
							y: a === "horizontal" ? E : x.coordinate
						};
						n(gS({
							active: c.payload.active,
							coordinate: D,
							dataKey: c.payload.dataKey,
							index: String(x.index),
							label: c.payload.label,
							sourceViewBox: c.payload.sourceViewBox,
							graphicalItemId: c.payload.graphicalItemId
						}));
					}
				}
			}
		};
		return Fw.on(Iw, s), () => {
			Fw.off(Iw, s);
		};
	}, [
		s,
		n,
		t,
		e,
		r,
		i,
		a,
		o
	]);
}
function rT() {
	var e = V(sp), t = V(lp), n = br();
	(0, b.useEffect)(() => {
		if (e == null) return Le;
		var r = (r, i, a) => {
			t !== a && e === r && n(Kw(i));
		};
		return Fw.on(Lw, r), () => {
			Fw.off(Lw, r);
		};
	}, [
		n,
		t,
		e
	]);
}
function iT() {
	var e = br();
	(0, b.useEffect)(() => {
		e(Vw());
	}, [e]), nT(), rT();
}
function aT(e, t, n, r, i, a) {
	var o = V((n) => JC(n, e, t)), s = V(bC), c = V(lp), l = V(sp), u = V(cp), d = V(Hw)?.sourceViewBox != null, f = Ic();
	(0, b.useEffect)(() => {
		if (!d && l != null && c != null) {
			var e = gS({
				active: a,
				coordinate: n,
				dataKey: o,
				index: i,
				label: typeof r == "number" ? String(r) : r,
				sourceViewBox: f,
				graphicalItemId: s
			});
			Fw.emit(Iw, l, e, c);
		}
	}, [
		d,
		n,
		o,
		s,
		i,
		r,
		c,
		l,
		u,
		a,
		f
	]);
}
// analytics/node_modules/recharts/es6/component/Tooltip.js
function oT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function sT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? oT(Object(n), !0).forEach(function(t) {
			cT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : oT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function cT(e, t, n) {
	return (t = lT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function lT(e) {
	var t = uT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function uT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function dT(e, t) {
	return gT(e) || hT(e, t) || pT(e, t) || fT();
}
function fT() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function pT(e, t) {
	if (e) {
		if (typeof e == "string") return mT(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? mT(e, t) : void 0;
	}
}
function mT(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function hT(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function gT(e) {
	if (Array.isArray(e)) return e;
}
function _T(e) {
	return e.dataKey;
}
function vT(e, t) {
	return /*#__PURE__*/ b.isValidElement(e) ? /*#__PURE__*/ b.cloneElement(e, t) : typeof e == "function" ? /*#__PURE__*/ b.createElement(e, t) : /*#__PURE__*/ b.createElement(jl, t);
}
var yT = [], bT = {
	allowEscapeViewBox: {
		x: !1,
		y: !1
	},
	animationDuration: 400,
	animationEasing: "ease",
	axisId: 0,
	contentStyle: {},
	cursor: !0,
	filterNull: !0,
	includeHidden: !1,
	isAnimationActive: "auto",
	itemSorter: "name",
	itemStyle: {},
	labelStyle: {},
	offset: 10,
	reverseDirection: {
		x: !1,
		y: !1
	},
	separator: " : ",
	trigger: "hover",
	useTranslate3d: !1,
	wrapperStyle: {}
};
function xT(e) {
	var t = tn(e, bT), n = t.active, r = t.allowEscapeViewBox, i = t.animationDuration, a = t.animationEasing, o = t.content, s = t.filterNull, c = t.isAnimationActive, l = t.offset, u = t.payloadUniqBy, d = t.position, f = t.reverseDirection, p = t.useTranslate3d, m = t.wrapperStyle, h = t.cursor, g = t.shared, _ = t.trigger, v = t.defaultIndex, y = t.portal, x = t.axisId, S = br(), C = typeof v == "number" ? String(v) : v;
	(0, b.useEffect)(() => {
		S(lS({
			shared: g,
			trigger: _,
			axisId: x,
			active: n,
			defaultIndex: C
		}));
	}, [
		S,
		g,
		_,
		x,
		n,
		C
	]);
	var w = Ic(), T = ou(), E = eS(g), D = V((e) => ew(e, E, _, C)) ?? {}, O = D.activeIndex, k = D.isActive, ee = V((e) => $C(e, E, _, C)), A = V((e) => QC(e, E, _, C)), j = V((e) => ZC(e, E, _, C)), M = ee, N = Nw(), P = n ?? k ?? !1, te = dT(ii([M, P]), 2), ne = te[0], re = te[1], ie = E === "axis" ? A : void 0;
	aT(E, _, j, ie, O, P);
	var ae = y ?? N;
	if (ae == null || w == null || E == null) return null;
	var F = M ?? yT;
	P || (F = yT), s && F.length && (F = fr(F.filter((e) => e.value != null && (e.hide !== !0 || t.includeHidden)), u, _T));
	var oe = F.length > 0, se = sT(sT({}, t), {}, {
		payload: F,
		label: ie,
		active: P,
		activeIndex: O,
		coordinate: j,
		accessibilityLayer: T
	}), ce = /*#__PURE__*/ b.createElement(au, {
		allowEscapeViewBox: r,
		animationDuration: i,
		animationEasing: a,
		isAnimationActive: c,
		active: P,
		coordinate: j,
		hasPayload: oe,
		offset: l,
		position: d,
		reverseDirection: f,
		useTranslate3d: p,
		viewBox: w,
		wrapperStyle: m,
		lastBoundingBox: ne,
		innerRef: re,
		hasPortalFromProps: !!y
	}, vT(o, se));
	return /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ (0, xw.createPortal)(ce, ae), P && /*#__PURE__*/ b.createElement(jw, {
		cursor: h,
		tooltipEventType: E,
		coordinate: j,
		payload: F,
		index: O
	}));
}
// analytics/node_modules/recharts/es6/component/Cell.js
var ST = (e) => null;
ST.displayName = "Cell";
// analytics/node_modules/recharts/es6/util/LRUCache.js
function CT(e, t, n) {
	return (t = wT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function wT(e) {
	var t = TT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function TT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var ET = class {
	constructor(e) {
		CT(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = e;
	}
	get(e) {
		var t = this.cache.get(e);
		return t !== void 0 && (this.cache.delete(e), this.cache.set(e, t)), t;
	}
	set(e, t) {
		if (this.cache.has(e)) this.cache.delete(e);
		else if (this.cache.size >= this.maxSize) {
			var n = this.cache.keys().next().value;
			n != null && this.cache.delete(n);
		}
		this.cache.set(e, t);
	}
	clear() {
		this.cache.clear();
	}
	size() {
		return this.cache.size;
	}
};
// analytics/node_modules/recharts/es6/util/DOMUtils.js
function DT(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function OT(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? DT(Object(n), !0).forEach(function(t) {
			kT(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : DT(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function kT(e, t, n) {
	return (t = AT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function AT(e) {
	var t = jT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function jT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var MT = OT({}, {
	cacheSize: 2e3,
	enableCache: !0
}), NT = new ET(MT.cacheSize), PT = {
	position: "absolute",
	top: "-20000px",
	left: 0,
	padding: 0,
	margin: 0,
	border: "none",
	whiteSpace: "pre"
}, FT = "recharts_measurement_span";
function IT(e, t) {
	return `${e}|${t.fontSize || ""}|${t.fontFamily || ""}|${t.fontWeight || ""}|${t.fontStyle || ""}|${t.letterSpacing || ""}|${t.textTransform || ""}`;
}
var LT = (e, t) => {
	try {
		var n = document.getElementById(FT);
		n || (n = document.createElement("span"), n.setAttribute("id", FT), n.setAttribute("aria-hidden", "true"), document.body.appendChild(n)), Object.assign(n.style, PT, t), n.textContent = `${e}`;
		var r = n.getBoundingClientRect();
		return {
			width: r.width,
			height: r.height
		};
	} catch {
		return {
			width: 0,
			height: 0
		};
	}
}, RT = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (e == null || Rl.isSsr) return {
		width: 0,
		height: 0
	};
	if (!MT.enableCache) return LT(e, t);
	var n = IT(e, t), r = NT.get(n);
	if (r) return r;
	var i = LT(e, t);
	return NT.set(n, i), i;
}, zT;
function BT(e, t) {
	return GT(e) || WT(e, t) || HT(e, t) || VT();
}
function VT() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function HT(e, t) {
	if (e) {
		if (typeof e == "string") return UT(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? UT(e, t) : void 0;
	}
}
function UT(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function WT(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function GT(e) {
	if (Array.isArray(e)) return e;
}
function KT(e, t, n) {
	return (t = qT(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function qT(e) {
	var t = JT(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function JT(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var YT = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, XT = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, ZT = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, QT = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, $T = {
	cm: 96 / 2.54,
	mm: 96 / 25.4,
	pt: 96 / 72,
	pc: 16,
	in: 96,
	Q: 96 / 101.6,
	px: 1
}, eE = [
	"cm",
	"mm",
	"pt",
	"pc",
	"in",
	"Q",
	"px"
];
function tE(e) {
	return eE.includes(e);
}
var nE = "NaN";
function rE(e, t) {
	return e * $T[t];
}
var iE = class e {
	static parse(t) {
		var n = BT(QT.exec(t) ?? [], 3), r = n[1], i = n[2];
		return r == null ? e.NaN : new e(parseFloat(r), i ?? "");
	}
	constructor(e, t) {
		this.num = e, this.unit = t, this.num = e, this.unit = t, Te(e) && (this.unit = ""), t !== "" && !ZT.test(t) && (this.num = NaN, this.unit = ""), tE(t) && (this.num = rE(e, t), this.unit = "px");
	}
	add(t) {
		return this.unit === t.unit ? new e(this.num + t.num, this.unit) : new e(NaN, "");
	}
	subtract(t) {
		return this.unit === t.unit ? new e(this.num - t.num, this.unit) : new e(NaN, "");
	}
	multiply(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num * t.num, this.unit || t.unit);
	}
	divide(t) {
		return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new e(NaN, "") : new e(this.num / t.num, this.unit || t.unit);
	}
	toString() {
		return `${this.num}${this.unit}`;
	}
	isNaN() {
		return Te(this.num);
	}
};
zT = iE, KT(iE, "NaN", new zT(NaN, ""));
function aE(e) {
	if (e == null || e.includes(nE)) return nE;
	for (var t = e; t.includes("*") || t.includes("/");) {
		var n = BT(YT.exec(t) ?? [], 4), r = n[1], i = n[2], a = n[3], o = iE.parse(r ?? ""), s = iE.parse(a ?? ""), c = i === "*" ? o.multiply(s) : o.divide(s);
		if (c.isNaN()) return nE;
		t = t.replace(YT, c.toString());
	}
	for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t);) {
		var l = BT(XT.exec(t) ?? [], 4), u = l[1], d = l[2], f = l[3], p = iE.parse(u ?? ""), m = iE.parse(f ?? ""), h = d === "+" ? p.add(m) : p.subtract(m);
		if (h.isNaN()) return nE;
		t = t.replace(XT, h.toString());
	}
	return t;
}
var oE = /\(([^()]*)\)/;
function sE(e) {
	for (var t = e, n; (n = oE.exec(t)) != null;) {
		var r = BT(n, 2)[1];
		t = t.replace(oE, aE(r));
	}
	return t;
}
function cE(e) {
	var t = e.replace(/\s+/g, "");
	return t = sE(t), t = aE(t), t;
}
function lE(e) {
	try {
		return cE(e);
	} catch {
		return nE;
	}
}
function uE(e) {
	var t = lE(e.slice(5, -1));
	return t === nE ? "" : t;
}
// analytics/node_modules/recharts/es6/component/Text.js
var dE = [
	"x",
	"y",
	"lineHeight",
	"capHeight",
	"fill",
	"scaleToFit",
	"textAnchor",
	"verticalAnchor"
], fE = [
	"dx",
	"dy",
	"angle",
	"className",
	"breakAll"
];
function pE() {
	return pE = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, pE.apply(null, arguments);
}
function mE(e, t) {
	if (e == null) return {};
	var n, r, i = hE(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function hE(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function gE(e, t) {
	return xE(e) || bE(e, t) || vE(e, t) || _E();
}
function _E() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function vE(e, t) {
	if (e) {
		if (typeof e == "string") return yE(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? yE(e, t) : void 0;
	}
}
function yE(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function bE(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function xE(e) {
	if (Array.isArray(e)) return e;
}
var SE = /[ \f\n\r\t\v\u2028\u2029]+/, CE = (e) => {
	var t = e.children, n = e.breakAll, r = e.style;
	try {
		var i = [];
		return Pe(t) || (i = n ? t.toString().split("") : t.toString().split(SE)), {
			wordsWithComputedWidth: i.map((e) => ({
				word: e,
				width: RT(e, r).width
			})),
			spaceWidth: n ? 0 : RT("\xA0", r).width
		};
	} catch {
		return null;
	}
};
function wE(e) {
	return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function TE(e) {
	return Pe(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var EE = (e, t, n, r) => e.reduce((e, i) => {
	var a = i.word, o = i.width, s = e[e.length - 1];
	if (s && o != null && (t == null || r || s.width + o + n < Number(t))) s.words.push(a), s.width += o + n;
	else {
		var c = {
			words: [a],
			width: o
		};
		e.push(c);
	}
	return e;
}, []), DE = (e) => e.reduce((e, t) => e.width > t.width ? e : t), OE = "…", kE = (e, t, n, r, i, a, o, s) => {
	var c = CE({
		breakAll: n,
		style: r,
		children: e.slice(0, t) + OE
	});
	if (!c) return [!1, []];
	var l = EE(c.wordsWithComputedWidth, a, o, s);
	return [l.length > i || DE(l).width > Number(a), l];
}, AE = (e, t, n, r, i) => {
	var a = e.maxLines, o = e.children, s = e.style, c = e.breakAll, l = z(a), u = String(o), d = EE(t, r, n, i);
	if (!l || i || !(d.length > a || DE(d).width > Number(r))) return d;
	for (var f = 0, p = u.length - 1, m = 0, h; f <= p && m <= u.length - 1;) {
		var g = Math.floor((f + p) / 2), _ = gE(kE(u, g - 1, c, s, a, r, n, i), 2), v = _[0], y = _[1], b = gE(kE(u, g, c, s, a, r, n, i), 1)[0];
		if (!v && !b && (f = g + 1), v && b && (p = g - 1), !v && b) {
			h = y;
			break;
		}
		m++;
	}
	return h || d;
}, jE = (e) => [{
	words: Pe(e) ? [] : e.toString().split(SE),
	width: void 0
}], ME = (e) => {
	var t = e.width, n = e.scaleToFit, r = e.children, i = e.style, a = e.breakAll, o = e.maxLines;
	if ((t || n) && !Rl.isSsr) {
		var s, c, l = CE({
			breakAll: a,
			children: r,
			style: i
		});
		if (l) {
			var u = l.wordsWithComputedWidth, d = l.spaceWidth;
			s = u, c = d;
		} else return jE(r);
		return AE({
			breakAll: a,
			children: r,
			maxLines: o,
			style: i
		}, s, c, t, !!n);
	}
	return jE(r);
}, NE = "#808080", PE = {
	angle: 0,
	breakAll: !1,
	capHeight: "0.71em",
	fill: NE,
	lineHeight: "1em",
	scaleToFit: !1,
	textAnchor: "start",
	verticalAnchor: "end",
	x: 0,
	y: 0
}, FE = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = tn(e, PE), r = n.x, i = n.y, a = n.lineHeight, o = n.capHeight, s = n.fill, c = n.scaleToFit, l = n.textAnchor, u = n.verticalAnchor, d = mE(n, dE), f = (0, b.useMemo)(() => ME({
		breakAll: d.breakAll,
		children: d.children,
		maxLines: d.maxLines,
		scaleToFit: c,
		style: d.style,
		width: d.width
	}), [
		d.breakAll,
		d.children,
		d.maxLines,
		c,
		d.style,
		d.width
	]), p = d.dx, m = d.dy, h = d.angle, g = d.className, _ = d.breakAll, v = mE(d, fE);
	if (!De(r) || !De(i) || f.length === 0) return null;
	var y = Number(r) + (z(p) ? p : 0), x = Number(i) + (z(m) ? m : 0);
	if (!K(y) || !K(x)) return null;
	var S;
	switch (u) {
		case "start":
			S = uE(`calc(${o})`);
			break;
		case "middle":
			S = uE(`calc(${(f.length - 1) / 2} * -${a} + (${o} / 2))`);
			break;
		default: S = uE(`calc(${f.length - 1} * -${a})`);
	}
	var C = [], w = f[0];
	if (c && w != null) {
		var T = w.width, E = d.width;
		C.push(`scale(${z(E) && z(T) ? E / T : 1})`);
	}
	return h && C.push(`rotate(${h}, ${y}, ${x})`), C.length && (v.transform = C.join(" ")), /*#__PURE__*/ b.createElement("text", pE({}, te(v), {
		ref: t,
		x: y,
		y: x,
		className: O("recharts-text", g),
		textAnchor: l,
		fill: s.includes("url") ? NE : s
	}), f.map((e, t) => {
		var n = e.words.join(_ ? "" : " ");
		return /*#__PURE__*/ b.createElement("tspan", {
			x: y,
			dy: t === 0 ? S : a,
			key: `${n}-${t}`
		}, n);
	}));
});
FE.displayName = "Text";
// analytics/node_modules/recharts/es6/component/Label.js
var IE = ["labelRef"], LE = ["content"];
function RE(e, t) {
	if (e == null) return {};
	var n, r, i = zE(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function zE(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function BE(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function VE(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? BE(Object(n), !0).forEach(function(t) {
			HE(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : BE(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function HE(e, t, n) {
	return (t = UE(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function UE(e) {
	var t = WE(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function WE(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function GE() {
	return GE = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, GE.apply(null, arguments);
}
var KE = /*#__PURE__*/ (0, b.createContext)(null), qE = (e) => {
	var t = e.x, n = e.y, r = e.upperWidth, i = e.lowerWidth, a = e.width, o = e.height, s = e.children, c = (0, b.useMemo)(() => ({
		x: t,
		y: n,
		upperWidth: r,
		lowerWidth: i,
		width: a,
		height: o
	}), [
		t,
		n,
		r,
		i,
		a,
		o
	]);
	return /*#__PURE__*/ b.createElement(KE.Provider, { value: c }, s);
}, JE = () => {
	var e = (0, b.useContext)(KE), t = Ic();
	return e || (t ? Re(t) : void 0);
}, YE = /*#__PURE__*/ (0, b.createContext)(null), XE = () => {
	var e = (0, b.useContext)(YE), t = V(jp);
	return e || t;
}, ZE = (e) => {
	var t = e.value, n = e.formatter, r = Pe(e.children) ? t : e.children;
	return typeof n == "function" ? n(r) : r;
}, QE = (e) => e != null && typeof e == "function", $E = (e, t) => we(t - e) * Math.min(Math.abs(t - e), 360), eD = (e, t, n, r, i) => {
	var a = e.offset, o = e.className, s = i.cx, c = i.cy, l = i.innerRadius, u = i.outerRadius, d = i.startAngle, f = i.endAngle, p = i.clockWise, m = (l + u) / 2, h = $E(d, f), g = h >= 0 ? 1 : -1, _, v;
	switch (t) {
		case "insideStart":
			_ = d + g * a, v = p;
			break;
		case "insideEnd":
			_ = f - g * a, v = !p;
			break;
		case "end":
			_ = f + g * a, v = p;
			break;
		default: throw Error(`Unsupported position ${t}`);
	}
	v = h <= 0 ? v : !v;
	var y = Xd(s, c, m, _), x = Xd(s, c, m, _ + (v ? 1 : -1) * 359), S = `M${y.x},${y.y}
    A${m},${m},0,1,${+!v},
    ${x.x},${x.y}`, C = Pe(e.id) ? ke("recharts-radial-line-") : e.id;
	return /*#__PURE__*/ b.createElement("text", GE({}, r, {
		dominantBaseline: "central",
		className: O("recharts-radial-bar-label", o)
	}), /*#__PURE__*/ b.createElement("defs", null, /*#__PURE__*/ b.createElement("path", {
		id: C,
		d: S
	})), /*#__PURE__*/ b.createElement("textPath", { xlinkHref: `#${C}` }, n));
}, tD = (e, t, n) => {
	var r = e.cx, i = e.cy, a = e.innerRadius, o = e.outerRadius, s = (e.startAngle + e.endAngle) / 2;
	if (n === "outside") {
		var c = Xd(r, i, o + t, s), l = c.x;
		return {
			x: l,
			y: c.y,
			textAnchor: l >= r ? "start" : "end",
			verticalAnchor: "middle"
		};
	}
	if (n === "center") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
	if (n === "centerTop") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "start"
	};
	if (n === "centerBottom") return {
		x: r,
		y: i,
		textAnchor: "middle",
		verticalAnchor: "end"
	};
	var u = Xd(r, i, (a + o) / 2, s);
	return {
		x: u.x,
		y: u.y,
		textAnchor: "middle",
		verticalAnchor: "middle"
	};
}, nD = (e) => e != null && "cx" in e && z(e.cx), rD = {
	angle: 0,
	offset: 5,
	zIndex: dp.label,
	position: "middle",
	textBreakAll: !1
};
function iD(e) {
	if (!nD(e)) return e;
	var t = e.cx, n = e.cy, r = e.outerRadius, i = r * 2;
	return {
		x: t - r,
		y: n - r,
		width: i,
		upperWidth: i,
		lowerWidth: i,
		height: i
	};
}
function aD(e) {
	var t = tn(e, rD), n = t.viewBox, r = t.parentViewBox, i = t.position, a = t.value, o = t.children, s = t.content, c = t.className, l = c === void 0 ? "" : c, u = t.textBreakAll, d = t.labelRef, f = XE(), p = JE(), m = n == null ? i === "center" ? p : f ?? p : nD(n) ? n : Re(n), h, g, _ = iD(m);
	if (!m || Pe(a) && Pe(o) && !/*#__PURE__*/ (0, b.isValidElement)(s) && typeof s != "function") return null;
	var v = nD(m) && (i === "insideStart" || i === "insideEnd" || i === "end");
	if (nD(m)) v || (g = tD(m, t.offset, t.position));
	else if (_) {
		var y = We({
			viewBox: _,
			position: i,
			offset: t.offset,
			parentViewBox: nD(r) ? void 0 : r,
			clamp: !0
		});
		g = VE(VE({
			x: y.x,
			y: y.y,
			textAnchor: y.horizontalAnchor,
			verticalAnchor: y.verticalAnchor
		}, y.width === void 0 ? {} : { width: y.width }), y.height === void 0 ? {} : { height: y.height });
	}
	var x = VE(VE(VE(VE({}, g?.x === void 0 ? {} : { x: g.x }), g?.y === void 0 ? {} : { y: g.y }), t), {}, { viewBox: m });
	if (/*#__PURE__*/ (0, b.isValidElement)(s)) {
		x.labelRef;
		var S = RE(x, IE);
		return /*#__PURE__*/ (0, b.cloneElement)(s, S);
	}
	if (typeof s == "function") {
		x.content;
		var C = RE(x, LE);
		if (h = /*#__PURE__*/ (0, b.createElement)(s, C), /*#__PURE__*/ (0, b.isValidElement)(h)) return h;
	} else h = ZE(t);
	var w = te(t);
	return v && nD(m) ? eD(t, i, h, w, m) : g == null ? null : /*#__PURE__*/ b.createElement(Sw, { zIndex: t.zIndex }, /*#__PURE__*/ b.createElement(FE, GE({
		ref: d,
		className: O("recharts-label", l)
	}, w, g, {
		textAnchor: wE(w.textAnchor) ? w.textAnchor : g.textAnchor,
		breakAll: u
	}), h));
}
aD.displayName = "Label";
var oD = (e, t, n) => {
	if (!e) return null;
	var r = {
		viewBox: t,
		labelRef: n
	};
	return e === !0 ? /*#__PURE__*/ b.createElement(aD, GE({ key: "label-implicit" }, r)) : De(e) ? /*#__PURE__*/ b.createElement(aD, GE({
		key: "label-implicit",
		value: e
	}, r)) : /*#__PURE__*/ (0, b.isValidElement)(e) ? e.type === aD ? /*#__PURE__*/ (0, b.cloneElement)(e, VE({ key: "label-implicit" }, r)) : /*#__PURE__*/ b.createElement(aD, GE({
		key: "label-implicit",
		content: e
	}, r)) : QE(e) ? /*#__PURE__*/ b.createElement(aD, GE({
		key: "label-implicit",
		content: e
	}, r)) : e && typeof e == "object" ? /*#__PURE__*/ b.createElement(aD, GE({}, e, { key: "label-implicit" }, r)) : null;
};
function sD(e) {
	var t = e.label, n = e.labelRef;
	return oD(t, JE(), n) || null;
}
// analytics/node_modules/recharts/es6/component/LabelList.js
var cD = ["valueAccessor"], lD = [
	"dataKey",
	"clockWise",
	"id",
	"textBreakAll",
	"zIndex"
];
function uD() {
	return uD = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, uD.apply(null, arguments);
}
function dD(e, t) {
	if (e == null) return {};
	var n, r, i = fD(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function fD(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var pD = (e) => {
	var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
	if (TE(t)) return t;
}, mD = /*#__PURE__*/ (0, b.createContext)(void 0), hD = mD.Provider, gD = /*#__PURE__*/ (0, b.createContext)(void 0);
gD.Provider;
function _D() {
	return (0, b.useContext)(mD);
}
function vD() {
	return (0, b.useContext)(gD);
}
function yD(e) {
	var t = e.valueAccessor, n = t === void 0 ? pD : t, r = dD(e, cD), i = r.dataKey;
	r.clockWise;
	var a = r.id, o = r.textBreakAll, s = r.zIndex, c = dD(r, lD), l = _D(), u = vD(), d = l || u;
	return !d || !d.length ? null : /*#__PURE__*/ b.createElement(Sw, { zIndex: s ?? dp.label }, /*#__PURE__*/ b.createElement(de, { className: "recharts-label-list" }, d.map((e, t) => {
		var s = Pe(i) ? n(e, t) : ds(e.payload, i), l = Pe(a) ? {} : { id: `${a}-${t}` };
		return /*#__PURE__*/ b.createElement(aD, uD({ key: `label-${t}` }, te(e), c, l, {
			fill: r.fill ?? e.fill,
			parentViewBox: e.parentViewBox,
			value: s,
			textBreakAll: o,
			viewBox: e.viewBox,
			index: t,
			zIndex: 0
		}));
	})));
}
yD.displayName = "LabelList";
function bD(e) {
	var t = e.label;
	return t ? t === !0 ? /*#__PURE__*/ b.createElement(yD, { key: "labelList-implicit" }) : /*#__PURE__*/ b.isValidElement(t) || QE(t) ? /*#__PURE__*/ b.createElement(yD, {
		key: "labelList-implicit",
		content: t
	}) : typeof t == "object" ? /*#__PURE__*/ b.createElement(yD, uD({ key: "labelList-implicit" }, t, { type: String(t.type) })) : null : null;
}
// analytics/node_modules/recharts/es6/shape/Dot.js
function xD() {
	return xD = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, xD.apply(null, arguments);
}
var SD = (e) => {
	var t = e.cx, n = e.cy, r = e.r, i = e.className, a = O("recharts-dot", i);
	return z(t) && z(n) && z(r) ? /*#__PURE__*/ b.createElement("circle", xD({}, N(e), qt(e), {
		className: a,
		cx: t,
		cy: n,
		r
	})) : null;
}, CD = lo({
	name: "polarAxis",
	initialState: {
		radiusAxis: {},
		angleAxis: {}
	},
	reducers: {
		addRadiusAxis(e, t) {
			e.radiusAxis[t.payload.id] = W(t.payload);
		},
		removeRadiusAxis(e, t) {
			delete e.radiusAxis[t.payload.id];
		},
		addAngleAxis(e, t) {
			e.angleAxis[t.payload.id] = W(t.payload);
		},
		removeAngleAxis(e, t) {
			delete e.angleAxis[t.payload.id];
		}
	}
}), wD = CD.actions;
wD.addRadiusAxis, wD.removeRadiusAxis, wD.addAngleAxis, wD.removeAngleAxis;
var TD = CD.reducer;
// analytics/node_modules/recharts/es6/util/getClassNameFromUnknown.js
function ED(e) {
	return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
// analytics/node_modules/react-is/cjs/react-is.production.js
var DD = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), d = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), p = Symbol.for("react.view_transition");
	function m(e) {
		if (typeof e == "object" && e) {
			var m = e.$$typeof;
			switch (m) {
				case t: switch (e = e.type, e) {
					case r:
					case a:
					case i:
					case l:
					case u:
					case p: return e;
					default: switch (e &&= e.$$typeof, e) {
						case s:
						case c:
						case f:
						case d: return e;
						case o: return e;
						default: return m;
					}
				}
				case n: return m;
			}
		}
	}
	e.isFragment = function(e) {
		return m(e) === r;
	};
})), OD = (/* @__PURE__ */ o(((e, t) => {
	t.exports = DD();
})))(), kD = (e) => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "", AD = null, jD = null, MD = (e) => {
	if (e === AD && Array.isArray(jD)) return jD;
	var t = [];
	return b.Children.forEach(e, (e) => {
		Pe(e) || ((0, OD.isFragment)(e) ? t = t.concat(MD(e.props.children)) : t.push(e));
	}), jD = t, AD = e, t;
};
function ND(e, t) {
	var n = [], r = [];
	return r = Array.isArray(t) ? t.map((e) => kD(e)) : [kD(t)], MD(e).forEach((e) => {
		var t = R(e, "type.displayName") || R(e, "type.name");
		t && r.indexOf(t) !== -1 && n.push(e);
	}), n;
}
var PD = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
// analytics/node_modules/recharts/es6/util/ActiveShapeUtils.js
function FD(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ID(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? FD(Object(n), !0).forEach(function(t) {
			LD(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : FD(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function LD(e, t, n) {
	return (t = RD(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function RD(e) {
	var t = zD(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function zD(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function BD(e, t) {
	return ID(ID({}, t), e);
}
function VD(e) {
	return /*#__PURE__*/ (0, b.isValidElement)(e) ? e.props : e;
}
function HD(e, t) {
	return /*#__PURE__*/ (0, b.cloneElement)(e, BD(VD(e), t));
}
function UD(e) {
	if ("index" in e) {
		var t = e.index;
		return typeof t == "number" || typeof t == "string" ? t : void 0;
	}
}
function WD(e) {
	return "isActive" in e && e.isActive === !0;
}
function GD(e) {
	var t = e.option, n = e.DefaultShape, r = e.shapeProps, i = e.activeClassName, a = i === void 0 ? "recharts-active-shape" : i, o = e.inActiveClassName, s = o === void 0 ? "recharts-shape" : o, c = UD(r), l = /*#__PURE__*/ (0, b.isValidElement)(t) ? HD(t, r) : t === n ? /*#__PURE__*/ b.createElement(n, r) : typeof t == "function" ? t(r, c) : typeof t == "object" ? /*#__PURE__*/ b.createElement(n, BD(t, r)) : /*#__PURE__*/ b.createElement(n, r);
	return WD(r) ? /*#__PURE__*/ b.createElement(de, { className: a }, l) : /*#__PURE__*/ b.createElement(de, { className: s }, l);
}
// analytics/node_modules/recharts/es6/context/tooltipContext.js
var KD = (e, t, n) => {
	var r = br();
	return (i, a) => (o) => {
		e?.(i, a, o), r(uS({
			activeIndex: String(a),
			activeDataKey: t,
			activeCoordinate: i.tooltipPosition,
			activeGraphicalItemId: n
		}));
	};
}, qD = (e) => {
	var t = br();
	return (n, r) => (i) => {
		e?.(n, r, i), t(dS());
	};
}, JD = (e, t, n) => {
	var r = br();
	return (i, a) => (o) => {
		e?.(i, a, o), r(pS({
			activeIndex: String(a),
			activeDataKey: t,
			activeCoordinate: i.tooltipPosition,
			activeGraphicalItemId: n
		}));
	};
};
// analytics/node_modules/recharts/es6/state/SetTooltipEntrySettings.js
function YD(e) {
	var t = e.tooltipEntrySettings, n = br(), r = ec(), i = (0, b.useRef)(null);
	return (0, b.useLayoutEffect)(() => {
		r || (i.current === null ? n(oS(t)) : i.current !== t && n(sS({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		t,
		n,
		r
	]), (0, b.useLayoutEffect)(() => () => {
		i.current &&= (n(cS(i.current)), null);
	}, [n]), null;
}
// analytics/node_modules/recharts/es6/state/SetLegendPayload.js
function XD(e) {
	var t = e.legendPayload, n = br(), r = ec(), i = (0, b.useRef)(null);
	return (0, b.useLayoutEffect)(() => {
		r || (i.current === null ? n(Jc(t)) : i.current !== t && n(Yc({
			prev: i.current,
			next: t
		})), i.current = t);
	}, [
		n,
		r,
		t
	]), (0, b.useLayoutEffect)(() => () => {
		i.current &&= (n(Xc(i.current)), null);
	}, [n]), null;
}
// analytics/node_modules/recharts/es6/animation/matchBy.js
function ZD(e, t) {
	return nO(e) || tO(e, t) || $D(e, t) || QD();
}
function QD() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function $D(e, t) {
	if (e) {
		if (typeof e == "string") return eO(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? eO(e, t) : void 0;
	}
}
function eO(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function tO(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function nO(e) {
	if (Array.isArray(e)) return e;
}
var rO = "index", iO = "append";
function aO(e, t) {
	var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [], r = [];
	for (var i of n) r.push({
		status: "removed",
		prev: i
	});
	for (var a = 0; a < t.length; a++) {
		var o = e[a], s = t[a];
		o == null ? r.push({
			status: "added",
			next: s
		}) : r.push({
			status: "matched",
			prev: o,
			next: s
		});
	}
	return r;
}
function oO(e, t) {
	var n = e.length / t.length;
	return aO(t.map((t, r) => e[Math.floor(r * n)]), t);
}
function sO(e, t) {
	return aO(t.map((t, n) => e[n]), t);
}
function cO(e, t) {
	for (var n = /* @__PURE__ */ new Map(), r = 0; r < e.length; r++) {
		var i = e[r];
		if (i != null) {
			var a = t(i, r);
			a != null && !n.has(a) && n.set(a, i);
		}
	}
	return n;
}
function lO(e, t, n) {
	var r = cO(e, n), i = /* @__PURE__ */ new Set(), a = t.map((e, t) => {
		var a = n(e, t);
		if (a != null) {
			var o = r.get(a);
			if (o !== void 0) return i.add(a), o;
		}
	}), o = [];
	for (var s of r) {
		var c = ZD(s, 2), l = c[0], u = c[1];
		i.has(l) || o.push(u);
	}
	return aO(a, t, o);
}
function uO(e, t, n) {
	return t == null ? null : e == null ? t.map((e) => ({
		status: "added",
		next: e
	})) : n === "index" ? oO(e, t) : n === "append" ? sO(e, t) : lO(e, t, n);
}
// analytics/node_modules/recharts/es6/animation/useAnimationStartSnapshot.js
function dO(e, t) {
	var n = (0, b.useRef)(e), r = (0, b.useRef)(t.current), i = (0, b.useRef)(!0);
	n.current !== e && (n.current = e, r.current = t.current, i.current = !1);
	var a = (0, b.useCallback)(function(e, n) {
		var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
		n === 0 ? i.current = !0 : (n === 1 && (r.current = e), n > 0 && i.current && a && (t.current = e));
	}, [t]);
	return {
		startValue: r.current,
		syncStepValue: a
	};
}
// analytics/node_modules/recharts/es6/animation/AnimatedItems.js
function fO(e, t) {
	return _O(e) || gO(e, t) || mO(e, t) || pO();
}
function pO() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function mO(e, t) {
	if (e) {
		if (typeof e == "string") return hO(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? hO(e, t) : void 0;
	}
}
function hO(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function gO(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function _O(e) {
	if (Array.isArray(e)) return e;
}
function vO(e, t) {
	var n = fO((0, b.useState)(!1), 2), r = n[0], i = n[1];
	return {
		isAnimating: r,
		handleAnimationStart: (0, b.useCallback)(() => {
			typeof e == "function" && e(), i(!0);
		}, [e]),
		handleAnimationEnd: (0, b.useCallback)(() => {
			typeof t == "function" && t(), i(!1);
		}, [t])
	};
}
function yO(e) {
	var t = e.animationInput, n = e.animationIdPrefix, r = e.items, i = e.previousItemsRef, a = e.isAnimationActive, o = e.animationBegin, s = e.animationDuration, c = e.animationEasing, l = e.onAnimationStart, u = e.onAnimationEnd, d = e.animationInterpolateFn, f = e.animationMatchBy, p = e.shouldUpdatePreviousRef, m = e.children, h = e.layout, g = ud(t, n), _ = dO(g, i), v = _.startValue ?? null, y = uO(v, r, f ?? rO);
	return /*#__PURE__*/ b.createElement(ld, {
		animationId: g,
		begin: o,
		duration: s,
		isActive: a,
		easing: c,
		onAnimationEnd: u,
		onAnimationStart: l,
		key: g
	}, (e) => {
		var t = v == null, n = r == null ? r : d(y, e, h), i = p ? p(e) : e > 0;
		return _.syncStepValue(n, e, i), n == null ? null : m(n, e, t);
	});
}
function bO(e, t) {
	return TO(e) || wO(e, t) || SO(e, t) || xO();
}
function xO() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function SO(e, t) {
	if (e) {
		if (typeof e == "string") return CO(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? CO(e, t) : void 0;
	}
}
function CO(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function wO(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function TO(e) {
	if (Array.isArray(e)) return e;
}
var EO = b.useId ?? (() => bO(b.useState(() => ke("uid-")), 1)[0]);
// analytics/node_modules/recharts/es6/util/useUniqueId.js
function DO(e, t) {
	var n = EO();
	return t || (e ? `${e}-${n}` : n);
}
// analytics/node_modules/recharts/es6/context/RegisterGraphicalItemId.js
var OO = /*#__PURE__*/ (0, b.createContext)(void 0), kO = (e) => {
	var t = e.id, n = e.type, r = e.children, i = DO(`recharts-${n}`, t);
	return /*#__PURE__*/ b.createElement(OO.Provider, { value: i }, r(i));
}, AO = lo({
	name: "graphicalItems",
	initialState: {
		cartesianItems: [],
		polarItems: []
	},
	reducers: {
		addCartesianGraphicalItem: {
			reducer(e, t) {
				e.cartesianItems.push(W(t.payload));
			},
			prepare: Ja()
		},
		replaceCartesianGraphicalItem: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next, a = Pa(e).cartesianItems.indexOf(W(r));
				a > -1 && (e.cartesianItems[a] = W(i));
			},
			prepare: Ja()
		},
		removeCartesianGraphicalItem: {
			reducer(e, t) {
				var n = Pa(e).cartesianItems.indexOf(W(t.payload));
				n > -1 && e.cartesianItems.splice(n, 1);
			},
			prepare: Ja()
		},
		addPolarGraphicalItem: {
			reducer(e, t) {
				e.polarItems.push(W(t.payload));
			},
			prepare: Ja()
		},
		removePolarGraphicalItem: {
			reducer(e, t) {
				var n = Pa(e).polarItems.indexOf(W(t.payload));
				n > -1 && e.polarItems.splice(n, 1);
			},
			prepare: Ja()
		},
		replacePolarGraphicalItem: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next, a = Pa(e).polarItems.indexOf(W(r));
				a > -1 && (e.polarItems[a] = W(i));
			},
			prepare: Ja()
		}
	}
}), jO = AO.actions, MO = jO.addCartesianGraphicalItem, NO = jO.replaceCartesianGraphicalItem, PO = jO.removeCartesianGraphicalItem;
jO.addPolarGraphicalItem, jO.removePolarGraphicalItem, jO.replacePolarGraphicalItem;
var FO = AO.reducer, IO = /*#__PURE__*/ (0, b.memo)((e) => {
	var t = br(), n = (0, b.useRef)(null);
	return (0, b.useLayoutEffect)(() => {
		n.current === null ? t(MO(e)) : n.current !== e && t(NO({
			prev: n.current,
			next: e
		})), n.current = e;
	}, [t, e]), (0, b.useLayoutEffect)(() => () => {
		n.current &&= (t(PO(n.current)), null);
	}, [t]), null;
}), LO = ["points"];
function RO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function zO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? RO(Object(n), !0).forEach(function(t) {
			BO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : RO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function BO(e, t, n) {
	return (t = VO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function VO(e) {
	var t = HO(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function HO(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function UO() {
	return UO = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, UO.apply(null, arguments);
}
function WO(e, t) {
	if (e == null) return {};
	var n, r, i = GO(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function GO(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function KO(e) {
	var t = e.option, n = e.dotProps, r = e.className;
	if (/*#__PURE__*/ (0, b.isValidElement)(t)) return /*#__PURE__*/ (0, b.cloneElement)(t, n);
	if (typeof t == "function") return t(n);
	var i = O(r, typeof t == "boolean" ? "" : t.className), a = n ?? {};
	a.points;
	var o = WO(a, LO);
	return /*#__PURE__*/ b.createElement(SD, UO({}, o, { className: i }));
}
function qO(e, t) {
	return e == null ? !1 : t ? !0 : e.length === 1;
}
function JO(e) {
	var t = e.points, n = e.dot, r = e.className, i = e.dotClassName, a = e.dataKey, o = e.baseProps, s = e.needClip, c = e.clipPathId, l = e.zIndex, u = l === void 0 ? dp.scatter : l;
	if (!qO(t, n)) return null;
	var d = PD(n), f = ne(n), p = t.map((e, r) => {
		var s = zO(zO(zO({ r: 3 }, o), f), {}, {
			index: r,
			cx: e.x ?? void 0,
			cy: e.y ?? void 0,
			dataKey: a,
			value: e.value,
			payload: e.payload,
			points: t
		});
		return /*#__PURE__*/ b.createElement(KO, {
			key: `dot-${r}`,
			option: n,
			dotProps: s,
			className: i
		});
	}), m = {};
	return s && c != null && (m.clipPath = `url(#clipPath-${d ? "" : "dots-"}${c})`), /*#__PURE__*/ b.createElement(Sw, { zIndex: u }, /*#__PURE__*/ b.createElement(de, UO({ className: r }, m), p));
}
// analytics/node_modules/recharts/es6/state/cartesianAxisSlice.js
function YO(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function XO(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? YO(Object(n), !0).forEach(function(t) {
			ZO(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : YO(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function ZO(e, t, n) {
	return (t = QO(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function QO(e) {
	var t = $O(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function $O(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var ek = lo({
	name: "cartesianAxis",
	initialState: {
		xAxis: {},
		yAxis: {},
		zAxis: {}
	},
	reducers: {
		addXAxis: {
			reducer(e, t) {
				e.xAxis[t.payload.id] = W(t.payload);
			},
			prepare: Ja()
		},
		replaceXAxis: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next;
				e.xAxis[r.id] !== void 0 && (r.id !== i.id && delete e.xAxis[r.id], e.xAxis[i.id] = W(i));
			},
			prepare: Ja()
		},
		removeXAxis: {
			reducer(e, t) {
				delete e.xAxis[t.payload.id];
			},
			prepare: Ja()
		},
		addYAxis: {
			reducer(e, t) {
				e.yAxis[t.payload.id] = W(t.payload);
			},
			prepare: Ja()
		},
		replaceYAxis: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next;
				e.yAxis[r.id] !== void 0 && (r.id !== i.id && delete e.yAxis[r.id], e.yAxis[i.id] = W(i));
			},
			prepare: Ja()
		},
		removeYAxis: {
			reducer(e, t) {
				delete e.yAxis[t.payload.id];
			},
			prepare: Ja()
		},
		addZAxis: {
			reducer(e, t) {
				e.zAxis[t.payload.id] = W(t.payload);
			},
			prepare: Ja()
		},
		replaceZAxis: {
			reducer(e, t) {
				var n = t.payload, r = n.prev, i = n.next;
				e.zAxis[r.id] !== void 0 && (r.id !== i.id && delete e.zAxis[r.id], e.zAxis[i.id] = W(i));
			},
			prepare: Ja()
		},
		removeZAxis: {
			reducer(e, t) {
				delete e.zAxis[t.payload.id];
			},
			prepare: Ja()
		},
		updateYAxisWidth(e, t) {
			var n = t.payload, r = n.id, i = n.width, a = e.yAxis[r];
			if (a) {
				var o = a.widthHistory || [];
				if (o.length === 3 && o[0] === o[2] && i === o[1] && i !== a.width && Math.abs(i - (o[0] ?? 0)) <= 1) return;
				var s = [...o, i].slice(-3);
				e.yAxis[r] = XO(XO({}, a), {}, {
					width: i,
					widthHistory: s
				});
			}
		},
		updateXAxisHeight(e, t) {
			var n = t.payload, r = n.id, i = n.height, a = e.xAxis[r];
			if (a) {
				var o = a.heightHistory || [];
				if (o.length === 3 && o[0] === o[2] && i === o[1] && i !== a.height && Math.abs(i - (o[0] ?? 0)) <= 1) return;
				var s = [...o, i].slice(-3);
				e.xAxis[r] = XO(XO({}, a), {}, {
					height: i,
					heightHistory: s
				});
			}
		}
	}
}), tk = ek.actions, nk = tk.addXAxis, rk = tk.replaceXAxis, ik = tk.removeXAxis, ak = tk.addYAxis, ok = tk.replaceYAxis, sk = tk.removeYAxis;
tk.addZAxis, tk.replaceZAxis, tk.removeZAxis;
var ck = tk.updateYAxisWidth, lk = tk.updateXAxisHeight, uk = ek.reducer, dk = H([
	H([Xs], (e) => ({
		top: e.top,
		bottom: e.bottom,
		left: e.left,
		right: e.right
	})),
	Ns,
	Ps
], (e, t, n) => {
	if (e && t != null && n != null) return {
		x: e.left,
		y: e.top,
		width: Math.max(0, t - e.left - e.right),
		height: Math.max(0, n - e.top - e.bottom)
	};
}), fk = () => V(dk), pk = () => V(wC);
// analytics/node_modules/recharts/es6/component/ActivePoints.js
function mk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function hk(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? mk(Object(n), !0).forEach(function(t) {
			gk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : mk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function gk(e, t, n) {
	return (t = _k(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function _k(e) {
	var t = vk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function vk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var yk = (e) => {
	var t = e.point, n = e.childIndex, r = e.mainColor, i = e.activeDot, a = e.dataKey, o = e.clipPath;
	if (i === !1 || t.x == null || t.y == null) return null;
	var s = hk(hk(hk({}, {
		index: n,
		dataKey: a,
		cx: t.x,
		cy: t.y,
		r: 4,
		fill: r ?? "none",
		strokeWidth: 2,
		stroke: "#fff",
		payload: t.payload,
		value: t.value
	}), P(i)), qt(i)), c = /*#__PURE__*/ (0, b.isValidElement)(i) ? /*#__PURE__*/ (0, b.cloneElement)(i, s) : typeof i == "function" ? i(s) : /*#__PURE__*/ b.createElement(SD, s);
	return /*#__PURE__*/ b.createElement(de, {
		className: "recharts-active-dot",
		clipPath: o
	}, c);
};
function bk(e) {
	var t = e.points, n = e.mainColor, r = e.activeDot, i = e.itemDataKey, a = e.clipPath, o = e.zIndex, s = o === void 0 ? dp.activeDot : o, c = V(_C), l = pk();
	if (t == null || l == null) return null;
	var u = t.find((e) => l.includes(e.payload));
	return Pe(u) ? null : /*#__PURE__*/ b.createElement(Sw, { zIndex: s }, /*#__PURE__*/ b.createElement(yk, {
		point: u,
		childIndex: Number(c),
		mainColor: n,
		dataKey: i,
		activeDot: r,
		clipPath: a
	}));
}
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineBarSizeList.js
function xk(e, t) {
	return Ek(e) || Tk(e, t) || Ck(e, t) || Sk();
}
function Sk() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Ck(e, t) {
	if (e) {
		if (typeof e == "string") return wk(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? wk(e, t) : void 0;
	}
}
function wk(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Tk(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function Ek(e) {
	if (Array.isArray(e)) return e;
}
var Dk = (e, t, n) => {
	var r = n ?? e;
	if (!Pe(r)) return Ae(r, t, 0);
}, Ok = (e, t, n) => {
	var r = {}, i = e.filter(Ip), a = e.filter((e) => e.stackId == null), o = i.reduce((e, t) => {
		var n = e[t.stackId];
		return n ??= [], n.push(t), e[t.stackId] = n, e;
	}, r), s = Object.entries(o).map((e) => {
		var r = xk(e, 2), i = r[0], a = r[1];
		return {
			stackId: i,
			dataKeys: a.map((e) => e.dataKey),
			barSize: Dk(t, n, a[0]?.barSize)
		};
	}), c = a.map((e) => ({
		stackId: void 0,
		dataKeys: [e.dataKey].filter((e) => e != null),
		barSize: Dk(t, n, e.barSize)
	}));
	return [...s, ...c];
};
// analytics/node_modules/recharts/es6/state/selectors/combiners/combineAllBarPositions.js
function kk(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Ak(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? kk(Object(n), !0).forEach(function(t) {
			jk(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : kk(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function jk(e, t, n) {
	return (t = Mk(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Mk(e) {
	var t = Nk(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Nk(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Pk(e, t, n, r, i) {
	var a = r.length;
	if (!(a < 1)) {
		var o = Ae(e, n, 0, !0), s, c = [];
		if (K(r[0]?.barSize)) {
			var l = !1, u = n / a, d = r.reduce((e, t) => e + (t.barSize || 0), 0);
			d += (a - 1) * o, d >= n && (d -= (a - 1) * o, o = 0), d >= n && u > 0 && (l = !0, u *= .9, d = a * u);
			var f = {
				offset: Math.round((n - d) / 2) - o,
				size: 0
			};
			s = r.reduce((e, t) => {
				var n = {
					stackId: t.stackId,
					dataKeys: t.dataKeys,
					position: {
						offset: f.offset + f.size + o,
						size: l ? u : t.barSize ?? 0
					}
				}, r = [...e, n];
				return f = n.position, r;
			}, c);
		} else {
			var p = Ae(t, n, 0, !0);
			n - 2 * p - (a - 1) * o <= 0 && (o = 0);
			var m = (n - 2 * p - (a - 1) * o) / a;
			m > 1 && (m = Math.round(m));
			var h = K(i) ? Math.min(m, i) : m;
			s = r.reduce((e, t, n) => [...e, {
				stackId: t.stackId,
				dataKeys: t.dataKeys,
				position: {
					offset: p + a * (m - h) / 2 + (h + o) * n,
					size: h
				}
			}], c);
		}
		return s;
	}
}
var Fk = (e, t, n, r, i, a, o) => {
	var s = Pe(o) ? t : o, c = Pk(n, r, i === a ? a : i, e, s);
	return i !== a && c != null && (c = c.map((e) => Ak(Ak({}, e), {}, { position: Ak(Ak({}, e.position), {}, { offset: e.position.offset - i / 2 }) }))), c;
}, Ik = (e, t) => {
	var n = Pp(t);
	if (e && n != null && t != null) {
		var r = t.stackId;
		if (r != null) {
			var i = e[r];
			if (i) {
				var a = i.stackedData;
				if (a) return a.find((e) => e.key === n);
			}
		}
	}
}, Lk = (e, t) => {
	if (e != null && t != null) {
		var n = e.find((e) => e.stackId === t.stackId && t.dataKey != null && e.dataKeys.includes(t.dataKey));
		if (n != null) return n.position;
	}
};
// analytics/node_modules/recharts/es6/zIndex/getZIndexFromUnknown.js
function Rk(e, t) {
	return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && K(e.zIndex) ? e.zIndex : t;
}
// analytics/node_modules/recharts/es6/context/chartDataContext.js
var zk = (e) => {
	var t = e.chartData, n = br(), r = ec();
	return (0, b.useEffect)(() => r ? () => {} : (n(Gw(t)), () => {
		n(Gw(void 0));
	}), [
		t,
		n,
		r
	]), null;
}, Bk = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	padding: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
}, Vk = lo({
	name: "brush",
	initialState: Bk,
	reducers: { setBrushSettings(e, t) {
		return t.payload == null ? Bk : t.payload;
	} }
});
Vk.actions.setBrushSettings;
var Hk = Vk.reducer;
// analytics/node_modules/recharts/es6/util/CartesianUtils.js
function Uk(e) {
	return (e % 180 + 180) % 180;
}
var Wk = function(e) {
	var t = e.width, n = e.height, r = Uk(arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0) * Math.PI / 180, i = Math.atan(n / t), a = r > i && r < Math.PI - i ? n / Math.sin(r) : t / Math.cos(r);
	return Math.abs(a);
}, Gk = lo({
	name: "referenceElements",
	initialState: {
		dots: [],
		areas: [],
		lines: []
	},
	reducers: {
		addDot: (e, t) => {
			e.dots.push(t.payload);
		},
		removeDot: (e, t) => {
			var n = Pa(e).dots.findIndex((e) => e === t.payload);
			n !== -1 && e.dots.splice(n, 1);
		},
		addArea: (e, t) => {
			e.areas.push(t.payload);
		},
		removeArea: (e, t) => {
			var n = Pa(e).areas.findIndex((e) => e === t.payload);
			n !== -1 && e.areas.splice(n, 1);
		},
		addLine: (e, t) => {
			e.lines.push(W(t.payload));
		},
		removeLine: (e, t) => {
			var n = Pa(e).lines.findIndex((e) => e === t.payload);
			n !== -1 && e.lines.splice(n, 1);
		}
	}
}), Kk = Gk.actions;
Kk.addDot, Kk.removeDot, Kk.addArea, Kk.removeArea, Kk.addLine, Kk.removeLine;
var qk = Gk.reducer;
// analytics/node_modules/recharts/es6/container/ClipPathProvider.js
function Jk(e, t) {
	return $k(e) || Qk(e, t) || Xk(e, t) || Yk();
}
function Yk() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function Xk(e, t) {
	if (e) {
		if (typeof e == "string") return Zk(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Zk(e, t) : void 0;
	}
}
function Zk(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Qk(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function $k(e) {
	if (Array.isArray(e)) return e;
}
var eA = /*#__PURE__*/ (0, b.createContext)(void 0), tA = (e) => {
	var t = e.children, n = Jk((0, b.useState)(`${ke("recharts")}-clip`), 1)[0], r = fk();
	if (r == null) return null;
	var i = r.x, a = r.y, o = r.width, s = r.height;
	return /*#__PURE__*/ b.createElement(eA.Provider, { value: n }, /*#__PURE__*/ b.createElement("defs", null, /*#__PURE__*/ b.createElement("clipPath", { id: n }, /*#__PURE__*/ b.createElement("rect", {
		x: i,
		y: a,
		height: s,
		width: o
	}))), t);
};
// analytics/node_modules/es-toolkit/dist/function/noop.mjs
function nA() {}
// analytics/node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function rA(e) {
	if (!e || typeof e != "object") return !1;
	let t = Object.getPrototypeOf(e);
	return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null ? !1 : Object.prototype.toString.call(e) === "[object Object]";
}
// analytics/node_modules/es-toolkit/dist/compat/_internal/baseIsEqualWith.mjs
function iA(e, t, n) {
	return aA(e, t, void 0, void 0, void 0, void 0, n);
}
function aA(e, t, n, r, i, a, o) {
	let s = o(e, t, n, r, i, a);
	if (s !== void 0) return s;
	if (typeof e == typeof t) switch (typeof e) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return e === t;
		case "number": return e === t || Object.is(e, t);
		case "function": return e === t;
		case "object": return oA(e, t, a, o);
	}
	return oA(e, t, a, o);
}
function oA(e, t, n, r) {
	if (Object.is(e, t)) return !0;
	let i = un(e), a = un(t);
	if (i === "[object Arguments]" && (i = Cn), a === "[object Arguments]" && (a = Cn), i !== a) return !1;
	switch (i) {
		case fn: return e.toString() === t.toString();
		case pn: return Ln(e.valueOf(), t.valueOf());
		case mn:
		case _n:
		case gn: return Object.is(e.valueOf(), t.valueOf());
		case dn: return e.source === t.source && e.flags === t.flags;
		case xn: return e === t;
	}
	n ??= /* @__PURE__ */ new Map();
	let o = n.get(e), s = n.get(t);
	if (o != null && s != null) return o === t;
	n.set(e, t), n.set(t, e);
	try {
		switch (i) {
			case vn:
				if (e.size !== t.size) return !1;
				for (let [i, a] of e.entries()) if (!t.has(i) || !aA(a, t.get(i), i, e, t, n, r)) return !1;
				return !0;
			case yn: {
				if (e.size !== t.size) return !1;
				let i = Array.from(e.values()), a = Array.from(t.values());
				for (let o = 0; o < i.length; o++) {
					let s = i[o], c = a.findIndex((i) => aA(s, i, void 0, e, t, n, r));
					if (c === -1) return !1;
					a.splice(c, 1);
				}
				return !0;
			}
			case bn:
			case En:
			case Dn:
			case On:
			case kn:
			case An:
			case jn:
			case Mn:
			case Nn:
			case Pn:
			case Fn:
			case In:
				if (Jn(e) !== Jn(t) || e.length !== t.length) return !1;
				for (let i = 0; i < e.length; i++) if (!aA(e[i], t[i], i, e, t, n, r)) return !1;
				return !0;
			case Sn: return e.byteLength === t.byteLength && oA(new Uint8Array(e), new Uint8Array(t), n, r);
			case Tn: return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : oA(new Uint8Array(e), new Uint8Array(t), n, r);
			case wn: return e.name === t.name && e.message === t.message;
			case Cn: {
				if (!(oA(e.constructor, t.constructor, n, r) || rA(e) && rA(t))) return !1;
				let i = [...Object.keys(e), ...Kn(e)], a = [...Object.keys(t), ...Kn(t)];
				if (i.length !== a.length) return !1;
				for (let a = 0; a < i.length; a++) {
					let o = i[a], s = e[o];
					if (!me(t, o)) return !1;
					let c = t[o];
					if (!aA(s, c, o, e, t, n, r)) return !1;
				}
				return !0;
			}
			default: return !1;
		}
	} finally {
		n.delete(e), n.delete(t);
	}
}
// analytics/node_modules/es-toolkit/dist/compat/predicate/isEqual.mjs
function sA(e, t) {
	return iA(e, t, nA);
}
// analytics/node_modules/recharts/es6/util/getEveryNth.js
function cA(e, t) {
	if (t < 1) return [];
	if (t === 1) return e;
	for (var n = [], r = 0; r < e.length; r += t) {
		var i = e[r];
		i !== void 0 && n.push(i);
	}
	return n;
}
// analytics/node_modules/recharts/es6/util/TickUtils.js
function lA(e, t, n) {
	return Wk({
		width: e.width + t.width,
		height: e.height + t.height
	}, n);
}
function uA(e, t, n) {
	var r = n === "width", i = e.x, a = e.y, o = e.width, s = e.height;
	return t === 1 ? {
		start: r ? i : a,
		end: r ? i + o : a + s
	} : {
		start: r ? i + o : a + s,
		end: r ? i : a
	};
}
function dA(e, t, n, r, i) {
	if (e * t < e * r || e * t > e * i) return !1;
	var a = n();
	return e * (t - e * a / 2 - r) >= 0 && e * (t + e * a / 2 - i) <= 0;
}
function fA(e, t) {
	return cA(e, t + 1);
}
// analytics/node_modules/recharts/es6/cartesian/getEquidistantTicks.js
function pA(e, t, n, r, i) {
	for (var a = (r || []).slice(), o = t.start, s = t.end, c = 0, l = 1, u = o, d = function() {
		var t = r?.[c];
		if (t === void 0) return { v: cA(r, l) };
		var a = c, d, f = () => (d === void 0 && (d = n(t, a)), d), p = t.coordinate, m = c === 0 || dA(e, p, f, u, s);
		m || (c = 0, u = o, l += 1), m && (u = p + e * (f() / 2 + i), c += l);
	}, f; l <= a.length;) if (f = d(), f) return f.v;
	return [];
}
function mA(e, t, n, r, i) {
	var a = (r || []).slice().length;
	if (a === 0) return [];
	for (var o = t.start, s = t.end, c = 1; c <= a; c++) {
		for (var l = (a - 1) % c, u = o, d = !0, f = function() {
			var t = r[m];
			if (t == null) return 0;
			var a = m, o, c = () => (o === void 0 && (o = n(t, a)), o), f = t.coordinate, p = m === l || dA(e, f, c, u, s);
			if (!p) return d = !1, 1;
			p && (u = f + e * (c() / 2 + i));
		}, p, m = l; m < a && (p = f(), p === 0 || p !== 1); m += c);
		if (d) {
			for (var h = [], g = l; g < a; g += c) {
				var _ = r[g];
				_ != null && h.push(_);
			}
			return h;
		}
	}
	return [];
}
// analytics/node_modules/recharts/es6/cartesian/getTicks.js
function hA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function gA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? hA(Object(n), !0).forEach(function(t) {
			_A(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : hA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function _A(e, t, n) {
	return (t = vA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function vA(e) {
	var t = yA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function yA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function bA(e, t, n, r, i) {
	for (var a = (r || []).slice(), o = a.length, s = t.start, c = t.end, l = function(t) {
		var r = a[t];
		if (r == null) return 1;
		var l = r, u, d = () => (u === void 0 && (u = n(r, t)), u);
		if (t === o - 1) {
			var f = e * (l.coordinate + e * d() / 2 - c);
			a[t] = l = gA(gA({}, l), {}, { tickCoord: f > 0 ? l.coordinate - f * e : l.coordinate });
		} else a[t] = l = gA(gA({}, l), {}, { tickCoord: l.coordinate });
		l.tickCoord != null && dA(e, l.tickCoord, d, s, c) && (c = l.tickCoord - e * (d() / 2 + i), a[t] = gA(gA({}, l), {}, { isShow: !0 }));
	}, u = o - 1; u >= 0; u--) if (l(u)) continue;
	return a;
}
function xA(e, t, n, r, i, a) {
	var o = (r || []).slice(), s = o.length, c = t.start, l = t.end;
	if (a) {
		var u = r[s - 1];
		if (u != null) {
			var d = n(u, s - 1), f = e * (u.coordinate + e * d / 2 - l);
			o[s - 1] = u = gA(gA({}, u), {}, { tickCoord: f > 0 ? u.coordinate - f * e : u.coordinate }), u.tickCoord != null && dA(e, u.tickCoord, () => d, c, l) && (l = u.tickCoord - e * (d / 2 + i), o[s - 1] = gA(gA({}, u), {}, { isShow: !0 }));
		}
	}
	for (var p = a ? s - 1 : s, m = function(t) {
		var r = o[t];
		if (r == null) return 1;
		var a = r, s, u = () => (s === void 0 && (s = n(r, t)), s);
		if (t === 0) {
			var d = e * (a.coordinate - e * u() / 2 - c);
			o[t] = a = gA(gA({}, a), {}, { tickCoord: d < 0 ? a.coordinate - d * e : a.coordinate });
		} else o[t] = a = gA(gA({}, a), {}, { tickCoord: a.coordinate });
		a.tickCoord != null && dA(e, a.tickCoord, u, c, l) && (c = a.tickCoord + e * (u() / 2 + i), o[t] = gA(gA({}, a), {}, { isShow: !0 }));
	}, h = 0; h < p; h++) if (m(h)) continue;
	return o;
}
function SA(e, t, n) {
	var r = e.tick, i = e.ticks, a = e.viewBox, o = e.minTickGap, s = e.orientation, c = e.interval, l = e.tickFormatter, u = e.unit, d = e.angle;
	if (!i || !i.length || !r) return [];
	if (z(c) || Rl.isSsr) return fA(i, z(c) ? c : 0) ?? [];
	var f = [], p = s === "top" || s === "bottom" ? "width" : "height", m = u && p === "width" ? RT(u, {
		fontSize: t,
		letterSpacing: n
	}) : {
		width: 0,
		height: 0
	}, h = (e, r) => {
		var i = typeof l == "function" ? l(e.value, r) : e.value;
		return p === "width" ? lA(RT(i, {
			fontSize: t,
			letterSpacing: n
		}), m, d) : RT(i, {
			fontSize: t,
			letterSpacing: n
		})[p];
	}, g = i[0], _ = i[1], v = i.length >= 2 && g != null && _ != null ? we(_.coordinate - g.coordinate) : 1, y = uA(a, v, p);
	return c === "equidistantPreserveStart" ? pA(v, y, h, i, o) : c === "equidistantPreserveEnd" ? mA(v, y, h, i, o) : (f = c === "preserveStart" || c === "preserveStartEnd" ? xA(v, y, h, i, o, c === "preserveStartEnd") : bA(v, y, h, i, o), f.filter((e) => e.isShow));
}
// analytics/node_modules/recharts/es6/util/YAxisUtils.js
var CA = (e) => {
	var t = e.ticks, n = e.label, r = e.labelGapWithTick, i = r === void 0 ? 5 : r, a = e.tickSize, o = a === void 0 ? 0 : a, s = e.tickMargin, c = s === void 0 ? 0 : s, l = 0;
	if (t) {
		Array.from(t).forEach((e) => {
			if (e) {
				var t = e.getBoundingClientRect();
				t.width > l && (l = t.width);
			}
		});
		var u = n ? n.getBoundingClientRect().width : 0, d = o + c, f = l + d + u + (n ? i : 0);
		return Math.round(f);
	}
	return 0;
}, wA = (e) => {
	var t = e.ticks, n = e.label, r = e.labelGapWithTick, i = r === void 0 ? 5 : r, a = e.tickSize, o = a === void 0 ? 0 : a, s = e.tickMargin, c = s === void 0 ? 0 : s, l = 0;
	if (t) {
		Array.from(t).forEach((e) => {
			if (e) {
				var t = e.getBoundingClientRect();
				t.height > l && (l = t.height);
			}
		});
		var u = n ? n.getBoundingClientRect().height : 0, d = o + c, f = l + d + u + (n ? i : 0);
		return Math.round(f);
	}
	return 0;
}, TA = lo({
	name: "renderedTicks",
	initialState: {
		xAxis: {},
		yAxis: {}
	},
	reducers: {
		setRenderedTicks: (e, t) => {
			var n = t.payload, r = n.axisType, i = n.axisId, a = n.ticks;
			e[r][i] = W(a);
		},
		removeRenderedTicks: (e, t) => {
			var n = t.payload, r = n.axisType, i = n.axisId;
			delete e[r][i];
		}
	}
}), EA = TA.actions, DA = EA.setRenderedTicks, OA = EA.removeRenderedTicks, kA = TA.reducer, AA = [
	"axisLine",
	"width",
	"height",
	"className",
	"hide",
	"ticks",
	"axisType",
	"axisId"
];
function jA(e, t) {
	return IA(e) || FA(e, t) || NA(e, t) || MA();
}
function MA() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function NA(e, t) {
	if (e) {
		if (typeof e == "string") return PA(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? PA(e, t) : void 0;
	}
}
function PA(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function FA(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function IA(e) {
	if (Array.isArray(e)) return e;
}
function LA(e, t) {
	if (e == null) return {};
	var n, r, i = RA(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function RA(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function zA() {
	return zA = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, zA.apply(null, arguments);
}
function BA(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function VA(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? BA(Object(n), !0).forEach(function(t) {
			HA(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : BA(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function HA(e, t, n) {
	return (t = UA(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function UA(e) {
	var t = WA(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function WA(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var GA = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	viewBox: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},
	orientation: "bottom",
	ticks: [],
	stroke: "#666",
	tickLine: !0,
	axisLine: !0,
	tick: !0,
	mirror: !1,
	minTickGap: 5,
	tickSize: 6,
	tickMargin: 2,
	interval: "preserveEnd",
	zIndex: dp.axis
};
function KA(e) {
	var t = e.x, n = e.y, r = e.width, i = e.height, a = e.orientation, o = e.mirror, s = e.axisLine, c = e.otherSvgProps;
	if (!s) return null;
	var l = VA(VA(VA({}, c), N(s)), {}, { fill: "none" });
	if (a === "top" || a === "bottom") {
		var u = +(a === "top" && !o || a === "bottom" && o);
		l = VA(VA({}, l), {}, {
			x1: t,
			y1: n + u * i,
			x2: t + r,
			y2: n + u * i
		});
	} else {
		var d = +(a === "left" && !o || a === "right" && o);
		l = VA(VA({}, l), {}, {
			x1: t + d * r,
			y1: n,
			x2: t + d * r,
			y2: n + i
		});
	}
	return /*#__PURE__*/ b.createElement("line", zA({}, l, { className: O("recharts-cartesian-axis-line", R(s, "className")) }));
}
function qA(e, t, n, r, i, a, o, s, c) {
	var l, u, d, f, p, m, h = s ? -1 : 1, g = e.tickSize || o, _ = z(e.tickCoord) ? e.tickCoord : e.coordinate;
	switch (a) {
		case "top":
			l = u = e.coordinate, f = n + +!s * i, d = f - h * g, m = d - h * c, p = _;
			break;
		case "left":
			d = f = e.coordinate, u = t + +!s * r, l = u - h * g, p = l - h * c, m = _;
			break;
		case "right":
			d = f = e.coordinate, u = t + +s * r, l = u + h * g, p = l + h * c, m = _;
			break;
		default: l = u = e.coordinate, f = n + +s * i, d = f + h * g, m = d + h * c, p = _;
	}
	return {
		line: {
			x1: l,
			y1: d,
			x2: u,
			y2: f
		},
		tick: {
			x: p,
			y: m
		}
	};
}
function JA(e, t) {
	switch (e) {
		case "left": return t ? "start" : "end";
		case "right": return t ? "end" : "start";
		default: return "middle";
	}
}
function YA(e, t) {
	switch (e) {
		case "left":
		case "right": return "middle";
		case "top": return t ? "start" : "end";
		default: return t ? "end" : "start";
	}
}
function XA(e) {
	var t = e.option, n = e.tickProps, r = e.value, i, a = O(n.className, "recharts-cartesian-axis-tick-value");
	if (/*#__PURE__*/ b.isValidElement(t)) i = /*#__PURE__*/ b.cloneElement(t, VA(VA({}, n), {}, { className: a }));
	else if (typeof t == "function") i = t(VA(VA({}, n), {}, { className: a }));
	else {
		var o = "recharts-cartesian-axis-tick-value";
		typeof t != "boolean" && (o = O(o, ED(t))), i = /*#__PURE__*/ b.createElement(FE, zA({}, n, { className: o }), r);
	}
	return i;
}
function ZA(e) {
	var t = e.ticks, n = e.axisType, r = e.axisId, i = br(), a = (0, b.useRef)(null);
	return (0, b.useEffect)(() => {
		if (r != null && n != null) {
			var e = t.map((e) => ({
				value: e.value,
				coordinate: e.coordinate,
				offset: e.offset,
				index: e.index
			})), o = a.current;
			o != null && o.axisId === r && o.axisType === n && sA(o.ticks, e) || (a.current = {
				ticks: e,
				axisId: r,
				axisType: n
			}, i(DA({
				ticks: e,
				axisId: r,
				axisType: n
			})));
		}
	}, [
		i,
		t,
		r,
		n
	]), (0, b.useEffect)(() => r == null || n == null ? Le : () => {
		i(OA({
			axisId: r,
			axisType: n
		}));
	}, [
		i,
		r,
		n
	]), null;
}
var QA = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.ticks, r = n === void 0 ? [] : n, i = e.tick, a = e.tickLine, o = e.stroke, s = e.tickFormatter, c = e.unit, l = e.padding, u = e.tickTextProps, d = e.orientation, f = e.mirror, p = e.x, m = e.y, h = e.width, g = e.height, _ = e.tickSize, v = e.tickMargin, y = e.fontSize, x = e.letterSpacing, S = e.getTicksConfig, C = e.events, w = e.axisType, T = e.axisId, E = SA(VA(VA({}, S), {}, { ticks: r }), y, x), D = N(S), k = P(i), ee = wE(D.textAnchor) ? D.textAnchor : JA(d, f), A = YA(d, f), j = {};
	typeof a == "object" && (j = a);
	var M = VA(VA({}, D), {}, { fill: "none" }, j), te = E.map((e) => VA({ entry: e }, qA(e, p, m, h, g, d, _, f, v))), ne = te.map((e) => {
		var t = e.entry, n = e.line;
		return /*#__PURE__*/ b.createElement(de, {
			className: "recharts-cartesian-axis-tick",
			key: `tick-${t.value}-${t.coordinate}-${t.tickCoord}`
		}, a && /*#__PURE__*/ b.createElement("line", zA({}, M, n, { className: O("recharts-cartesian-axis-tick-line", R(a, "className")) })));
	}), re = te.map((e, t) => {
		var n = e.entry, r = e.tick, a = VA(VA({}, VA(VA(VA(VA({ verticalAnchor: A }, D), {}, {
			textAnchor: ee,
			stroke: "none",
			fill: o
		}, r), {}, {
			index: t,
			payload: n,
			visibleTicksCount: E.length,
			tickFormatter: s,
			padding: l
		}, u), {}, { angle: u?.angle ?? D.angle ?? 0 })), k);
		return /*#__PURE__*/ b.createElement(de, zA({
			className: "recharts-cartesian-axis-tick-label",
			key: `tick-label-${n.value}-${n.coordinate}-${n.tickCoord}`
		}, Yt(C, n, t)), i && /*#__PURE__*/ b.createElement(XA, {
			option: i,
			tickProps: a,
			value: `${typeof s == "function" ? s(n.value, t) : n.value}${c || ""}`
		}));
	});
	return /*#__PURE__*/ b.createElement("g", { className: `recharts-cartesian-axis-ticks recharts-${w}-ticks` }, /*#__PURE__*/ b.createElement(ZA, {
		ticks: E,
		axisId: T,
		axisType: w
	}), re.length > 0 && /*#__PURE__*/ b.createElement(Sw, { zIndex: dp.label }, /*#__PURE__*/ b.createElement("g", {
		className: `recharts-cartesian-axis-tick-labels recharts-${w}-tick-labels`,
		ref: t
	}, re)), ne.length > 0 && /*#__PURE__*/ b.createElement("g", { className: `recharts-cartesian-axis-tick-lines recharts-${w}-tick-lines` }, ne));
}), $A = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.axisLine, r = e.width, i = e.height, a = e.className, o = e.hide, s = e.ticks, c = e.axisType, l = e.axisId, u = LA(e, AA), d = jA((0, b.useState)(""), 2), f = d[0], p = d[1], m = jA((0, b.useState)(""), 2), h = m[0], g = m[1], _ = (0, b.useRef)(null);
	(0, b.useImperativeHandle)(t, () => ({
		getCalculatedWidth: () => CA({
			ticks: _.current,
			label: e.labelRef?.current,
			labelGapWithTick: 5,
			tickSize: e.tickSize,
			tickMargin: e.tickMargin
		}),
		getCalculatedHeight: () => wA({
			ticks: _.current,
			label: e.labelRef?.current,
			labelGapWithTick: 5,
			tickSize: e.tickSize,
			tickMargin: e.tickMargin
		})
	}));
	var v = (0, b.useCallback)((e) => {
		if (e) {
			var t = e.getElementsByClassName("recharts-cartesian-axis-tick-value");
			_.current = t;
			var n = t[0];
			if (n) {
				var r = window.getComputedStyle(n), i = r.fontSize, a = r.letterSpacing;
				(i !== f || a !== h) && (p(i), g(a));
			}
		}
	}, [f, h]);
	return o || r != null && r <= 0 || i != null && i <= 0 ? null : /*#__PURE__*/ b.createElement(Sw, { zIndex: e.zIndex }, /*#__PURE__*/ b.createElement(de, { className: O("recharts-cartesian-axis", a) }, /*#__PURE__*/ b.createElement(KA, {
		x: e.x,
		y: e.y,
		width: r,
		height: i,
		orientation: e.orientation,
		mirror: e.mirror,
		axisLine: n,
		otherSvgProps: N(e)
	}), /*#__PURE__*/ b.createElement(QA, {
		ref: v,
		axisType: c,
		events: u,
		fontSize: f,
		getTicksConfig: e,
		height: e.height,
		letterSpacing: h,
		mirror: e.mirror,
		orientation: e.orientation,
		padding: e.padding,
		stroke: e.stroke,
		tick: e.tick,
		tickFormatter: e.tickFormatter,
		tickLine: e.tickLine,
		tickMargin: e.tickMargin,
		tickSize: e.tickSize,
		tickTextProps: e.tickTextProps,
		ticks: s,
		unit: e.unit,
		width: e.width,
		x: e.x,
		y: e.y,
		axisId: l
	}), /*#__PURE__*/ b.createElement(qE, {
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		lowerWidth: e.width,
		upperWidth: e.width
	}, /*#__PURE__*/ b.createElement(sD, {
		label: e.label,
		labelRef: e.labelRef
	}), e.children)));
}), ej = /*#__PURE__*/ b.forwardRef((e, t) => {
	var n = tn(e, GA);
	return /*#__PURE__*/ b.createElement($A, zA({}, n, { ref: t }));
});
ej.displayName = "CartesianAxis";
// analytics/node_modules/recharts/es6/theme/RechartsThemeContext.js
var tj = /*#__PURE__*/ (0, b.createContext)({ grid: {
	stroke: "#ccc",
	fill: "none"
} });
tj.Provider;
var nj = () => (0, b.useContext)(tj), rj = [
	"x1",
	"y1",
	"x2",
	"y2",
	"key"
], ij = ["offset"], aj = ["xAxisId", "yAxisId"], oj = ["xAxisId", "yAxisId"];
function sj(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function cj(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? sj(Object(n), !0).forEach(function(t) {
			lj(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : sj(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function lj(e, t, n) {
	return (t = uj(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function uj(e) {
	var t = dj(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function dj(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function fj() {
	return fj = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, fj.apply(null, arguments);
}
function pj(e, t) {
	if (e == null) return {};
	var n, r, i = mj(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function mj(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var hj = (e) => {
	var t = e.fill;
	if (!t || t === "none") return null;
	var n = e.fillOpacity, r = e.x, i = e.y, a = e.width, o = e.height, s = e.ry;
	return /*#__PURE__*/ b.createElement("rect", {
		x: r,
		y: i,
		ry: s,
		width: a,
		height: o,
		stroke: "none",
		fill: t,
		fillOpacity: n,
		className: "recharts-cartesian-grid-bg"
	});
};
function gj(e) {
	var t = e.option, n = e.lineItemProps, r;
	if (/*#__PURE__*/ b.isValidElement(t)) r = /*#__PURE__*/ b.cloneElement(t, n);
	else if (typeof t == "function") r = t(n);
	else {
		var i = n.x1, a = n.y1, o = n.x2, s = n.y2, c = n.key, l = N(pj(n, rj)) ?? {};
		l.offset;
		var u = pj(l, ij), d = Array.isArray(u.strokeDasharray) ? u.strokeDasharray.join(",") : u.strokeDasharray;
		r = /*#__PURE__*/ b.createElement("line", fj({}, u, {
			strokeDasharray: d,
			x1: i,
			y1: a,
			x2: o,
			y2: s,
			fill: "none",
			key: c
		}));
	}
	return r;
}
function _j(e) {
	var t = e.x, n = e.width, r = e.horizontal, i = r === void 0 || r, a = e.horizontalPoints;
	if (!i || !a || !a.length) return null;
	e.xAxisId, e.yAxisId;
	var o = pj(e, aj), s = a.map((e, r) => {
		var a = cj(cj({}, o), {}, {
			x1: t,
			y1: e,
			x2: t + n,
			y2: e,
			key: `line-${r}`,
			index: r
		});
		return /*#__PURE__*/ b.createElement(gj, {
			key: `line-${r}`,
			option: i,
			lineItemProps: a
		});
	});
	return /*#__PURE__*/ b.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, s);
}
function vj(e) {
	var t = e.y, n = e.height, r = e.vertical, i = r === void 0 || r, a = e.verticalPoints;
	if (!i || !a || !a.length) return null;
	e.xAxisId, e.yAxisId;
	var o = pj(e, oj), s = a.map((e, r) => {
		var a = cj(cj({}, o), {}, {
			x1: e,
			y1: t,
			x2: e,
			y2: t + n,
			key: `line-${r}`,
			index: r
		});
		return /*#__PURE__*/ b.createElement(gj, {
			option: i,
			lineItemProps: a,
			key: `line-${r}`
		});
	});
	return /*#__PURE__*/ b.createElement("g", { className: "recharts-cartesian-grid-vertical" }, s);
}
function yj(e) {
	var t = e.horizontalFill, n = e.fillOpacity, r = e.x, i = e.y, a = e.width, o = e.height, s = e.horizontalPoints, c = e.horizontal;
	if (!(c === void 0 || c) || !t || !t.length || s == null) return null;
	var l = s.map((e) => Math.round(e + i - i)).sort((e, t) => e - t);
	i !== l[0] && l.unshift(0);
	var u = l.map((e, s) => {
		var c = l[s + 1], u = c == null ? i + o - e : c - e;
		if (u <= 0) return null;
		var d = s % t.length;
		return /*#__PURE__*/ b.createElement("rect", {
			key: `react-${s}`,
			y: e,
			x: r,
			height: u,
			width: a,
			stroke: "none",
			fill: t[d],
			fillOpacity: n,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ b.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, u);
}
function bj(e) {
	var t = e.vertical, n = t === void 0 || t, r = e.verticalFill, i = e.fillOpacity, a = e.x, o = e.y, s = e.width, c = e.height, l = e.verticalPoints;
	if (!n || !r || !r.length) return null;
	var u = l.map((e) => Math.round(e + a - a)).sort((e, t) => e - t);
	a !== u[0] && u.unshift(0);
	var d = u.map((e, t) => {
		var n = u[t + 1], l = n == null ? a + s - e : n - e;
		if (l <= 0) return null;
		var d = t % r.length;
		return /*#__PURE__*/ b.createElement("rect", {
			key: `react-${t}`,
			x: e,
			y: o,
			width: l,
			height: c,
			stroke: "none",
			fill: r[d],
			fillOpacity: i,
			className: "recharts-cartesian-grid-bg"
		});
	});
	return /*#__PURE__*/ b.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, d);
}
var xj = (e, t) => {
	var n = e.xAxis, r = e.width, i = e.height, a = e.offset;
	return ms(SA(cj(cj(cj({}, GA), n), {}, {
		ticks: hs(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.left, a.left + a.width, t);
}, Sj = (e, t) => {
	var n = e.yAxis, r = e.width, i = e.height, a = e.offset;
	return ms(SA(cj(cj(cj({}, GA), n), {}, {
		ticks: hs(n, !0),
		viewBox: {
			x: 0,
			y: 0,
			width: r,
			height: i
		}
	})), a.top, a.top + a.height, t);
}, Cj = {
	horizontal: !0,
	vertical: !0,
	horizontalPoints: [],
	verticalPoints: [],
	verticalFill: [],
	horizontalFill: [],
	xAxisId: 0,
	yAxisId: 0,
	syncWithTicks: !1,
	zIndex: dp.grid
};
function wj(e) {
	var t = zc(), n = Bc(), r = Rc(), i = cj(cj({}, tn(e, Cj)), {}, {
		x: z(e.x) ? e.x : r.left,
		y: z(e.y) ? e.y : r.top,
		width: z(e.width) ? e.width : r.width,
		height: z(e.height) ? e.height : r.height
	}), a = i.xAxisId, o = i.yAxisId, s = i.x, c = i.y, l = i.width, u = i.height, d = i.syncWithTicks, f = i.horizontalValues, p = i.verticalValues, m = ec(), h = V((e) => Gx(e, "xAxis", a, m)), g = V((e) => Gx(e, "yAxis", o, m)), _ = nj(), v = {
		stroke: i.stroke ?? _.grid.stroke,
		strokeWidth: i.strokeWidth ?? _.grid.strokeWidth,
		strokeOpacity: i.strokeOpacity ?? _.grid.strokeOpacity,
		strokeDasharray: i.strokeDasharray ?? _.grid.strokeDasharray
	};
	if (!as(l) || !as(u) || !z(s) || !z(c)) return null;
	var y = i.verticalCoordinatesGenerator || xj, x = i.horizontalCoordinatesGenerator || Sj, S = i.horizontalPoints, C = i.verticalPoints;
	if ((!S || !S.length) && typeof x == "function") {
		var w = f && f.length, T = x({
			yAxis: g ? cj(cj({}, g), {}, { ticks: w ? f : g.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, w ? !0 : d);
		oc(Array.isArray(T), `horizontalCoordinatesGenerator should return Array but instead it returned [${typeof T}]`), Array.isArray(T) && (S = T);
	}
	if ((!C || !C.length) && typeof y == "function") {
		var E = p && p.length, D = y({
			xAxis: h ? cj(cj({}, h), {}, { ticks: E ? p : h.ticks }) : void 0,
			width: t ?? l,
			height: n ?? u,
			offset: r
		}, E ? !0 : d);
		oc(Array.isArray(D), `verticalCoordinatesGenerator should return Array but instead it returned [${typeof D}]`), Array.isArray(D) && (C = D);
	}
	return /*#__PURE__*/ b.createElement(Sw, { zIndex: i.zIndex }, /*#__PURE__*/ b.createElement("g", { className: "recharts-cartesian-grid" }, /*#__PURE__*/ b.createElement(hj, {
		fill: i.fill ?? _.grid.fill,
		fillOpacity: i.fillOpacity ?? _.grid.fillOpacity,
		x: i.x,
		y: i.y,
		width: i.width,
		height: i.height,
		ry: i.ry
	}), /*#__PURE__*/ b.createElement(yj, fj({}, i, { horizontalPoints: S })), /*#__PURE__*/ b.createElement(bj, fj({}, i, { verticalPoints: C })), /*#__PURE__*/ b.createElement(_j, fj({}, i, v, {
		offset: r,
		horizontalPoints: S,
		xAxis: h,
		yAxis: g
	})), /*#__PURE__*/ b.createElement(vj, fj({}, i, v, {
		offset: r,
		verticalPoints: C,
		xAxis: h,
		yAxis: g
	}))));
}
wj.displayName = "CartesianGrid";
// analytics/node_modules/recharts/es6/state/errorBarSlice.js
var Tj = lo({
	name: "errorBars",
	initialState: {},
	reducers: {
		addErrorBar: (e, t) => {
			var n = t.payload, r = n.itemId, i = n.errorBar;
			e[r] || (e[r] = []), e[r].push(i);
		},
		replaceErrorBar: (e, t) => {
			var n = t.payload, r = n.itemId, i = n.prev, a = n.next;
			e[r] && (e[r] = e[r].map((e) => e.dataKey === i.dataKey && e.direction === i.direction ? a : e));
		},
		removeErrorBar: (e, t) => {
			var n = t.payload, r = n.itemId, i = n.errorBar;
			e[r] && (e[r] = e[r].filter((e) => e.dataKey !== i.dataKey || e.direction !== i.direction));
		}
	}
}), Ej = Tj.actions;
Ej.addErrorBar, Ej.replaceErrorBar, Ej.removeErrorBar;
var Dj = Tj.reducer, Oj = ["children"];
function kj(e, t) {
	if (e == null) return {};
	var n, r, i = Aj(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Aj(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var jj = /*#__PURE__*/ (0, b.createContext)({
	data: [],
	xAxisId: "xAxis-0",
	yAxisId: "yAxis-0",
	dataPointFormatter: () => ({
		x: 0,
		y: 0,
		value: 0
	}),
	errorBarOffset: 0
});
function Mj(e) {
	var t = e.children, n = kj(e, Oj);
	return /*#__PURE__*/ b.createElement(jj.Provider, { value: n }, t);
}
// analytics/node_modules/recharts/es6/cartesian/GraphicalItemClipPath.js
function Nj(e, t) {
	var n = V((t) => Ky(t, e)), r = V((e) => Yy(e, t)), i = n?.allowDataOverflow ?? Wy.allowDataOverflow, a = r?.allowDataOverflow ?? qy.allowDataOverflow;
	return {
		needClip: i || a,
		needClipX: i,
		needClipY: a
	};
}
function Pj(e) {
	var t = e.xAxisId, n = e.yAxisId, r = e.clipPathId, i = fk(), a = Nj(t, n), o = a.needClipX, s = a.needClipY, c = a.needClip, l = V((e) => yx(e, t, !1)), u = V((e) => bx(e, n, !1));
	if (!c || !i) return null;
	var d = i.x, f = i.y, p = i.width, m = i.height, h = o && l ? Math.min(l[0], l[1]) : d - p / 2, g = s && u ? Math.min(u[0], u[1]) : f - m / 2, _ = o && l ? Math.abs(l[1] - l[0]) : p * 2, v = s && u ? Math.abs(u[1] - u[0]) : m * 2;
	return /*#__PURE__*/ b.createElement("clipPath", { id: `clipPath-${r}` }, /*#__PURE__*/ b.createElement("rect", {
		x: h,
		y: g,
		width: _,
		height: v
	}));
}
// analytics/node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js
function Fj(e) {
	var t = P(e), n = 3, r = 2;
	if (t != null) {
		var i = t.r, a = t.strokeWidth, o = Number(i), s = Number(a);
		return (Number.isNaN(o) || o < 0) && (o = n), (Number.isNaN(s) || s < 0) && (s = r), {
			r: o,
			strokeWidth: s
		};
	}
	return {
		r: n,
		strokeWidth: r
	};
}
// analytics/node_modules/recharts/es6/state/selectors/graphicalItemSelectors.js
function Ij(e, t) {
	return e.graphicalItems.cartesianItems.find((e) => e.id === t)?.xAxisId ?? 0;
}
function Lj(e, t) {
	return e.graphicalItems.cartesianItems.find((e) => e.id === t)?.yAxisId ?? 0;
}
// analytics/node_modules/recharts/es6/state/selectors/areaSelectors.js
var Rj = (e, t, n) => Jx(e, "xAxis", Ij(e, t), n), zj = (e, t, n) => qx(e, "xAxis", Ij(e, t), n), Bj = (e, t, n) => Jx(e, "yAxis", Lj(e, t), n), Vj = (e, t, n) => qx(e, "yAxis", Lj(e, t), n), Hj = H([
	q,
	Rj,
	Bj,
	zj,
	Vj
], (e, t, n, r, i) => ps(e, "xAxis") ? Os(t, r, !1) : Os(n, i, !1)), Uj = H([rb, (e, t) => t], (e, t) => e.filter((e) => e.type === "area").find((e) => e.id === t)), Wj = (e) => ps(q(e), "xAxis") ? "yAxis" : "xAxis", Gj = (e, t) => Wj(e) === "yAxis" ? Lj(e, t) : Ij(e, t), Kj = (e, t, n) => kb(e, Wj(e), Gj(e, t), n), qj = H([
	q,
	Rj,
	Bj,
	zj,
	Vj,
	H([Uj, Kj], (e, t) => {
		if (e != null && t != null) {
			var n = e.stackId, r = Pp(e);
			if (n != null && r != null) {
				var i = (t[n]?.stackedData)?.find((e) => e.key === r);
				if (i != null) return i.map((e) => [e[0], e[1]]);
			}
		}
	}),
	Df,
	Hj,
	Uj,
	up,
	H([Uj, Kj], (e, t) => {
		if (e != null && e.stackId != null && t != null) {
			var n = t[e.stackId];
			if (n != null) return n.graphicalItems.map((e) => e.dataKey).filter(Ie);
		}
	})
], (e, t, n, r, i, a, o, s, c, l, u) => {
	var d = o.chartData, f = o.dataStartIndex, p = o.dataEndIndex;
	if (!(c == null || e !== "horizontal" && e !== "vertical" || t == null || n == null || r == null || i == null || r.length === 0 || i.length === 0 || s == null)) {
		var m = c.data, h = m && m.length > 0 ? m : d?.slice(f, p + 1);
		if (h != null) return EM({
			layout: e,
			xAxis: t,
			yAxis: n,
			xAxisTicks: r,
			yAxisTicks: i,
			dataStartIndex: f,
			areaSettings: c,
			stackedData: a,
			displayedData: h,
			chartBaseValue: l,
			bandSize: s,
			stackDataKeys: u
		});
	}
}), Jj = [
	"animationElapsedTime",
	"isAnimating",
	"isEntrance",
	"layout",
	"isRange",
	"stroke",
	"connectNulls"
], Yj = ["id", "baseLine"];
function Xj() {
	return Xj = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Xj.apply(null, arguments);
}
function Zj(e, t) {
	if (e == null) return {};
	var n, r, i = Qj(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Qj(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function $j(e) {
	var t = e.alpha, n = e.baseLine, r = e.points, i = e.strokeWidth, a = r[0]?.x, o = r[r.length - 1]?.x;
	if (!K(a) || !K(o)) return null;
	var s = t * Math.abs(a - o), c = Math.max(...r.map((e) => e.y || 0));
	return z(n) ? c = Math.max(n, c) : n && Array.isArray(n) && n.length && (c = Math.max(...n.map((e) => e.y || 0), c)), z(c) ? /*#__PURE__*/ b.createElement("rect", {
		x: a < o ? a : a - s,
		y: 0,
		width: s,
		height: Math.floor(c + (i ? parseInt(`${i}`, 10) : 1))
	}) : null;
}
function eM(e) {
	var t = e.alpha, n = e.baseLine, r = e.points, i = e.strokeWidth, a = r[0]?.y, o = r[r.length - 1]?.y;
	if (!K(a) || !K(o)) return null;
	var s = t * Math.abs(a - o), c = Math.max(...r.map((e) => e.x || 0));
	return z(n) ? c = Math.max(n, c) : n && Array.isArray(n) && n.length && (c = Math.max(...n.map((e) => e.x || 0), c)), z(c) ? /*#__PURE__*/ b.createElement("rect", {
		x: 0,
		y: a < o ? a : a - s,
		width: c + (i ? parseInt(`${i}`, 10) : 1),
		height: Math.floor(s)
	}) : null;
}
function tM(e) {
	var t = e.alpha, n = e.layout, r = e.points, i = e.baseLine, a = e.strokeWidth;
	return n === "vertical" ? /*#__PURE__*/ b.createElement(eM, {
		alpha: t,
		points: r,
		baseLine: i,
		strokeWidth: a
	}) : /*#__PURE__*/ b.createElement($j, {
		alpha: t,
		points: r,
		baseLine: i,
		strokeWidth: a
	});
}
function nM(e) {
	var t = e.animationElapsedTime, n = t === void 0 ? 1 : t, r = e.isAnimating, i = r !== void 0 && r, a = e.isEntrance, o = a !== void 0 && a, s = e.layout, c = e.isRange, l = e.stroke, u = e.connectNulls, d = Zj(e, Jj), f = s === "vertical" ? "vertical" : "horizontal", p = u ?? !1, m = EO(), h = d.id, g = d.baseLine, _ = N(Zj(d, Yj)), v = /*#__PURE__*/ b.createElement(xu, Xj({}, d, {
		id: h,
		baseLine: g,
		connectNulls: p,
		stroke: "none",
		className: "recharts-area-area",
		layout: f
	})), y = l !== "none" && /*#__PURE__*/ b.createElement(xu, Xj({}, _, {
		className: "recharts-area-curve",
		layout: f,
		type: d.type,
		connectNulls: p,
		fill: "none",
		stroke: l,
		points: d.points
	})), x = l !== "none" && c && Array.isArray(g) && /*#__PURE__*/ b.createElement(xu, Xj({}, _, {
		className: "recharts-area-curve",
		layout: f,
		type: d.type,
		connectNulls: p,
		fill: "none",
		stroke: l,
		points: g
	}));
	return o && (i || n < 1) ? /*#__PURE__*/ b.createElement(de, null, /*#__PURE__*/ b.createElement("defs", null, /*#__PURE__*/ b.createElement("clipPath", { id: m }, /*#__PURE__*/ b.createElement(tM, {
		alpha: n,
		points: d.points ?? [],
		baseLine: g,
		layout: f,
		strokeWidth: d.strokeWidth
	}))), /*#__PURE__*/ b.createElement(de, { clipPath: `url(#${m})` }, v, y, x)) : /*#__PURE__*/ b.createElement(b.Fragment, null, v, y, x);
}
// analytics/node_modules/recharts/es6/cartesian/Area.js
var rM = ["id"], iM = [
	"activeDot",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"fill",
	"fillOpacity",
	"hide",
	"isAnimationActive",
	"legendType",
	"stroke",
	"xAxisId",
	"yAxisId"
];
function aM() {
	return aM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, aM.apply(null, arguments);
}
function oM(e, t) {
	if (e == null) return {};
	var n, r, i = sM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function sM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function cM(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function lM(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? cM(Object(n), !0).forEach(function(t) {
			uM(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : cM(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function uM(e, t, n) {
	return (t = dM(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function dM(e) {
	var t = fM(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function fM(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var pM = {
	activeDot: !0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: rO,
	animationInterpolateFn: (e, t) => e == null ? [] : t === 1 ? e.flatMap((e) => e.status === "removed" ? [] : [e.next]) : e.flatMap((e) => e.status === "matched" ? [lM(lM({}, e.next), {}, {
		x: Me(e.prev.x, e.next.x, t),
		y: Me(e.prev.y, e.next.y, t)
	})] : e.status === "added" ? [e.next] : []),
	connectNulls: !1,
	dot: !1,
	fill: "#3182bd",
	fillOpacity: .6,
	hide: !1,
	isAnimationActive: "auto",
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	type: "linear",
	label: !1,
	shape: nM,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: dp.area
};
function mM(e, t) {
	return e && e !== "none" ? e : t;
}
var hM = (e) => {
	var t = e.dataKey, n = e.name, r = e.stroke, i = e.fill, a = e.legendType;
	return [{
		inactive: e.hide,
		dataKey: t,
		type: a,
		color: mM(r, i),
		value: As(n, t),
		payload: e
	}];
}, gM = /*#__PURE__*/ b.memo((e) => {
	var t = e.dataKey, n = e.data, r = e.stroke, i = e.strokeWidth, a = e.fill, o = e.name, s = e.hide, c = e.unit, l = e.formatter, u = e.tooltipType, d = e.id, f = {
		dataDefinedOnItem: n,
		getPosition: Le,
		settings: {
			stroke: r,
			strokeWidth: i,
			fill: a,
			dataKey: t,
			nameKey: void 0,
			name: As(o, t),
			hide: s,
			type: u,
			color: mM(r, a),
			unit: c,
			formatter: l,
			graphicalItemId: d
		}
	};
	return /*#__PURE__*/ b.createElement(YD, { tooltipEntrySettings: f });
});
function _M(e) {
	var t = e.clipPathId, n = e.points, r = e.props, i = r.needClip, a = r.dot, o = r.dataKey, s = N(r);
	return /*#__PURE__*/ b.createElement(JO, {
		points: n,
		dot: a,
		className: "recharts-area-dots",
		dotClassName: "recharts-area-dot",
		dataKey: o,
		baseProps: s,
		needClip: i,
		clipPathId: t
	});
}
function vM(e) {
	var t = e.showLabels, n = e.children, r = e.points.map((e) => {
		var t = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return lM(lM({}, t), {}, {
			value: e.value,
			payload: e.payload,
			parentViewBox: void 0,
			viewBox: t,
			fill: void 0
		});
	});
	return /*#__PURE__*/ b.createElement(hD, { value: t ? r : void 0 }, n);
}
function yM(e) {
	var t = e.points, n = e.baseLine, r = e.needClip, i = e.clipPathId, a = e.props, o = e.animationElapsedTime, s = e.isAnimating, c = e.isEntrance, l = a.layout, u = a.type, d = a.stroke, f = a.connectNulls, p = a.isRange, m = a.shape, h = a.id, g = oM(a, rM), _ = lM(lM({}, te(g)), {}, {
		id: h,
		points: t,
		connectNulls: f,
		type: u,
		baseLine: n,
		layout: l,
		stroke: d,
		isRange: p,
		animationElapsedTime: o,
		isAnimating: s,
		isEntrance: c
	});
	return /*#__PURE__*/ b.createElement(b.Fragment, null, t?.length > 1 && /*#__PURE__*/ b.createElement(de, { clipPath: r ? `url(#clipPath-${i})` : void 0 }, /*#__PURE__*/ b.createElement(GD, {
		option: m,
		DefaultShape: pM.shape,
		shapeProps: _
	})), /*#__PURE__*/ b.createElement(_M, {
		points: t,
		props: g,
		clipPathId: i
	}));
}
function bM(e, t, n) {
	return z(e) ? Me(z(t) ? t : void 0, e, n) : Pe(e) || Te(e) ? Me(z(t) ? t : void 0, 0, n) : e;
}
function xM(e) {
	var t = e.needClip, n = e.clipPathId, r = e.props, i = e.previousPointsRef, a = e.previousBaselineRef, o = r.points, s = r.baseLine, c = r.isAnimationActive, l = r.animationBegin, u = r.animationDuration, d = r.animationEasing, f = r.animationMatchBy, p = r.animationInterpolateFn, m = (0, b.useMemo)(() => ({
		points: o,
		baseLine: s
	}), [o, s]), h = dO(m, a), g = Hc(), _ = vO(r.onAnimationStart, r.onAnimationEnd), v = _.isAnimating, y = _.handleAnimationStart, x = _.handleAnimationEnd, S = h.startValue;
	if (g == null) return null;
	var C = Array.isArray(s) && Array.isArray(S) ? uO(S, s, f) : Array.isArray(s) ? uO(null, s, f) : null;
	return /*#__PURE__*/ b.createElement(yO, {
		animationInput: m,
		animationIdPrefix: "recharts-area-",
		items: o,
		previousItemsRef: i,
		isAnimationActive: c,
		animationBegin: l,
		animationDuration: u,
		animationEasing: d,
		onAnimationStart: y,
		onAnimationEnd: x,
		animationInterpolateFn: p,
		animationMatchBy: f,
		layout: g
	}, (e, i, a) => {
		var c = i === 1 ? s : Array.isArray(s) ? p(C, i, g) : a ? s : bM(s, S, i);
		return h.syncStepValue(c, i), /*#__PURE__*/ b.createElement(vM, {
			showLabels: !v,
			points: o
		}, r.children, /*#__PURE__*/ b.createElement(yM, {
			points: e,
			baseLine: c,
			needClip: t,
			clipPathId: n,
			props: r,
			animationElapsedTime: i,
			isAnimating: v || i < 1,
			isEntrance: a
		}), /*#__PURE__*/ b.createElement(bD, { label: r.label }));
	});
}
function SM(e) {
	var t = e.needClip, n = e.clipPathId, r = e.props, i = (0, b.useRef)(null), a = (0, b.useRef)();
	return /*#__PURE__*/ b.createElement(xM, {
		needClip: t,
		clipPathId: n,
		props: r,
		previousPointsRef: i,
		previousBaselineRef: a
	});
}
var CM = class extends b.PureComponent {
	render() {
		var e = this.props, t = e.hide, n = e.dot, r = e.points, i = e.className, a = e.top, o = e.left, s = e.needClip, c = e.xAxisId, l = e.yAxisId, u = e.width, d = e.height, f = e.id, p = e.baseLine, m = e.zIndex;
		if (t) return null;
		var h = O("recharts-area", i), g = f, _ = Fj(n), v = _.r, y = _.strokeWidth, x = PD(n), S = v * 2 + y, C = s ? `url(#clipPath-${x ? "" : "dots-"}${g})` : void 0;
		return /*#__PURE__*/ b.createElement(Sw, { zIndex: m }, /*#__PURE__*/ b.createElement(de, { className: h }, s && /*#__PURE__*/ b.createElement("defs", null, /*#__PURE__*/ b.createElement(Pj, {
			clipPathId: g,
			xAxisId: c,
			yAxisId: l
		}), !x && /*#__PURE__*/ b.createElement("clipPath", { id: `clipPath-dots-${g}` }, /*#__PURE__*/ b.createElement("rect", {
			x: o - S / 2,
			y: a - S / 2,
			width: u + S,
			height: d + S
		}))), /*#__PURE__*/ b.createElement(SM, {
			needClip: s,
			clipPathId: g,
			props: this.props
		})), /*#__PURE__*/ b.createElement(bk, {
			points: r,
			mainColor: mM(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: C
		}), this.props.isRange && Array.isArray(p) && /*#__PURE__*/ b.createElement(bk, {
			points: p,
			mainColor: mM(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: C
		}));
	}
};
function wM(e) {
	var t = e.activeDot, n = e.animationBegin, r = e.animationDuration, i = e.animationEasing, a = e.connectNulls, o = e.dot, s = e.fill, c = e.fillOpacity, l = e.hide, u = e.isAnimationActive, d = e.legendType, f = e.stroke, p = e.xAxisId, m = e.yAxisId, h = oM(e, iM), g = Vc(), _ = VC(), v = Nj(p, m).needClip, y = ec(), x = V((t) => qj(t, e.id, y)) ?? {}, S = x.points, C = x.isRange, w = x.baseLine, T = fk();
	if (g !== "horizontal" && g !== "vertical" || T == null || _ !== "AreaChart" && _ !== "ComposedChart") return null;
	var E = T.height, D = T.width, O = T.x, k = T.y;
	return !S || !S.length ? null : /*#__PURE__*/ b.createElement(CM, aM({}, h, {
		activeDot: t,
		animationBegin: n,
		animationDuration: r,
		animationEasing: i,
		baseLine: w,
		connectNulls: a,
		dot: o,
		fill: s,
		fillOpacity: c,
		height: E,
		hide: l,
		layout: g,
		isAnimationActive: u,
		isRange: C,
		legendType: d,
		needClip: v,
		points: S,
		stroke: f,
		width: D,
		left: O,
		top: k,
		xAxisId: p,
		yAxisId: m
	}));
}
var TM = (e, t, n, r, i) => {
	var a = n ?? t;
	if (z(a)) return a;
	var o = e === "horizontal" ? i : r, s = o.scale.domain();
	if (o.type === "number") {
		var c = Math.max(s[0], s[1]), l = Math.min(s[0], s[1]);
		return a === "dataMin" ? l : a === "dataMax" || c < 0 ? c : Math.max(Math.min(s[0], s[1]), 0);
	}
	return a === "dataMin" ? s[0] : a === "dataMax" ? s[1] : s[0];
};
function EM(e) {
	var t = e.areaSettings, n = t.connectNulls, r = t.baseValue, i = t.dataKey, a = e.stackedData, o = e.layout, s = e.chartBaseValue, c = e.xAxis, l = e.yAxis, u = e.displayedData, d = e.dataStartIndex, f = e.xAxisTicks, p = e.yAxisTicks, m = e.bandSize, h = e.stackDataKeys, g = a && a.length, _ = TM(o, s, r, c, l), v = o === "horizontal", y = !1, b = u.map((e, t) => {
		var r;
		if (g) r = a[d + t];
		else {
			var o = ds(e, i);
			Array.isArray(o) ? (r = o, y = !0) : r = [_, o];
		}
		var s = r?.[1] ?? null, u = ds(e, i), b = g && u == null && h != null && h.length > 0 && h.every((t) => ds(e, t) == null), x = s == null || g && !n && u == null || b;
		return v ? {
			x: bs({
				axis: c,
				ticks: f,
				bandSize: m,
				entry: e,
				index: t
			}),
			y: x ? null : l.scale.map(s) ?? null,
			value: r,
			payload: e
		} : {
			x: x ? null : c.scale.map(s) ?? null,
			y: bs({
				axis: l,
				ticks: p,
				bandSize: m,
				entry: e,
				index: t
			}),
			value: r,
			payload: e
		};
	});
	return {
		points: b,
		baseLine: (g || y ? b.map((e) => {
			var t = Array.isArray(e.value) ? e.value[0] : null;
			return v ? {
				x: e.x,
				y: t != null && e.y != null ? l.scale.map(t) ?? null : null,
				payload: e.payload
			} : {
				x: t == null ? null : c.scale.map(t) ?? null,
				y: e.y,
				payload: e.payload
			};
		}) : v ? l.scale.map(_) : c.scale.map(_)) ?? 0,
		isRange: y
	};
}
function DM(e) {
	var t = tn(e, pM), n = ec();
	return /*#__PURE__*/ b.createElement(kO, {
		id: t.id,
		type: "area"
	}, (e) => /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(XD, { legendPayload: hM(t) }), /*#__PURE__*/ b.createElement(gM, {
		dataKey: t.dataKey,
		data: t.data,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		unit: t.unit,
		formatter: t.formatter,
		tooltipType: t.tooltipType,
		id: e
	}), /*#__PURE__*/ b.createElement(IO, {
		type: "area",
		id: e,
		data: t.data,
		dataKey: t.dataKey,
		xAxisId: t.xAxisId,
		yAxisId: t.yAxisId,
		zAxisId: 0,
		stackId: ys(t.stackId),
		hide: t.hide,
		barSize: void 0,
		baseValue: t.baseValue,
		isPanorama: n,
		connectNulls: t.connectNulls
	}), /*#__PURE__*/ b.createElement(wM, aM({}, t, { id: e }))));
}
var OM = /*#__PURE__*/ b.memo(DM, hl);
OM.displayName = "Area";
// analytics/node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var kM = "Invariant failed";
function AM(e, t) {
	if (!e) throw Error(kM);
}
// analytics/node_modules/recharts/es6/util/BarUtils.js
var jM = ["option"];
function MM(e, t) {
	if (e == null) return {};
	var n, r, i = NM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function NM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var PM = Hd;
function FM(e) {
	var t = e.option, n = MM(e, jM);
	return /*#__PURE__*/ b.createElement(GD, {
		option: t,
		DefaultShape: PM,
		shapeProps: n,
		activeClassName: "recharts-active-bar",
		inActiveClassName: "recharts-inactive-bar"
	});
}
var IM = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	return (n, r) => {
		if (z(e)) return e;
		var i = z(n) || Pe(n);
		return i ? e(n, r) : (!i && AM(!1, `minPointSize callback function received a value with type of ${typeof n}. Currently only numbers or null/undefined are supported.`), t);
	};
}, LM = (e, t, n) => n, RM = H([rb, (e, t) => t], (e, t) => e.filter((e) => e.type === "bar").find((e) => e.id === t)), zM = H([RM], (e) => e?.maxBarSize), BM = (e, t, n, r) => r, VM = H([
	q,
	rb,
	Ij,
	Lj,
	LM
], (e, t, n, r, i) => t.filter((t) => e === "horizontal" ? t.xAxisId === n : t.yAxisId === r).filter((e) => e.isPanorama === i).filter((e) => e.hide === !1).filter((e) => e.type === "bar")), HM = (e, t, n) => {
	var r = q(e), i = Ij(e, t), a = Lj(e, t);
	if (i != null && a != null) return r === "horizontal" ? kb(e, "yAxis", a, n) : kb(e, "xAxis", i, n);
}, UM = H([
	VM,
	rp,
	(e, t) => {
		var n = q(e), r = Ij(e, t), i = Lj(e, t);
		if (r != null && i != null) return n === "horizontal" ? Hx(e, "xAxis", r) : Hx(e, "yAxis", i);
	}
], Ok), WM = (e, t, n) => {
	var r = RM(e, t);
	if (r == null) return 0;
	var i = Ij(e, t), a = Lj(e, t);
	if (i == null || a == null) return 0;
	var o = q(e), s = ep(e), c = r.maxBarSize, l = Pe(c) ? s : c, u, d;
	return o === "horizontal" ? (u = Jx(e, "xAxis", i, n), d = qx(e, "xAxis", i, n)) : (u = Jx(e, "yAxis", a, n), d = qx(e, "yAxis", a, n)), Os(u, d, !0) ?? l ?? 0;
}, GM = (e, t, n) => {
	var r = q(e), i = Ij(e, t), a = Lj(e, t);
	if (i != null && a != null) {
		var o, s;
		return r === "horizontal" ? (o = Jx(e, "xAxis", i, n), s = qx(e, "xAxis", i, n)) : (o = Jx(e, "yAxis", a, n), s = qx(e, "yAxis", a, n)), Os(o, s);
	}
}, KM = H([
	Xs,
	Qs,
	(e, t, n) => {
		var r = Ij(e, t);
		if (r != null) return Jx(e, "xAxis", r, n);
	},
	(e, t, n) => {
		var r = Lj(e, t);
		if (r != null) return Jx(e, "yAxis", r, n);
	},
	(e, t, n) => {
		var r = Ij(e, t);
		if (r != null) return qx(e, "xAxis", r, n);
	},
	(e, t, n) => {
		var r = Lj(e, t);
		if (r != null) return qx(e, "yAxis", r, n);
	},
	H([H([
		UM,
		ep,
		tp,
		np,
		WM,
		GM,
		zM
	], Fk), RM], Lk),
	q,
	Df,
	GM,
	H([HM, RM], Ik),
	RM,
	BM
], (e, t, n, r, i, a, o, s, c, l, u, d, f) => {
	var p = c.chartData, m = c.dataStartIndex, h = c.dataEndIndex;
	if (!(d == null || o == null || t == null || s !== "horizontal" && s !== "vertical" || n == null || r == null || i == null || a == null || l == null)) {
		var g = d.data, _ = g != null && g.length > 0 ? g : p?.slice(m, h + 1);
		if (_ != null) return FN({
			layout: s,
			barSettings: d,
			pos: o,
			parentViewBox: t,
			bandSize: l,
			xAxis: n,
			yAxis: r,
			xAxisTicks: i,
			yAxisTicks: a,
			stackedData: u,
			displayedData: _,
			offset: e,
			cells: f,
			dataStartIndex: m
		});
	}
}), qM = ["index"];
function JM() {
	return JM = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, JM.apply(null, arguments);
}
function YM(e, t) {
	if (e == null) return {};
	var n, r, i = XM(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function XM(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var ZM = /*#__PURE__*/ (0, b.createContext)(void 0), QM = (e) => {
	var t = (0, b.useContext)(ZM);
	if (t != null) return t.stackId;
	if (e != null) return ys(e);
}, $M = (e, t) => `recharts-bar-stack-clip-path-${e}-${t}`, eN = (e) => {
	var t = (0, b.useContext)(ZM);
	if (t != null) {
		var n = t.stackId;
		return `url(#${$M(n, e)})`;
	}
}, tN = (e) => {
	var t = e.index, n = YM(e, qM), r = eN(t);
	return /*#__PURE__*/ b.createElement(de, JM({
		className: "recharts-bar-stack-layer",
		clipPath: r
	}, n));
}, nN = [
	"onMouseEnter",
	"onMouseLeave",
	"onClick"
], rN = [
	"value",
	"background",
	"tooltipPosition"
], iN = ["id"], aN = [
	"onMouseEnter",
	"onClick",
	"onMouseLeave"
];
function oN(e, t) {
	return dN(e) || uN(e, t) || cN(e, t) || sN();
}
function sN() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function cN(e, t) {
	if (e) {
		if (typeof e == "string") return lN(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? lN(e, t) : void 0;
	}
}
function lN(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function uN(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function dN(e) {
	if (Array.isArray(e)) return e;
}
function fN() {
	return fN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, fN.apply(null, arguments);
}
function pN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function mN(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? pN(Object(n), !0).forEach(function(t) {
			hN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function hN(e, t, n) {
	return (t = gN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function gN(e) {
	var t = _N(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function _N(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function vN(e, t) {
	if (e == null) return {};
	var n, r, i = yN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function yN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var bN = (e) => {
	var t = e.dataKey, n = e.name, r = e.fill, i = e.legendType;
	return [{
		inactive: e.hide,
		dataKey: t,
		type: i,
		color: r,
		value: As(n, t),
		payload: e
	}];
}, xN = /*#__PURE__*/ b.memo((e) => {
	var t = e.dataKey, n = e.stroke, r = e.strokeWidth, i = e.fill, a = e.name, o = e.hide, s = e.unit, c = e.formatter, l = e.tooltipType, u = e.id, d = {
		dataDefinedOnItem: void 0,
		getPosition: Le,
		settings: {
			stroke: n,
			strokeWidth: r,
			fill: i,
			dataKey: t,
			nameKey: void 0,
			name: As(a, t),
			hide: o,
			type: l,
			color: i,
			unit: s,
			formatter: c,
			graphicalItemId: u
		}
	};
	return /*#__PURE__*/ b.createElement(YD, { tooltipEntrySettings: d });
});
function SN(e) {
	var t = V(_C), n = e.data, r = e.dataKey, i = e.background, a = e.allOtherBarProps, o = a.onMouseEnter, s = a.onMouseLeave, c = a.onClick, l = vN(a, nN), u = KD(o, r, a.id), d = qD(s), f = JD(c, r, a.id);
	if (!i || n == null) return null;
	var p = P(i);
	return /*#__PURE__*/ b.createElement(Sw, { zIndex: Rk(i, dp.barBackground) }, n.map((e, n) => {
		e.value;
		var a = e.background;
		e.tooltipPosition;
		var o = vN(e, rN);
		if (!a) return null;
		var s = u(e, e.originalDataIndex), c = d(e, e.originalDataIndex), m = f(e, e.originalDataIndex), h = mN(mN(mN(mN(mN({
			option: i,
			isActive: String(e.originalDataIndex) === t
		}, o), {}, { fill: "#eee" }, a), p), Yt(l, e, n)), {}, {
			onMouseEnter: s,
			onMouseLeave: c,
			onClick: m,
			dataKey: r,
			index: n,
			className: "recharts-bar-background-rectangle"
		});
		return /*#__PURE__*/ b.createElement(FM, fN({ key: `background-bar-${n}` }, h));
	}));
}
function CN(e) {
	var t = e.showLabels, n = e.children, r = e.rects?.map((e) => {
		var t = {
			x: e.x,
			y: e.y,
			width: e.width,
			lowerWidth: e.width,
			upperWidth: e.width,
			height: e.height
		};
		return mN(mN({}, t), {}, {
			value: e.value,
			payload: e.payload,
			parentViewBox: e.parentViewBox,
			viewBox: t,
			fill: e.fill
		});
	});
	return /*#__PURE__*/ b.createElement(hD, { value: t ? r : void 0 }, n);
}
function wN(e) {
	var t = e.shape, n = e.activeBar, r = e.baseProps, i = e.entry, a = e.index, o = e.dataKey, s = V(_C), c = V(yC), l = n && String(i.originalDataIndex) === s && (c == null || o === c), u = s != null && (String(i.originalDataIndex) !== s || c != null && o !== c), d = oN((0, b.useState)(!1), 2), f = d[0], p = d[1], m = oN((0, b.useState)(!1), 2), h = m[0], g = m[1];
	(0, b.useEffect)(() => {
		var e;
		return l ? (p(!0), e = requestAnimationFrame(() => {
			g(!0);
		})) : (g(!1), u && p(!1)), () => {
			cancelAnimationFrame(e);
		};
	}, [l, u]);
	var _ = (0, b.useCallback)(() => {
		l || p(!1);
	}, [l]), v = l && h, y = l || f, x = l ? n === !0 ? t : n : t, S = /*#__PURE__*/ b.createElement(FM, fN({}, r, { name: String(r.name) }, i, {
		isActive: v,
		option: x,
		index: a,
		dataKey: o,
		animationElapsedTime: e.animationElapsedTime,
		isAnimating: e.isAnimating,
		isEntrance: e.isEntrance,
		onTransitionEnd: _
	}));
	return y ? /*#__PURE__*/ b.createElement(Sw, { zIndex: dp.activeBar }, /*#__PURE__*/ b.createElement(tN, { index: i.originalDataIndex }, S)) : S;
}
function TN(e) {
	var t = e.shape, n = e.baseProps, r = e.entry, i = e.index, a = e.dataKey;
	return /*#__PURE__*/ b.createElement(FM, fN({}, n, { name: String(n.name) }, r, {
		isActive: !1,
		option: t,
		index: i,
		dataKey: a,
		animationElapsedTime: e.animationElapsedTime,
		isAnimating: e.isAnimating,
		isEntrance: e.isEntrance
	}));
}
function EN(e) {
	var t = e.data, n = e.props, r = e.animationElapsedTime, i = e.isAnimating, a = e.isEntrance, o = N(n) ?? {}, s = o.id, c = vN(o, iN), l = n.shape, u = n.dataKey, d = n.activeBar, f = n.onMouseEnter, p = n.onClick, m = n.onMouseLeave, h = vN(n, aN), g = KD(f, u, s), _ = qD(m), v = JD(p, u, s);
	return t ? /*#__PURE__*/ b.createElement(b.Fragment, null, t.map((e, t) => /*#__PURE__*/ b.createElement(tN, fN({
		index: e.originalDataIndex,
		key: `rectangle-${e?.x}-${e?.y}-${e?.value}-${t}`,
		className: "recharts-bar-rectangle"
	}, Yt(h, e, t), {
		onMouseEnter: g(e, e.originalDataIndex),
		onMouseLeave: _(e, e.originalDataIndex),
		onClick: v(e, e.originalDataIndex)
	}), d ? /*#__PURE__*/ b.createElement(wN, {
		shape: l,
		activeBar: d,
		baseProps: c,
		entry: e,
		index: t,
		dataKey: u,
		animationElapsedTime: r,
		isAnimating: i,
		isEntrance: a
	}) : /*#__PURE__*/ b.createElement(TN, {
		shape: l,
		baseProps: c,
		entry: e,
		index: t,
		dataKey: u,
		animationElapsedTime: r,
		isAnimating: i,
		isEntrance: a
	})))) : null;
}
var DN = (e, t, n) => e == null ? [] : t === 1 ? e.flatMap((e) => e.status === "removed" ? [] : [e.next]) : e.flatMap((e) => {
	if (e.status === "removed") return n === "horizontal" ? [mN(mN({}, e.prev), {}, {
		height: Me(e.prev.height, 0, t),
		y: Me(e.prev.y, e.prev.y + e.prev.height, t)
	})] : [mN(mN({}, e.prev), {}, { width: Me(e.prev.width, 0, t) })];
	if (e.status === "matched") return [mN(mN({}, e.next), {}, {
		x: Me(e.prev.x, e.next.x, t),
		y: Me(e.prev.y, e.next.y, t),
		width: Me(e.prev.width, e.next.width, t),
		height: Me(e.prev.height, e.next.height, t)
	})];
	var r = e.next;
	return n === "horizontal" ? [mN(mN({}, r), {}, {
		height: Me(0, r.height, t),
		y: Me(r.stackedBarStart, r.y, t)
	})] : [mN(mN({}, r), {}, {
		width: Me(0, r.width, t),
		x: Me(r.stackedBarStart, r.x, t)
	})];
});
function ON(e) {
	var t = e.props, n = e.previousRectanglesRef, r = t.data, i = t.isAnimationActive, a = t.animationBegin, o = t.animationDuration, s = t.animationEasing, c = t.animationInterpolateFn, l = t.layout, u = vO(t.onAnimationStart, t.onAnimationEnd), d = u.isAnimating, f = u.handleAnimationStart, p = u.handleAnimationEnd;
	return /*#__PURE__*/ b.createElement(CN, {
		showLabels: !d,
		rects: r
	}, /*#__PURE__*/ b.createElement(yO, {
		animationInput: r,
		animationIdPrefix: "recharts-bar-",
		items: r,
		previousItemsRef: n,
		isAnimationActive: i,
		animationBegin: a,
		animationDuration: o,
		animationEasing: s,
		onAnimationStart: f,
		onAnimationEnd: p,
		animationInterpolateFn: c,
		animationMatchBy: t.animationMatchBy,
		layout: l
	}, (e, n, r) => /*#__PURE__*/ b.createElement(de, null, /*#__PURE__*/ b.createElement(EN, {
		props: t,
		data: e,
		animationElapsedTime: n,
		isAnimating: d || n < 1,
		isEntrance: r
	}))), /*#__PURE__*/ b.createElement(bD, { label: t.label }), t.children);
}
function kN(e) {
	var t = (0, b.useRef)(null);
	return /*#__PURE__*/ b.createElement(ON, {
		previousRectanglesRef: t,
		props: e
	});
}
var AN = 0, jN = (e, t) => {
	var n = Array.isArray(e.value) ? e.value[1] : e.value;
	return {
		x: e.x,
		y: e.y,
		value: n,
		errorVal: ds(e, t)
	};
}, MN = class extends b.PureComponent {
	render() {
		var e = this.props, t = e.hide, n = e.data, r = e.dataKey, i = e.className, a = e.xAxisId, o = e.yAxisId, s = e.needClip, c = e.background, l = e.id;
		if (t || n == null) return null;
		var u = O("recharts-bar", i), d = l;
		return /*#__PURE__*/ b.createElement(de, {
			className: u,
			id: l
		}, s && /*#__PURE__*/ b.createElement("defs", null, /*#__PURE__*/ b.createElement(Pj, {
			clipPathId: d,
			xAxisId: a,
			yAxisId: o
		})), /*#__PURE__*/ b.createElement(de, {
			className: "recharts-bar-rectangles",
			clipPath: s ? `url(#clipPath-${d})` : void 0
		}, /*#__PURE__*/ b.createElement(SN, {
			data: n,
			dataKey: r,
			background: c,
			allOtherBarProps: this.props
		}), /*#__PURE__*/ b.createElement(kN, this.props)));
	}
}, NN = {
	activeBar: !1,
	animationBegin: 0,
	animationDuration: 400,
	animationEasing: "ease",
	animationInterpolateFn: DN,
	animationMatchBy: iO,
	background: !1,
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "rect",
	minPointSize: AN,
	shape: PM,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: dp.bar
};
function PN(e) {
	var t = e.xAxisId, n = e.yAxisId, r = e.hide, i = e.legendType, a = e.minPointSize, o = e.activeBar, s = e.animationBegin, c = e.animationDuration, l = e.animationEasing, u = e.isAnimationActive, d = Nj(t, n).needClip, f = Vc(), p = ec(), m = ND(e.children, ST), h = V((t) => KM(t, e.id, p, m));
	if (f !== "vertical" && f !== "horizontal") return null;
	var g, _ = h?.[0];
	return g = _ == null || _.height == null || _.width == null ? 0 : f === "vertical" ? _.height / 2 : _.width / 2, /*#__PURE__*/ b.createElement(Mj, {
		xAxisId: t,
		yAxisId: n,
		data: h,
		dataPointFormatter: jN,
		errorBarOffset: g
	}, /*#__PURE__*/ b.createElement(MN, fN({}, e, {
		layout: f,
		needClip: d,
		data: h,
		xAxisId: t,
		yAxisId: n,
		hide: r,
		legendType: i,
		minPointSize: a,
		activeBar: o,
		animationBegin: s,
		animationDuration: c,
		animationEasing: l,
		isAnimationActive: u
	})));
}
function FN(e) {
	var t = e.layout, n = e.barSettings, r = n.dataKey, i = n.minPointSize, a = n.hasCustomShape, o = e.pos, s = e.bandSize, c = e.xAxis, l = e.yAxis, u = e.xAxisTicks, d = e.yAxisTicks, f = e.stackedData, p = e.displayedData, m = e.offset, h = e.cells, g = e.parentViewBox, _ = e.dataStartIndex, v = t === "horizontal" ? l : c, y = f ? v.scale.domain() : null, b = Ss({ numericAxis: v }), x = v.scale.map(b);
	return p.map((e, n) => {
		var p, v, S, C, w, T;
		if (f) {
			var E = f[n + _];
			if (E == null) return null;
			p = gs(E, y);
		} else p = ds(e, r), Array.isArray(p) || (p = [b, p]);
		var D = IM(i, AN)(p[1], n);
		if (t === "horizontal") {
			var O = l.scale.map(p[0]), k = l.scale.map(p[1]);
			if (O == null || k == null) return null;
			v = xs({
				axis: c,
				ticks: u,
				bandSize: s,
				offset: o.offset,
				entry: e,
				index: n
			}), S = k ?? O ?? void 0, C = o.size;
			var ee = O - k;
			if (w = Te(ee) ? 0 : ee, T = {
				x: v,
				y: m.top,
				width: C,
				height: m.height
			}, Math.abs(D) > 0 && Math.abs(w) < Math.abs(D)) {
				var A = we(w || D) * (Math.abs(D) - Math.abs(w));
				S -= A, w += A;
			}
		} else {
			var j = c.scale.map(p[0]), M = c.scale.map(p[1]);
			if (j == null || M == null) return null;
			if (v = j, S = xs({
				axis: l,
				ticks: d,
				bandSize: s,
				offset: o.offset,
				entry: e,
				index: n
			}), C = M - j, w = o.size, T = {
				x: m.left,
				y: S,
				width: m.width,
				height: w
			}, Math.abs(D) > 0 && Math.abs(C) < Math.abs(D)) {
				var N = we(C || D) * (Math.abs(D) - Math.abs(C));
				C += N;
			}
		}
		return v == null || S == null || C == null || w == null || !a && (C === 0 || w === 0) ? null : mN(mN({}, e), {}, {
			stackedBarStart: x,
			x: v,
			y: S,
			width: C,
			height: w,
			value: f ? p : p[1],
			payload: e,
			background: T,
			tooltipPosition: {
				x: v + C / 2,
				y: S + w / 2
			},
			parentViewBox: g,
			originalDataIndex: n
		}, h && h[n] && h[n].props);
	}).filter(Boolean);
}
function IN(e) {
	var t = tn(e, NN), n = QM(t.stackId), r = ec();
	return /*#__PURE__*/ b.createElement(kO, {
		id: t.id,
		type: "bar"
	}, (e) => /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(XD, { legendPayload: bN(t) }), /*#__PURE__*/ b.createElement(xN, {
		dataKey: t.dataKey,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		unit: t.unit,
		formatter: t.formatter,
		tooltipType: t.tooltipType,
		id: e
	}), /*#__PURE__*/ b.createElement(IO, {
		type: "bar",
		id: e,
		data: void 0,
		xAxisId: t.xAxisId,
		yAxisId: t.yAxisId,
		zAxisId: 0,
		dataKey: t.dataKey,
		stackId: n,
		hide: t.hide,
		barSize: t.barSize,
		minPointSize: t.minPointSize,
		maxBarSize: t.maxBarSize,
		isPanorama: r,
		hasCustomShape: t.shape != null && t.shape !== PM
	}), /*#__PURE__*/ b.createElement(Sw, { zIndex: t.zIndex }, /*#__PURE__*/ b.createElement(PN, fN({}, t, { id: e })))));
}
var LN = /*#__PURE__*/ b.memo(IN, hl);
LN.displayName = "Bar";
// analytics/node_modules/recharts/es6/util/axisPropsAreEqual.js
var RN = ["domain", "range"], zN = ["domain", "range"];
function BN(e, t) {
	if (e == null) return {};
	var n, r, i = VN(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function VN(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function HN(e, t) {
	return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function UN(e, t) {
	if (e === t) return !0;
	var n = e.domain, r = e.range, i = BN(e, RN), a = t.domain, o = t.range, s = BN(t, zN);
	return !HN(n, a) || !HN(r, o) ? !1 : hl(i, s);
}
// analytics/node_modules/recharts/es6/cartesian/XAxis.js
var WN = ["type"], GN = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], KN = ["id", "scale"];
function qN() {
	return qN = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, qN.apply(null, arguments);
}
function JN(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function YN(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? JN(Object(n), !0).forEach(function(t) {
			XN(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : JN(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function XN(e, t, n) {
	return (t = ZN(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ZN(e) {
	var t = QN(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function QN(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function $N(e, t) {
	if (e == null) return {};
	var n, r, i = eP(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function eP(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function tP(e) {
	var t = br(), n = (0, b.useRef)(null), r = Hc(), i = e.type, a = $N(e, WN), o = hp(r, "xAxis", i), s = (0, b.useMemo)(() => {
		if (o != null) return YN(YN({}, a), {}, { type: o });
	}, [a, o]);
	return (0, b.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(nk(s)) : n.current !== s && t(rk({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, b.useLayoutEffect)(() => () => {
		n.current &&= (t(ik(n.current)), null);
	}, [t]), null;
}
var nP = (e) => {
	var t = e.xAxisId, n = e.className, r = e.height, i = e.label, a = (0, b.useRef)(null), o = (0, b.useRef)(null), s = V(Qs), c = ec(), l = br(), u = "xAxis", d = V((e) => Kx(e, u, t, c)), f = V((e) => Px(e, t)), p = V((e) => zx(e, t)), m = V((e) => Gy(e, t));
	if ((0, b.useLayoutEffect)(() => {
		if (!(r !== "auto" || !f || QE(i) || /*#__PURE__*/ (0, b.isValidElement)(i) || m == null)) {
			var e = a.current;
			if (e) {
				var n = e.getCalculatedHeight();
				Math.round(f.height) !== Math.round(n) && l(lk({
					id: t,
					height: n
				}));
			}
		}
	}, [
		d,
		f,
		l,
		i,
		t,
		r,
		m
	]), f == null || p == null || m == null) return null;
	e.dangerouslySetInnerHTML, e.ticks, e.scale;
	var h = $N(e, GN);
	m.id, m.scale;
	var g = $N(m, KN);
	return /*#__PURE__*/ b.createElement(ej, qN({}, h, g, {
		ref: a,
		labelRef: o,
		x: p.x,
		y: p.y,
		width: f.width,
		height: f.height,
		className: O(`recharts-${u} ${u}`, n),
		viewBox: s,
		ticks: d,
		axisType: u,
		axisId: t
	}));
}, rP = {
	allowDataOverflow: Wy.allowDataOverflow,
	allowDecimals: Wy.allowDecimals,
	allowDuplicatedCategory: Wy.allowDuplicatedCategory,
	angle: Wy.angle,
	axisLine: GA.axisLine,
	height: Wy.height,
	hide: !1,
	includeHidden: Wy.includeHidden,
	interval: Wy.interval,
	label: !1,
	minTickGap: Wy.minTickGap,
	mirror: Wy.mirror,
	orientation: Wy.orientation,
	padding: Wy.padding,
	reversed: Wy.reversed,
	scale: Wy.scale,
	tick: Wy.tick,
	tickCount: Wy.tickCount,
	tickLine: GA.tickLine,
	tickSize: GA.tickSize,
	type: Wy.type,
	niceTicks: Wy.niceTicks,
	xAxisId: 0
}, iP = /*#__PURE__*/ b.memo((e) => {
	var t = tn(e, rP);
	return /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(tP, {
		allowDataOverflow: t.allowDataOverflow,
		allowDecimals: t.allowDecimals,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		angle: t.angle,
		dataKey: t.dataKey,
		domain: t.domain,
		height: t.height,
		hide: t.hide,
		id: t.xAxisId,
		includeHidden: t.includeHidden,
		interval: t.interval,
		minTickGap: t.minTickGap,
		mirror: t.mirror,
		name: t.name,
		orientation: t.orientation,
		padding: t.padding,
		reversed: t.reversed,
		scale: t.scale,
		tick: t.tick,
		tickCount: t.tickCount,
		tickFormatter: t.tickFormatter,
		ticks: t.ticks,
		type: t.type,
		unit: t.unit,
		niceTicks: t.niceTicks
	}), /*#__PURE__*/ b.createElement(nP, t));
}, UN);
iP.displayName = "XAxis";
// analytics/node_modules/recharts/es6/cartesian/YAxis.js
var aP = ["type"], oP = [
	"dangerouslySetInnerHTML",
	"ticks",
	"scale"
], sP = ["id", "scale"];
function cP() {
	return cP = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, cP.apply(null, arguments);
}
function lP(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function uP(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? lP(Object(n), !0).forEach(function(t) {
			dP(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : lP(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function dP(e, t, n) {
	return (t = fP(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function fP(e) {
	var t = pP(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function pP(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function mP(e, t) {
	if (e == null) return {};
	var n, r, i = hP(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function hP(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function gP(e) {
	var t = br(), n = (0, b.useRef)(null), r = Hc(), i = e.type, a = mP(e, aP), o = hp(r, "yAxis", i), s = (0, b.useMemo)(() => {
		if (o != null) return uP(uP({}, a), {}, { type: o });
	}, [o, a]);
	return (0, b.useLayoutEffect)(() => {
		s != null && (n.current === null ? t(ak(s)) : n.current !== s && t(ok({
			prev: n.current,
			next: s
		})), n.current = s);
	}, [s, t]), (0, b.useLayoutEffect)(() => () => {
		n.current &&= (t(sk(n.current)), null);
	}, [t]), null;
}
function _P(e) {
	var t = e.yAxisId, n = e.className, r = e.width, i = e.label, a = (0, b.useRef)(null), o = (0, b.useRef)(null), s = V(Qs), c = ec(), l = br(), u = "yAxis", d = V((e) => Vx(e, t)), f = V((e) => Bx(e, t)), p = V((e) => Kx(e, u, t, c)), m = V((e) => Jy(e, t));
	if ((0, b.useLayoutEffect)(() => {
		if (!(r !== "auto" || !d || QE(i) || /*#__PURE__*/ (0, b.isValidElement)(i) || m == null)) {
			var e = a.current;
			if (e) {
				var n = e.getCalculatedWidth();
				Math.round(d.width) !== Math.round(n) && l(ck({
					id: t,
					width: n
				}));
			}
		}
	}, [
		p,
		d,
		l,
		i,
		t,
		r,
		m
	]), d == null || f == null || m == null) return null;
	e.dangerouslySetInnerHTML, e.ticks, e.scale;
	var h = mP(e, oP);
	m.id, m.scale;
	var g = mP(m, sP);
	return /*#__PURE__*/ b.createElement(ej, cP({}, h, g, {
		ref: a,
		labelRef: o,
		x: f.x,
		y: f.y,
		tickTextProps: r === "auto" ? { width: void 0 } : { width: r },
		width: d.width,
		height: d.height,
		className: O(`recharts-${u} ${u}`, n),
		viewBox: s,
		ticks: p,
		axisType: u,
		axisId: t
	}));
}
var vP = {
	allowDataOverflow: qy.allowDataOverflow,
	allowDecimals: qy.allowDecimals,
	allowDuplicatedCategory: qy.allowDuplicatedCategory,
	angle: qy.angle,
	axisLine: GA.axisLine,
	hide: !1,
	includeHidden: qy.includeHidden,
	interval: qy.interval,
	label: !1,
	minTickGap: qy.minTickGap,
	mirror: qy.mirror,
	orientation: qy.orientation,
	padding: qy.padding,
	reversed: qy.reversed,
	scale: qy.scale,
	tick: qy.tick,
	tickCount: qy.tickCount,
	tickLine: GA.tickLine,
	tickSize: GA.tickSize,
	type: qy.type,
	niceTicks: qy.niceTicks,
	width: qy.width,
	yAxisId: 0
}, yP = /*#__PURE__*/ b.memo((e) => {
	var t = tn(e, vP);
	return /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(gP, {
		interval: t.interval,
		id: t.yAxisId,
		scale: t.scale,
		type: t.type,
		domain: t.domain,
		allowDataOverflow: t.allowDataOverflow,
		dataKey: t.dataKey,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		allowDecimals: t.allowDecimals,
		tickCount: t.tickCount,
		padding: t.padding,
		includeHidden: t.includeHidden,
		reversed: t.reversed,
		ticks: t.ticks,
		width: t.width,
		orientation: t.orientation,
		mirror: t.mirror,
		hide: t.hide,
		unit: t.unit,
		name: t.name,
		angle: t.angle,
		minTickGap: t.minTickGap,
		tick: t.tick,
		tickFormatter: t.tickFormatter,
		niceTicks: t.niceTicks
	}), /*#__PURE__*/ b.createElement(_P, t));
}, UN);
yP.displayName = "YAxis";
var bP = H([
	(e, t) => t,
	q,
	jp,
	Bp,
	uC,
	fC,
	GC,
	Xs
], rw);
// analytics/node_modules/recharts/es6/util/getRelativeCoordinate.js
function xP(e) {
	return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function SP(e) {
	var t = e.currentTarget.getBoundingClientRect(), n, r;
	if (xP(e)) {
		var i = e.currentTarget.getBBox();
		n = i.width > 0 ? t.width / i.width : 1, r = i.height > 0 ? t.height / i.height : 1;
	} else {
		var a = e.currentTarget;
		n = a.offsetWidth > 0 ? t.width / a.offsetWidth : 1, r = a.offsetHeight > 0 ? t.height / a.offsetHeight : 1;
	}
	var o = (e, i) => ({
		relativeX: Math.round((e - t.left) / n),
		relativeY: Math.round((i - t.top) / r)
	});
	return "touches" in e ? Array.from(e.touches).map((e) => o(e.clientX, e.clientY)) : o(e.clientX, e.clientY);
}
// analytics/node_modules/recharts/es6/state/mouseEventsMiddleware.js
var CP = Va("mouseClick"), wP = Yo();
wP.startListening({
	actionCreator: CP,
	effect: (e, t) => {
		var n = e.payload, r = bP(t.getState(), SP(n));
		r?.activeIndex != null && t.dispatch(hS({
			activeIndex: r.activeIndex,
			activeDataKey: void 0,
			activeCoordinate: r.activeCoordinate
		}));
	}
});
var TP = Va("mouseMove"), EP = Yo(), DP = null, OP = null, kP = null;
EP.startListening({
	actionCreator: TP,
	effect: (e, t) => {
		var n = e.payload, r = t.getState().eventSettings, i = r.throttleDelay, a = r.throttledEvents, o = a === "all" || a?.includes("mousemove");
		DP !== null && (cancelAnimationFrame(DP), DP = null), OP === null || typeof i == "number" && o || (clearTimeout(OP), OP = null), kP = SP(n);
		var s = () => {
			var e = t.getState(), n = $x(e, e.tooltip.settings.shared);
			if (!kP) DP = null, OP = null;
			else {
				if (n === "axis") {
					var r = bP(e, kP);
					r?.activeIndex == null ? t.dispatch(fS()) : t.dispatch(mS({
						activeIndex: r.activeIndex,
						activeDataKey: void 0,
						activeCoordinate: r.activeCoordinate
					}));
				}
				DP = null, OP = null;
			}
		};
		o ? i === "raf" ? DP = requestAnimationFrame(s) : typeof i == "number" && OP === null && (OP = setTimeout(s, i)) : s();
	}
});
// analytics/node_modules/recharts/es6/state/reduxDevtoolsJsonStringifyReplacer.js
function AP(e, t) {
	return t instanceof HTMLElement ? `HTMLElement <${t.tagName} class="${t.className}">` : t === window ? "global.window" : e === "children" && typeof t == "object" && t ? "<<CHILDREN>>" : t;
}
// analytics/node_modules/recharts/es6/state/rootPropsSlice.js
var jP = {
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	barSize: void 0,
	className: void 0,
	maxBarSize: void 0,
	stackOffset: "none",
	syncId: void 0,
	syncMethod: "index",
	baseValue: void 0,
	reverseStackOrder: !1
}, MP = lo({
	name: "rootProps",
	initialState: jP,
	reducers: { updateOptions: (e, t) => {
		e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = t.payload.barGap ?? jP.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
	} }
}), NP = MP.reducer, PP = MP.actions.updateOptions, FP = lo({
	name: "polarOptions",
	initialState: null,
	reducers: { updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e) }
});
FP.actions.updatePolarOptions;
var IP = FP.reducer, LP = Va("keyDown"), RP = Va("focus"), zP = Va("blur"), BP = Yo(), VP = null, HP = null, UP = null;
BP.startListening({
	actionCreator: LP,
	effect: (e, t) => {
		UP = e.payload, VP !== null && (cancelAnimationFrame(VP), VP = null);
		var n = t.getState().eventSettings, r = n.throttleDelay, i = n.throttledEvents, a = i === "all" || i.includes("keydown");
		HP === null || typeof r == "number" && a || (clearTimeout(HP), HP = null);
		var o = () => {
			try {
				var e = t.getState();
				if (e.rootProps.accessibilityLayer === !1) return;
				var n = e.tooltip.keyboardInteraction, r = UP;
				if (r !== "ArrowRight" && r !== "ArrowLeft" && r !== "Enter") return;
				var i = AS(n, QS(e), Eb(e), sC(e)), a = i == null ? -1 : Number(i), o = !Number.isFinite(a) || a < 0, s = fC(e), c = QS(e), l = $x(e, e.tooltip.settings.shared);
				if (r === "Enter") {
					if (o) return;
					var u = XC(e, l, "hover", String(n.index));
					t.dispatch(_S({
						active: !n.active,
						activeIndex: n.index,
						activeCoordinate: u
					}));
					return;
				}
				var d = Yx(e) === "left-to-right" ? 1 : -1, f = r === "ArrowRight" ? 1 : -1, p;
				if (o) {
					var m = Eb(e), h = sC(e), g = f * d, _ = (e) => ({
						active: !1,
						index: String(e),
						dataKey: void 0,
						graphicalItemId: void 0,
						coordinate: void 0
					});
					if (p = -1, g > 0) {
						for (var v = 0; v < c.length; v++) if (AS(_(v), c, m, h) != null) {
							p = v;
							break;
						}
					} else for (var y = c.length - 1; y >= 0; y--) if (AS(_(y), c, m, h) != null) {
						p = y;
						break;
					}
					if (p < 0) return;
				} else {
					p = a + f * d;
					var b = s?.length || c.length;
					if (b === 0 || p >= b || p < 0) return;
				}
				var x = XC(e, l, "hover", String(p));
				t.dispatch(_S({
					active: !0,
					activeIndex: p.toString(),
					activeCoordinate: x
				}));
			} finally {
				VP = null, HP = null;
			}
		};
		a ? r === "raf" ? VP = requestAnimationFrame(o) : typeof r == "number" && HP === null && (o(), UP = null, HP = setTimeout(() => {
			UP ? o() : (HP = null, VP = null);
		}, r)) : o();
	}
}), BP.startListening({
	actionCreator: RP,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var r = n.tooltip.keyboardInteraction;
			if (!r.active && r.index == null) {
				var i = "0", a = XC(n, $x(n, n.tooltip.settings.shared), "hover", String(i));
				t.dispatch(_S({
					active: !0,
					activeIndex: i,
					activeCoordinate: a
				}));
			}
		}
	}
}), BP.startListening({
	actionCreator: zP,
	effect: (e, t) => {
		var n = t.getState();
		if (n.rootProps.accessibilityLayer !== !1) {
			var r = n.tooltip.keyboardInteraction;
			r.active && t.dispatch(_S({
				active: !1,
				activeIndex: r.index,
				activeCoordinate: r.coordinate
			}));
		}
	}
});
// analytics/node_modules/recharts/es6/util/createEventProxy.js
function WP(e) {
	e.persist();
	var t = e.currentTarget;
	return new Proxy(e, { get: (e, n) => {
		if (n === "currentTarget") return t;
		var r = Reflect.get(e, n);
		return typeof r == "function" ? r.bind(e) : r;
	} });
}
// analytics/node_modules/recharts/es6/state/externalEventsMiddleware.js
var GP = Va("externalEvent"), KP = Yo(), qP = /* @__PURE__ */ new Map(), JP = /* @__PURE__ */ new Map(), YP = /* @__PURE__ */ new Map();
KP.startListening({
	actionCreator: GP,
	effect: (e, t) => {
		var n = e.payload, r = n.handler, i = n.reactEvent;
		if (r != null) {
			var a = i.type, o = WP(i);
			YP.set(a, {
				handler: r,
				reactEvent: o
			});
			var s = qP.get(a);
			s !== void 0 && (cancelAnimationFrame(s), qP.delete(a));
			var c = t.getState().eventSettings, l = c.throttleDelay, u = c.throttledEvents, d = u === "all" || u?.includes(a), f = JP.get(a);
			f === void 0 || typeof l == "number" && d || (clearTimeout(f), JP.delete(a));
			var p = () => {
				var e = YP.get(a);
				try {
					if (!e) return;
					var n = e.handler, r = e.reactEvent, i = t.getState(), o = {
						activeCoordinate: SC(i),
						activeDataKey: yC(i),
						activeIndex: _C(i),
						activeLabel: vC(i),
						activeTooltipIndex: _C(i),
						isTooltipActive: CC(i)
					};
					n && n(o, r);
				} finally {
					qP.delete(a), JP.delete(a), YP.delete(a);
				}
			};
			if (!d) p();
			else if (l === "raf") {
				var m = requestAnimationFrame(p);
				qP.set(a, m);
			} else if (typeof l == "number") {
				if (!JP.has(a)) {
					p();
					var h = setTimeout(p, l);
					JP.set(a, h);
				}
			} else p();
		}
	}
});
var XP = H([
	H([PS], (e) => e.tooltipItemPayloads),
	(e, t) => t,
	(e, t, n) => n
], (e, t, n) => {
	if (t != null) {
		var r = e.find((e) => e.settings.graphicalItemId === n);
		if (r != null) {
			var i = r.getPosition;
			if (i != null) return i(t);
		}
	}
}), ZP = Va("touchMove"), QP = Yo(), $P = null, eF = null, tF = null, nF = null;
QP.startListening({
	actionCreator: ZP,
	effect: (e, t) => {
		var n = e.payload;
		if (n.touches != null && n.touches.length !== 0) {
			nF = WP(n);
			var r = t.getState().eventSettings, i = r.throttleDelay, a = r.throttledEvents, o = a === "all" || a.includes("touchmove");
			$P !== null && (cancelAnimationFrame($P), $P = null), eF === null || typeof i == "number" && o || (clearTimeout(eF), eF = null), tF = Array.from(n.touches).map((e) => SP({
				clientX: e.clientX,
				clientY: e.clientY,
				currentTarget: n.currentTarget
			}));
			var s = () => {
				if (nF != null) {
					var e = t.getState(), n = $x(e, e.tooltip.settings.shared);
					if (n === "axis") {
						var r = tF?.[0];
						if (r == null) {
							$P = null, eF = null;
							return;
						}
						var i = bP(e, r);
						i?.activeIndex != null && t.dispatch(mS({
							activeIndex: i.activeIndex,
							activeDataKey: void 0,
							activeCoordinate: i.activeCoordinate
						}));
					} else if (n === "item") {
						var a = nF.touches[0];
						if (document.elementFromPoint == null || a == null) return;
						var o = document.elementFromPoint(a.clientX, a.clientY);
						if (!o || !o.getAttribute) return;
						var s = o.getAttribute(zs), c = o.getAttribute("data-recharts-item-id") ?? void 0, l = JS(e).find((e) => e.id === c);
						if (s == null || l == null || c == null) return;
						var u = l.dataKey, d = XP(e, s, c);
						t.dispatch(uS({
							activeDataKey: u,
							activeIndex: s,
							activeCoordinate: d,
							activeGraphicalItemId: c
						}));
					}
					$P = null, eF = null;
				}
			};
			o ? i === "raf" ? $P = requestAnimationFrame(s) : typeof i == "number" && eF === null && (s(), nF = null, eF = setTimeout(() => {
				nF ? s() : (eF = null, $P = null);
			}, i)) : s();
		}
	}
});
// analytics/node_modules/recharts/es6/state/eventSettingsSlice.js
var rF = {
	throttleDelay: "raf",
	throttledEvents: [
		"mousemove",
		"touchmove",
		"pointermove",
		"scroll",
		"wheel"
	]
}, iF = lo({
	name: "eventSettings",
	initialState: rF,
	reducers: { setEventSettings: (e, t) => {
		t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = W(t.payload.throttledEvents));
	} }
}), aF = iF.actions.setEventSettings, oF = iF.reducer, sF = fi({
	brush: Hk,
	cartesianAxis: uk,
	chartData: qw,
	errorBars: Dj,
	eventSettings: oF,
	graphicalItems: FO,
	layout: rs,
	legend: Zc,
	options: Bw,
	polarAxis: TD,
	polarOptions: IP,
	referenceElements: qk,
	renderedTicks: kA,
	rootProps: NP,
	tooltip: vS,
	zIndex: bw
}), cF = function(e) {
	var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
	return $a({
		reducer: sF,
		preloadedState: e,
		middleware: (e) => e({
			serializableCheck: !1,
			immutableCheck: ![
				"commonjs",
				"es6",
				"production"
			].includes("es6")
		}).concat([
			wP.middleware,
			EP.middleware,
			BP.middleware,
			KP.middleware,
			QP.middleware
		]),
		enhancers: (e) => {
			var t = e;
			return typeof e == "function" && (t = e()), t.concat(Za({ type: "raf" }));
		},
		devTools: Rl.devToolsEnabled && {
			serialize: { replacer: AP },
			name: `recharts-${t}`
		}
	});
};
// analytics/node_modules/recharts/es6/state/RechartsStoreProvider.js
function lF(e) {
	var t = e.preloadedState, n = e.children, r = e.reduxStoreName, i = ec(), a = (0, b.useRef)(null);
	if (i) return n;
	a.current ??= cF(t, r);
	var o = _r;
	return /*#__PURE__*/ b.createElement(fl, {
		context: o,
		store: a.current
	}, n);
}
// analytics/node_modules/recharts/es6/state/ReportMainChartProps.js
function uF(e) {
	var t = e.layout, n = e.margin, r = br(), i = ec();
	return (0, b.useEffect)(() => {
		i || (r(es(t)), r($o(n)));
	}, [
		r,
		i,
		t,
		n
	]), null;
}
var dF = /*#__PURE__*/ (0, b.memo)(uF, hl);
// analytics/node_modules/recharts/es6/state/ReportChartProps.js
function fF(e) {
	var t = br();
	return (0, b.useEffect)(() => {
		t(PP(e));
	}, [t, e]), null;
}
var pF = /*#__PURE__*/ (0, b.memo)((e) => {
	var t = br();
	return (0, b.useEffect)(() => {
		t(aF(e));
	}, [t, e]), null;
}, hl);
// analytics/node_modules/recharts/es6/zIndex/ZIndexPortal.js
function mF(e) {
	var t = e.zIndex, n = e.isPanorama, r = (0, b.useRef)(null), i = br();
	return (0, b.useLayoutEffect)(() => (r.current && i(vw({
		zIndex: t,
		element: r.current,
		isPanorama: n
	})), () => {
		i(yw({
			zIndex: t,
			isPanorama: n
		}));
	}), [
		i,
		t,
		n
	]), /*#__PURE__*/ b.createElement("g", {
		tabIndex: -1,
		ref: r,
		className: `recharts-zIndex-layer_${t}`
	});
}
function hF(e) {
	var t = e.children, n = e.isPanorama, r = V(aw);
	if (!r || r.length === 0) return t;
	var i = r.filter((e) => e < 0), a = r.filter((e) => e > 0);
	return /*#__PURE__*/ b.createElement(b.Fragment, null, i.map((e) => /*#__PURE__*/ b.createElement(mF, {
		key: e,
		zIndex: e,
		isPanorama: n
	})), t, a.map((e) => /*#__PURE__*/ b.createElement(mF, {
		key: e,
		zIndex: e,
		isPanorama: n
	})));
}
// analytics/node_modules/recharts/es6/container/RootSurface.js
var gF = ["children"];
function _F(e, t) {
	if (e == null) return {};
	var n, r, i = vF(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function vF(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function yF() {
	return yF = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, yF.apply(null, arguments);
}
var bF = {
	width: "100%",
	height: "100%",
	display: "block"
}, xF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = zc(), r = Bc(), i = ou();
	if (!as(n) || !as(r)) return null;
	var a = e.children, o = e.otherAttributes, s = e.title, c = e.desc, l, u;
	return o != null && (l = typeof o.tabIndex == "number" ? o.tabIndex : i ? 0 : void 0, u = typeof o.role == "string" ? o.role : i ? "application" : void 0), /*#__PURE__*/ b.createElement(oe, yF({}, o, {
		title: s,
		desc: c,
		role: u,
		tabIndex: l,
		width: n,
		height: r,
		style: bF,
		ref: t
	}), a);
}), SF = (e) => {
	var t = e.children, n = V(nc);
	if (!n) return null;
	var r = n.width, i = n.height, a = n.y, o = n.x;
	return /*#__PURE__*/ b.createElement(oe, {
		width: r,
		height: i,
		x: o,
		y: a
	}, t);
}, CF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.children, r = _F(e, gF);
	return ec() ? /*#__PURE__*/ b.createElement(SF, null, /*#__PURE__*/ b.createElement(hF, { isPanorama: !0 }, n)) : /*#__PURE__*/ b.createElement(xF, yF({ ref: t }, r), /*#__PURE__*/ b.createElement(hF, { isPanorama: !1 }, n));
});
// analytics/node_modules/recharts/es6/util/useReportScale.js
function wF(e, t) {
	return kF(e) || OF(e, t) || EF(e, t) || TF();
}
function TF() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function EF(e, t) {
	if (e) {
		if (typeof e == "string") return DF(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? DF(e, t) : void 0;
	}
}
function DF(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function OF(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function kF(e) {
	if (Array.isArray(e)) return e;
}
function AF() {
	var e = br(), t = wF((0, b.useState)(null), 2), n = t[0], r = t[1], i = V(Fs);
	return (0, b.useEffect)(() => {
		if (n != null) {
			var t = n.getBoundingClientRect().width / n.offsetWidth;
			K(t) && t !== i && e(ns(t));
		}
	}, [
		n,
		e,
		i
	]), r;
}
// analytics/node_modules/recharts/es6/chart/RechartsWrapper.js
function jF(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function MF(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? jF(Object(n), !0).forEach(function(t) {
			NF(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jF(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function NF(e, t, n) {
	return (t = PF(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function PF(e) {
	var t = FF(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function FF(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function IF() {
	return IF = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, IF.apply(null, arguments);
}
function LF(e, t) {
	return HF(e) || VF(e, t) || zF(e, t) || RF();
}
function RF() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function zF(e, t) {
	if (e) {
		if (typeof e == "string") return BF(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? BF(e, t) : void 0;
	}
}
function BF(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function VF(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function HF(e) {
	if (Array.isArray(e)) return e;
}
var UF = () => (iT(), null);
function WF(e) {
	if (typeof e == "number") return e;
	if (typeof e == "string") {
		var t = parseFloat(e);
		if (!Number.isNaN(t)) return t;
	}
	return 0;
}
var GF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = (0, b.useRef)(null), r = LF((0, b.useState)({
		containerWidth: WF(e.style?.width),
		containerHeight: WF(e.style?.height)
	}), 2), i = r[0], a = r[1], o = (0, b.useCallback)((e, t) => {
		a((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), s = (0, b.useCallback)((e) => {
		if (typeof t == "function" && t(e), n.current != null && (n.current.disconnect(), n.current = null), e != null && typeof ResizeObserver < "u") {
			var r = e.getBoundingClientRect(), i = r.width, a = r.height;
			o(i, a);
			var s = new ResizeObserver((e) => {
				var t = e[0];
				if (t != null) {
					var n = t.contentRect, r = n.width, i = n.height;
					o(r, i);
				}
			});
			s.observe(e), n.current = s;
		}
	}, [t, o]);
	return (0, b.useEffect)(() => () => {
		n.current?.disconnect();
	}, [o]), /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(Gc, {
		width: i.containerWidth,
		height: i.containerHeight
	}), /*#__PURE__*/ b.createElement("div", IF({ ref: s }, e)));
}), KF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.width, r = e.height, i = LF((0, b.useState)({
		containerWidth: WF(n),
		containerHeight: WF(r)
	}), 2), a = i[0], o = i[1], s = (0, b.useCallback)((e, t) => {
		o((n) => {
			var r = Math.round(e), i = Math.round(t);
			return n.containerWidth === r && n.containerHeight === i ? n : {
				containerWidth: r,
				containerHeight: i
			};
		});
	}, []), c = (0, b.useCallback)((e) => {
		if (typeof t == "function" && t(e), e != null) {
			var n = e.getBoundingClientRect(), r = n.width, i = n.height;
			s(r, i);
		}
	}, [t, s]);
	return /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(Gc, {
		width: a.containerWidth,
		height: a.containerHeight
	}), /*#__PURE__*/ b.createElement("div", IF({ ref: c }, e)));
}), qF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.width, r = e.height;
	return /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(Gc, {
		width: n,
		height: r
	}), /*#__PURE__*/ b.createElement("div", IF({ ref: t }, e)));
}), JF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.width, r = e.height;
	return typeof n == "string" || typeof r == "string" ? /*#__PURE__*/ b.createElement(KF, IF({}, e, { ref: t })) : typeof n == "number" && typeof r == "number" ? /*#__PURE__*/ b.createElement(qF, IF({}, e, {
		width: n,
		height: r,
		ref: t
	})) : /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(Gc, {
		width: n,
		height: r
	}), /*#__PURE__*/ b.createElement("div", IF({ ref: t }, e)));
});
function YF(e) {
	return e ? GF : JF;
}
var XF = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.children, r = e.className, i = e.height, a = e.onClick, o = e.onContextMenu, s = e.onDoubleClick, c = e.onMouseDown, l = e.onMouseEnter, u = e.onMouseLeave, d = e.onMouseMove, f = e.onMouseUp, p = e.onTouchEnd, m = e.onTouchMove, h = e.onTouchStart, g = e.style, _ = e.width, v = e.responsive, y = e.dispatchTouchEvents, x = y === void 0 || y, S = (0, b.useRef)(null), C = br(), w = LF((0, b.useState)(null), 2), T = w[0], E = w[1], D = LF((0, b.useState)(null), 2), k = D[0], ee = D[1], A = AF(), j = Nc(), M = j?.width > 0 ? j.width : _, N = j?.height > 0 ? j.height : i, P = (0, b.useCallback)((e) => {
		A(e), typeof t == "function" && t(e), E(e), ee(e), e != null && (S.current = e);
	}, [
		A,
		t,
		E,
		ee
	]), te = (0, b.useCallback)((e) => {
		C(CP(e)), C(GP({
			handler: a,
			reactEvent: e
		}));
	}, [C, a]), ne = (0, b.useCallback)((e) => {
		C(TP(e)), C(GP({
			handler: l,
			reactEvent: e
		}));
	}, [C, l]), re = (0, b.useCallback)((e) => {
		C(fS()), C(GP({
			handler: u,
			reactEvent: e
		}));
	}, [C, u]), ie = (0, b.useCallback)((e) => {
		C(TP(e)), C(GP({
			handler: d,
			reactEvent: e
		}));
	}, [C, d]), ae = (0, b.useCallback)(() => {
		C(RP());
	}, [C]), F = (0, b.useCallback)(() => {
		C(zP());
	}, [C]), oe = (0, b.useCallback)((e) => {
		C(LP(e.key));
	}, [C]), se = (0, b.useCallback)((e) => {
		C(GP({
			handler: o,
			reactEvent: e
		}));
	}, [C, o]), ce = (0, b.useCallback)((e) => {
		C(GP({
			handler: s,
			reactEvent: e
		}));
	}, [C, s]), le = (0, b.useCallback)((e) => {
		C(GP({
			handler: c,
			reactEvent: e
		}));
	}, [C, c]), ue = (0, b.useCallback)((e) => {
		C(GP({
			handler: f,
			reactEvent: e
		}));
	}, [C, f]), de = (0, b.useCallback)((e) => {
		C(GP({
			handler: h,
			reactEvent: e
		}));
	}, [C, h]), fe = (0, b.useCallback)((e) => {
		x && C(ZP(e)), C(GP({
			handler: m,
			reactEvent: e
		}));
	}, [
		C,
		x,
		m
	]), pe = (0, b.useCallback)((e) => {
		C(GP({
			handler: p,
			reactEvent: e
		}));
	}, [C, p]), me = YF(v);
	return /*#__PURE__*/ b.createElement(Mw.Provider, { value: T }, /*#__PURE__*/ b.createElement(qe.Provider, { value: k }, /*#__PURE__*/ b.createElement(me, {
		width: M ?? g?.width,
		height: N ?? g?.height,
		className: O("recharts-wrapper", r),
		style: MF({
			position: "relative",
			cursor: "default",
			width: M,
			height: N
		}, g),
		onClick: te,
		onContextMenu: se,
		onDoubleClick: ce,
		onFocus: ae,
		onBlur: F,
		onKeyDown: oe,
		onMouseDown: le,
		onMouseEnter: ne,
		onMouseLeave: re,
		onMouseMove: ie,
		onMouseUp: ue,
		onTouchEnd: pe,
		onTouchMove: fe,
		onTouchStart: de,
		ref: P
	}, /*#__PURE__*/ b.createElement(UF, null), n)));
}), ZF = [
	"width",
	"height",
	"responsive",
	"children",
	"className",
	"style",
	"compact",
	"title",
	"desc"
];
function QF(e, t) {
	if (e == null) return {};
	var n, r, i = $F(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function $F(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var eI = /*#__PURE__*/ (0, b.forwardRef)((e, t) => {
	var n = e.width, r = e.height, i = e.responsive, a = e.children, o = e.className, s = e.style, c = e.compact, l = e.title, u = e.desc, d = N(QF(e, ZF));
	return c ? /*#__PURE__*/ b.createElement(b.Fragment, null, /*#__PURE__*/ b.createElement(Gc, {
		width: n,
		height: r
	}), /*#__PURE__*/ b.createElement(CF, {
		otherAttributes: d,
		title: l,
		desc: u
	}, a)) : /*#__PURE__*/ b.createElement(XF, {
		className: o,
		style: s,
		width: n,
		height: r,
		responsive: i ?? !1,
		onClick: e.onClick,
		onMouseLeave: e.onMouseLeave,
		onMouseEnter: e.onMouseEnter,
		onMouseMove: e.onMouseMove,
		onMouseDown: e.onMouseDown,
		onMouseUp: e.onMouseUp,
		onContextMenu: e.onContextMenu,
		onDoubleClick: e.onDoubleClick,
		onTouchStart: e.onTouchStart,
		onTouchMove: e.onTouchMove,
		onTouchEnd: e.onTouchEnd
	}, /*#__PURE__*/ b.createElement(CF, {
		otherAttributes: d,
		title: l,
		desc: u,
		ref: t
	}, /*#__PURE__*/ b.createElement(tA, null, a)));
});
// analytics/node_modules/recharts/es6/chart/CartesianChart.js
function tI() {
	return tI = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, tI.apply(null, arguments);
}
function nI(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function rI(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? nI(Object(n), !0).forEach(function(t) {
			iI(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : nI(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function iI(e, t, n) {
	return (t = aI(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function aI(e) {
	var t = oI(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function oI(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var sI = rI({
	accessibilityLayer: !0,
	barCategoryGap: "10%",
	barGap: 4,
	layout: "horizontal",
	margin: {
		top: 5,
		right: 5,
		bottom: 5,
		left: 5
	},
	responsive: !1,
	reverseStackOrder: !1,
	stackOffset: "none",
	syncMethod: "index"
}, rF), cI = /*#__PURE__*/ (0, b.forwardRef)(function(e, t) {
	var n = tn(e.categoricalChartProps, sI), r = e.chartName, i = e.defaultTooltipEventType, a = e.validateTooltipEventTypes, o = e.tooltipPayloadSearcher, s = e.categoricalChartProps, c = {
		chartName: r,
		defaultTooltipEventType: i,
		validateTooltipEventTypes: a,
		tooltipPayloadSearcher: o,
		eventEmitter: void 0
	};
	return /*#__PURE__*/ b.createElement(lF, {
		preloadedState: { options: c },
		reduxStoreName: s.id ?? r
	}, /*#__PURE__*/ b.createElement(zk, { chartData: s.data }), /*#__PURE__*/ b.createElement(dF, {
		layout: n.layout,
		margin: n.margin
	}), /*#__PURE__*/ b.createElement(pF, {
		throttleDelay: n.throttleDelay,
		throttledEvents: n.throttledEvents
	}), /*#__PURE__*/ b.createElement(fF, {
		baseValue: n.baseValue,
		accessibilityLayer: n.accessibilityLayer,
		barCategoryGap: n.barCategoryGap,
		maxBarSize: n.maxBarSize,
		stackOffset: n.stackOffset,
		barGap: n.barGap,
		barSize: n.barSize,
		syncId: n.syncId,
		syncMethod: n.syncMethod,
		className: n.className,
		reverseStackOrder: n.reverseStackOrder
	}), /*#__PURE__*/ b.createElement(eI, tI({}, n, { ref: t })));
}), lI = ["axis", "item"], uI = /*#__PURE__*/ (0, b.forwardRef)((e, t) => /*#__PURE__*/ b.createElement(cI, {
	chartName: "BarChart",
	defaultTooltipEventType: "axis",
	validateTooltipEventTypes: lI,
	tooltipPayloadSearcher: Rw,
	categoricalChartProps: e,
	ref: t
})), dI = ["axis"], fI = /*#__PURE__*/ (0, b.forwardRef)((e, t) => /*#__PURE__*/ b.createElement(cI, {
	chartName: "AreaChart",
	defaultTooltipEventType: "axis",
	validateTooltipEventTypes: dI,
	tooltipPayloadSearcher: Rw,
	categoricalChartProps: e,
	ref: t
})), pI = (e) => e?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
// analytics/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function mI(e, t, n = []) {
	if (t == null) throw Error("[lucide]: iconNode is required when icon name is used");
	return {
		name: pI(e),
		size: 24,
		node: t,
		...n.length > 0 ? { aliases: n } : {}
	};
}
// analytics/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var hI = (e) => {
	let t = "", n = !1;
	for (let r of e) r === "-" || r === "_" || r <= " " ? n = t.length > 0 : (t.length === 0 ? t += r.toLowerCase() : t += n ? r.toUpperCase() : r, n = !1);
	return t;
}, gI = (e) => {
	let t = hI(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, _I = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), vI = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
// analytics/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function yI(e) {
	return e != null;
}
function bI(e, t = {}) {
	let n = t.attributeNames ?? {}, r = (e) => n[e] ?? e, i = e.size ?? e.width ?? vI.width, a = e.size ?? e.height ?? vI.height, o = e.aliases?.filter((e) => typeof e == "string" && e.trim() !== "").map((e) => `lucide-${e}`) ?? [], s = [...e.name ? [`lucide-${e.name}`] : [], ...o], c = t.className?.split(" ").filter(Boolean) ?? [], l = t.includeDefaultClasses === !1 ? _I(...c) : _I("lucide", ...s, ...c), u = t.absoluteStrokeWidth ? Number(t.strokeWidth ?? vI["stroke-width"]) * Number(e.size ?? e.width ?? vI.width) / Number(t.size ?? t.width ?? vI.width) : t.strokeWidth ?? vI["stroke-width"];
	return [
		"svg",
		{
			...Object.entries(vI).reduce((e, [t, n]) => (e[r(t)] = n, e), {}),
			..."color" in t && t.color && { [r("stroke")]: t.color },
			..."size" in t && yI(t.size) && {
				[r("width")]: t.size,
				[r("height")]: t.size
			},
			..."width" in t && yI(t.width) && { [r("width")]: t.width },
			..."height" in t && yI(t.height) && { [r("height")]: t.height },
			[r("stroke-width")]: u,
			...l && { [r("class")]: l },
			[r("viewBox")]: `0 0 ${i} ${a}`,
			...t.hasA11yProp === !1 ? { [r("aria-hidden")]: "true" } : {},
			..."attributes" in t && t.attributes
		},
		e.node.map((e) => {
			let [n, i, a] = e, o = t.nonScalingStroke ? {
				[r("vector-effect")]: "non-scaling-stroke",
				...i
			} : i;
			return a ? [
				n,
				o,
				a
			] : [n, o];
		})
	];
}
// analytics/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function xI(e, t = {}) {
	return bI(e, {
		...t,
		attributeNames: {
			...t.attributeNames,
			class: "className",
			"stroke-width": "strokeWidth",
			"stroke-linecap": "strokeLinecap",
			"stroke-linejoin": "strokeLinejoin",
			"vector-effect": "vectorEffect"
		}
	});
}
// analytics/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var SI = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, CI = (0, b.createContext)({}), wI = () => (0, b.useContext)(CI), TI = (0, b.forwardRef)(({ color: e, size: t, width: n, height: r, strokeWidth: i, absoluteStrokeWidth: a, nonScalingStroke: o, className: s = "", children: c, iconNode: l = [], icon: u = {
	node: l,
	aliases: [],
	size: 24
}, ...d }, f) => {
	let { size: p = 24, strokeWidth: m = 2, absoluteStrokeWidth: h = !1, nonScalingStroke: g = !1, color: _ = "currentColor", className: v = "" } = wI() ?? {}, y = !!c || SI(d), [x, S, C = []] = xI(u, {
		color: e ?? _,
		width: n ?? t ?? p,
		height: r ?? t ?? p,
		strokeWidth: i ?? m,
		absoluteStrokeWidth: a ?? h,
		nonScalingStroke: o ?? g,
		className: _I(v, s),
		hasA11yProp: y,
		attributes: d
	});
	return (0, b.createElement)(x, {
		ref: f,
		...S
	}, [...C.map(([e, t]) => (0, b.createElement)(e, t)), ...Array.isArray(c) ? c : [c]]);
});
// analytics/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function EI(e, t = [], n = []) {
	let r = typeof e == "string" ? mI(e, t, n) : e, i = (0, b.forwardRef)(({ className: e, ...t }, n) => (0, b.createElement)(TI, {
		ref: n,
		icon: r,
		className: e,
		...t
	}));
	return r.name && (i.displayName = gI(r.name)), i;
}
// analytics/node_modules/lucide-react/dist/esm/icons/arrow-down-right.mjs
var DI = {
	name: "arrow-down-right",
	size: 24,
	node: [["path", {
		d: "m7 7 10 10",
		key: "1fmybs"
	}], ["path", {
		d: "M17 7v10H7",
		key: "6fjiku"
	}]]
};
DI.node;
var OI = EI(DI), kI = {
	name: "arrow-up-to-line",
	size: 24,
	node: [
		["path", {
			d: "M5 3h14",
			key: "7usisc"
		}],
		["path", {
			d: "m18 13-6-6-6 6",
			key: "1kf1n9"
		}],
		["path", {
			d: "M12 7v14",
			key: "1akyts"
		}]
	]
};
kI.node;
var AI = EI(kI), jI = {
	name: "arrow-up-right",
	size: 24,
	node: [["path", {
		d: "M7 7h10v10",
		key: "1tivn9"
	}], ["path", {
		d: "M7 17 17 7",
		key: "1vkiza"
	}]]
};
jI.node;
var MI = EI(jI), NI = {
	name: "audio-lines",
	size: 24,
	node: [
		["path", {
			d: "M2 10v3",
			key: "1fnikh"
		}],
		["path", {
			d: "M6 6v11",
			key: "11sgs0"
		}],
		["path", {
			d: "M10 3v18",
			key: "yhl04a"
		}],
		["path", {
			d: "M14 8v7",
			key: "3a1oy3"
		}],
		["path", {
			d: "M18 5v13",
			key: "123xd1"
		}],
		["path", {
			d: "M22 10v3",
			key: "154ddg"
		}]
	]
};
NI.node;
var PI = EI(NI), FI = {
	name: "calendar-days",
	size: 24,
	node: [
		["path", {
			d: "M8 2v3",
			key: "1ioesn"
		}],
		["path", {
			d: "M16 2v3",
			key: "otl347"
		}],
		["rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2",
			key: "h1oib"
		}],
		["path", {
			d: "M3 9h18",
			key: "1pudct"
		}],
		["path", {
			d: "M8 13h.01",
			key: "1sbv64"
		}],
		["path", {
			d: "M12 13h.01",
			key: "y0uutt"
		}],
		["path", {
			d: "M16 13h.01",
			key: "wip0gl"
		}],
		["path", {
			d: "M8 17h.01",
			key: "p3bg7i"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}],
		["path", {
			d: "M16 17h.01",
			key: "ql8jdd"
		}]
	]
};
FI.node;
var II = EI(FI), LI = {
	name: "camera",
	size: 24,
	node: [["path", {
		d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
		key: "18u6gg"
	}], ["circle", {
		cx: "12",
		cy: "13",
		r: "3",
		key: "1vg3eu"
	}]]
};
LI.node;
var RI = EI(LI), zI = {
	name: "chart-column",
	size: 24,
	node: [
		["path", {
			d: "M3 3v16a2 2 0 0 0 2 2h16",
			key: "c24i48"
		}],
		["path", {
			d: "M18 17V9",
			key: "2bz60n"
		}],
		["path", {
			d: "M13 17V5",
			key: "1frdt8"
		}],
		["path", {
			d: "M8 17v-3",
			key: "17ska0"
		}]
	],
	aliases: ["bar-chart-3"]
};
zI.node;
var BI = EI(zI), VI = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
VI.node;
var HI = EI(VI), UI = {
	name: "chevron-down",
	size: 24,
	node: [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]
};
UI.node;
var WI = EI(UI), GI = {
	name: "chevron-right",
	size: 24,
	node: [["path", {
		d: "m9 18 6-6-6-6",
		key: "mthhwq"
	}]]
};
GI.node;
var KI = EI(GI), qI = {
	name: "circle-question-mark",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["path", {
			d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
			key: "1u773s"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	],
	aliases: ["help-circle", "circle-help"]
};
qI.node;
var JI = EI(qI), YI = {
	name: "eye",
	size: 24,
	node: [["path", {
		d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
		key: "1nclc0"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]
};
YI.node;
var XI = EI(YI), ZI = {
	name: "flame",
	size: 24,
	node: [["path", {
		d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
		key: "1slcih"
	}]]
};
ZI.node;
var QI = EI(ZI), $I = {
	name: "image",
	size: 24,
	node: [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			ry: "2",
			key: "1m3agn"
		}],
		["circle", {
			cx: "9",
			cy: "9",
			r: "2",
			key: "af1f0g"
		}],
		["path", {
			d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
			key: "1xmnt7"
		}]
	]
};
$I.node;
var eL = EI($I), tL = {
	name: "layers",
	size: 24,
	node: [
		["path", {
			d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
			key: "zw3jo"
		}],
		["path", {
			d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
			key: "1wduqc"
		}],
		["path", {
			d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
			key: "kqbvx6"
		}]
	],
	aliases: ["layers-3"]
};
tL.node;
var nL = EI(tL), rL = {
	name: "layout-dashboard",
	size: 24,
	node: [
		["rect", {
			width: "7",
			height: "9",
			x: "3",
			y: "3",
			rx: "1",
			key: "10lvy0"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "14",
			y: "3",
			rx: "1",
			key: "16une8"
		}],
		["rect", {
			width: "7",
			height: "9",
			x: "14",
			y: "12",
			rx: "1",
			key: "1hutg5"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "3",
			y: "16",
			rx: "1",
			key: "ldoo1y"
		}]
	]
};
rL.node;
var iL = EI(rL), aL = {
	name: "link-2",
	size: 24,
	node: [
		["path", {
			d: "M9 17H7A5 5 0 0 1 7 7h2",
			key: "8i5ue5"
		}],
		["path", {
			d: "M15 7h2a5 5 0 1 1 0 10h-2",
			key: "1b9ql8"
		}],
		["line", {
			x1: "8",
			x2: "16",
			y1: "12",
			y2: "12",
			key: "1jonct"
		}]
	]
};
aL.node;
var oL = EI(aL), sL = {
	name: "log-out",
	size: 24,
	node: [
		["path", {
			d: "m16 17 5-5-5-5",
			key: "1bji2h"
		}],
		["path", {
			d: "M21 12H9",
			key: "dn1m92"
		}],
		["path", {
			d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
			key: "1uf3rs"
		}]
	]
};
sL.node;
var cL = EI(sL), lL = {
	name: "menu",
	size: 24,
	node: [
		["path", {
			d: "M4 5h16",
			key: "1tepv9"
		}],
		["path", {
			d: "M4 12h16",
			key: "1lakjw"
		}],
		["path", {
			d: "M4 19h16",
			key: "1djgab"
		}]
	]
};
lL.node;
var uL = EI(lL), dL = {
	name: "mouse-pointer-2",
	size: 24,
	node: [["path", {
		d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
		key: "edeuup"
	}]]
};
dL.node;
var fL = EI(dL), pL = {
	name: "refresh-cw",
	size: 24,
	node: [
		["path", {
			d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
			key: "v9h5vc"
		}],
		["path", {
			d: "M21 3v5h-5",
			key: "1q7to0"
		}],
		["path", {
			d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
			key: "3uifl3"
		}],
		["path", {
			d: "M8 16H3v5",
			key: "1cv678"
		}]
	]
};
pL.node;
var mL = EI(pL), hL = {
	name: "search",
	size: 24,
	node: [["path", {
		d: "m21 21-4.34-4.34",
		key: "14j7rj"
	}], ["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}]]
};
hL.node;
var gL = EI(hL), _L = {
	name: "settings-2",
	size: 24,
	node: [
		["path", {
			d: "M14 17H5",
			key: "gfn3mx"
		}],
		["path", {
			d: "M19 7h-9",
			key: "6i9tg"
		}],
		["circle", {
			cx: "17",
			cy: "17",
			r: "3",
			key: "18b49y"
		}],
		["circle", {
			cx: "7",
			cy: "7",
			r: "3",
			key: "dfmy0x"
		}]
	]
};
_L.node;
var vL = EI(_L), yL = {
	name: "shield-check",
	size: 24,
	node: [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]
};
yL.node;
var bL = EI(yL), xL = {
	name: "shopping-bag",
	size: 24,
	node: [
		["path", {
			d: "M16 10a4 4 0 0 1-8 0",
			key: "1ltviw"
		}],
		["path", {
			d: "M3.103 6.034h17.794",
			key: "awc11p"
		}],
		["path", {
			d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
			key: "o988cm"
		}]
	]
};
xL.node;
var SL = EI(xL), CL = {
	name: "shopping-cart",
	size: 24,
	node: [
		["path", {
			d: "m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18",
			key: "uebgi3"
		}],
		["path", {
			d: "M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25",
			key: "1j7c9p"
		}],
		["circle", {
			cx: "18",
			cy: "20",
			r: "2",
			key: "t9985n"
		}],
		["circle", {
			cx: "8",
			cy: "20",
			r: "2",
			key: "ckkr5m"
		}]
	]
};
CL.node;
var wL = EI(CL), TL = {
	name: "sliders-horizontal",
	size: 24,
	node: [
		["path", {
			d: "M10 5H3",
			key: "1qgfaw"
		}],
		["path", {
			d: "M12 19H3",
			key: "yhmn1j"
		}],
		["path", {
			d: "M14 3v4",
			key: "1sua03"
		}],
		["path", {
			d: "M16 17v4",
			key: "1q0r14"
		}],
		["path", {
			d: "M21 12h-9",
			key: "1o4lsq"
		}],
		["path", {
			d: "M21 19h-5",
			key: "1rlt1p"
		}],
		["path", {
			d: "M21 5h-7",
			key: "1oszz2"
		}],
		["path", {
			d: "M8 10v4",
			key: "tgpxqk"
		}],
		["path", {
			d: "M8 12H3",
			key: "a7s4jb"
		}]
	]
};
TL.node;
var EL = EI(TL), DL = {
	name: "target",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "6",
			key: "1vlfrh"
		}],
		["circle", {
			cx: "12",
			cy: "12",
			r: "2",
			key: "1c9p78"
		}]
	]
};
DL.node;
var OL = EI(DL), kL = {
	name: "trending-up",
	size: 24,
	node: [["path", {
		d: "M16 7h6v6",
		key: "box55l"
	}], ["path", {
		d: "m22 7-8.5 8.5-5-5L2 17",
		key: "1t1m79"
	}]]
};
kL.node;
var AL = EI(kL), jL = {
	name: "wallet",
	size: 24,
	node: [["path", {
		d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
		key: "18etb6"
	}], ["path", {
		d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
		key: "xoc0q4"
	}]]
};
jL.node;
var ML = EI(jL), NL = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
NL.node;
var PL = EI(NL), FL = {
	name: "zap",
	size: 24,
	node: [["path", {
		d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
		key: "1v7up4"
	}]]
};
FL.node;
var IL = EI(FL), LL = (e) => e === "APPROVED" || e === "COMPLETE", RL = (e) => [
	"WAITING_PAYMENT",
	"PRINTED_BILLET",
	"OVERDUE",
	"PRE_ORDER",
	"PROCESSING_TRANSACTION",
	"STARTED",
	"UNDER_ANALISYS"
].includes(e), zL = (e, t) => e !== null && t !== null && t !== 0 ? e / t : null;
function BL(e) {
	let t = 0;
	for (let n of e) {
		if (!Number.isSafeInteger(n) || !Number.isSafeInteger(t + n)) throw Error("MONEY_OVERFLOW");
		t += n;
	}
	return t;
}
function VL(e) {
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency: e
	}).resolvedOptions().maximumFractionDigits ?? 2;
}
function HL(e, t = "BRL") {
	return e === null ? "—" : new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: t,
		maximumFractionDigits: VL(t)
	}).format(e / 10 ** VL(t));
}
function UL(e, t = "America/Sao_Paulo") {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: t,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(new Date(e));
}
var WL = (e) => UL(e.approvedAt || e.purchasedAt);
function GL(e, t) {
	return Math.round((Date.parse(t + "T00:00:00Z") - Date.parse(e + "T00:00:00Z")) / 864e5) + 1;
}
function KL(e, t) {
	return new Date(Date.parse(e + "T00:00:00Z") + t * 864e5).toISOString().slice(0, 10);
}
function qL(e) {
	let t = GL(e.start, e.end);
	return {
		...e,
		start: KL(e.start, -t),
		end: KL(e.start, -1)
	};
}
function JL(e, t) {
	return e === null || t === null || t === 0 ? null : (e - t) / Math.abs(t) * 100;
}
function YL(e, t) {
	let n = t.filter((t) => t.hotmartAccountId === e.accountId && t.productId === e.productId && (!t.offer || t.offer === e.offer) && e.source[t.sourceKey] === t.sourceValue);
	return new Set(n.map((e) => [
		e.accountId,
		e.campaignId,
		e.adsetId,
		e.adId
	].join(":"))).size === 1 ? n[0] : null;
}
function XL(e, t) {
	return e.length && e.every((e) => e[t] !== null) ? t === "purchaseValue" ? BL(e.map((e) => e[t])) : e.reduce((e, n) => e + n[t], 0) : null;
}
function ZL(e, t) {
	let n = (e) => e >= t.start && e <= t.end;
	return {
		orders: e.orders.filter((r) => r.currency === t.currency && n(WL(r)) && (t.product === "all" || r.productId === t.product) && (t.account === "all" || YL(r, e.mappings)?.accountId === t.account)),
		insights: e.insights.filter((r) => r.currency === t.currency && n(r.date) && (!r.periodEnd || n(r.periodEnd)) && (t.account === "all" || r.accountId === t.account) && (t.product === "all" || e.mappings.some((e) => e.productId === t.product && e.adId === r.adId && e.accountId === r.accountId)))
	};
}
function QL(e, t, n) {
	let r = e.filter((e) => LL(e.status)), i = t.length ? BL(t.map((e) => e.spend)) : null, a = e.length ? BL(r.map((e) => e.gross)) : null, o = r.length && r.every((e) => e.net !== null) ? BL(r.map((e) => e.net)) : null, s = t.length ? t.reduce((e, t) => e + t.impressions, 0) : null, c = XL(t, "clicks"), l = XL(t, "purchases"), u = XL(t, "views"), d = XL(t, "checkouts"), f = r.filter((e) => YL(e, n)), p = t.length === 1 ? t[0].reach : null;
	return {
		spend: i,
		gross: a,
		net: o,
		profit: o !== null && i !== null ? o - i : null,
		sales: e.length ? r.length : null,
		ticket: zL(a, r.length),
		mer: zL(a, i),
		cpa: zL(i, l),
		cpc: zL(i, c),
		ctr: zL(c === null ? null : c * 100, s),
		cpm: zL(i === null ? null : i * 1e3, s),
		frequency: zL(s, p),
		metaRoas: zL(XL(t, "purchaseValue"), i),
		attributedRoas: zL(e.length ? BL(f.map((e) => e.gross)) : null, i),
		attributed: f.length,
		unattributed: r.length - f.length,
		trackingRate: zL(f.length * 100, e.length ? r.length : null),
		costPerView: zL(i, u),
		connectRate: zL(u === null ? null : u * 100, c),
		costPerCheckout: zL(i, d),
		pvToCheckout: zL(d === null ? null : d * 100, u),
		pvToPurchase: zL(l === null ? null : l * 100, u),
		pending: e.filter((e) => RL(e.status)).length,
		refunds: e.filter((e) => [
			"REFUNDED",
			"CHARGEBACK",
			"PARTIALLY_REFUNDED"
		].includes(e.status)).length,
		impressions: s,
		clicks: c,
		views: u,
		checkouts: d,
		purchases: l
	};
}
// analytics/manual/supabase.ts
function $L() {
	throw Error("MANUAL_MODE_NO_CONNECTION");
}
// assets/scripts/portal-auth.js
var eR = "figueroa-portal-v1", tR = {
	"mvave br": "mvave-br",
	"felipe figueroa": "felipe-figueroa"
}, nR = (e) => Uint8Array.from(atob(e), (e) => e.charCodeAt(0)), rR = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase();
function iR() {
	try {
		let e = JSON.parse(sessionStorage.getItem(eR));
		if (e?.expires > Date.now()) return e;
	} catch {}
	return sessionStorage.removeItem(eR), null;
}
function aR() {
	let e = document.body.hasAttribute("data-internal-area") || iR()?.role === "master";
	sessionStorage.removeItem(eR), sessionStorage.removeItem("figueroa-analytics-key-v1"), sessionStorage.removeItem("marketing-figueroa-client-victor-lopes"), location.href = new URL(e ? "area-interna.html" : "area-cliente.html", document.baseURI).href;
}
async function oR(e) {
	let t = await fetch(new URL(e, document.baseURI), { cache: "no-store" });
	if (!t.ok) throw Error("network");
	return t.json();
}
async function sR(e, t) {
	let n = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv: nR(e.iv)
	}, t, nR(e.data));
	return JSON.parse(new TextDecoder().decode(n));
}
async function cR(e, t, n) {
	let r = rR(e), i = tR[r];
	if (!i) throw Error("credentials");
	let a = await oR(`assets/access/${i}.json`), o = await crypto.subtle.importKey("raw", new TextEncoder().encode(r + "\n" + t), "PBKDF2", !1, ["deriveKey"]), s = await crypto.subtle.deriveKey({
		name: "PBKDF2",
		salt: nR(a.salt),
		iterations: a.iterations,
		hash: "SHA-256"
	}, o, {
		name: "AES-GCM",
		length: 256
	}, !1, ["decrypt"]), c;
	try {
		c = await sR(a, s);
	} catch {
		throw Error("credentials");
	}
	if (n && c.role !== n) throw Error("role");
	let l = {
		...c,
		expires: Date.now() + 288e5
	};
	return sessionStorage.removeItem("marketing-figueroa-client-victor-lopes"), sessionStorage.setItem(eR, JSON.stringify(l)), l;
}
function lR(e, { requiredRole: t } = {}) {
	document.querySelectorAll("[data-login-form]").forEach((n) => {
		n.addEventListener("submit", async (r) => {
			r.preventDefault();
			let i = n.querySelector("[data-login-feedback]"), a = n.querySelector("button[type=submit]");
			a.disabled = !0, i.textContent = "Abrindo sua área…";
			try {
				if (!crypto.subtle) throw Error("https");
				let r = await cR(n.elements.username.value, n.elements.password.value, t);
				n.elements.password.value = "", await e(r);
			} catch (e) {
				i.textContent = e.message === "role" ? "Use uma conta de administrador para entrar na Área Interna. Para seu projeto, acesse a Área do Cliente." : e.message === "credentials" ? "Usuário ou senha incorretos. Confira e tente novamente." : e.message === "https" ? "Abra o portal por HTTPS ou pela prévia local." : "Não foi possível abrir o portal. Verifique a conexão e tente novamente.";
			} finally {
				a.disabled = !1;
			}
		});
	});
}
document.querySelectorAll("[data-logout]").forEach((e) => e.addEventListener("click", aR));
// analytics/manual/session.ts
async function uR() {
	aR();
}
// analytics/src/lib/export.ts
function dR(e, t, n) {
	let r = /* @__PURE__ */ new Set([
		"spend",
		"gross",
		"net",
		"profit",
		"ticket",
		"cpa",
		"cpc",
		"cpm",
		"costPerView",
		"costPerCheckout"
	]), i = /* @__PURE__ */ new Set([
		"ctr",
		"connectRate",
		"pvToCheckout",
		"pvToPurchase",
		"trackingRate"
	]), a = /* @__PURE__ */ new Set([
		"mer",
		"metaRoas",
		"attributedRoas",
		"frequency"
	]), o = [[
		"modo",
		"inicio",
		"fim",
		"moeda",
		"conta",
		"produto",
		"indicador",
		"unidade",
		"valor"
	], ...Object.entries(e).map(([e, o]) => [
		n ? "DEMONSTRACAO" : "REAL",
		t.start,
		t.end,
		t.currency,
		t.account,
		t.product,
		e,
		r.has(e) ? t.currency : a.has(e) ? "razao" : i.has(e) ? "percentual" : "quantidade",
		o === null ? "indisponivel" : r.has(e) ? (o / 10 ** VL(t.currency)).toFixed(VL(t.currency)) : String(o)
	])], s = (e) => `"${(/^[=+@\-\t\r]/.test(e) ? "'" + e : e).replaceAll("\"", "\"\"")}"`;
	return "﻿" + o.map((e) => e.map(s).join(";")).join("\r\n");
}
// analytics/src/lib/coverage.ts
function fR(e, t) {
	let n = [];
	for (let r of [...e, t].sort((e, t) => e.start - t.start)) {
		if (!Number.isFinite(r.start) || !Number.isFinite(r.end) || r.end < r.start) throw Error("INVALID_COVERAGE");
		let e = n.at(-1);
		e && r.start <= e.end + 1 ? e.end = Math.max(e.end, r.end) : n.push({ ...r });
	}
	return n;
}
function pR(e, t, n, r) {
	let i = Date.parse(`${t}T00:00:00-03:00`), a = Date.parse(`${n}T${n === r ? "00:00:00" : "23:59:59.999"}-03:00`);
	return e.some((e) => e.start <= i && e.end >= a);
}
// analytics/src/lib/report-metrics.ts
function mR(e, t, n = UL((/* @__PURE__ */ new Date()).toISOString()), r = ZL(e, t)) {
	let i = QL(r.orders, r.insights, e.mappings), a = (e.manualPeriods ?? []).filter((e) => e.start >= t.start && e.end <= t.end).reduce((e, t) => fR(e, {
		start: Date.parse(t.start + "T00:00:00-03:00"),
		end: Date.parse(t.end + "T23:59:59.999-03:00")
	}), []), o = e.mode === "demo" || pR(e.mode === "manual" ? t.currency === "BRL" && t.product === "all" ? a : [] : e.coverage?.meta ?? [], t.start, t.end, n), s = (e.mode !== "manual" || t.account === "all") && (e.mode === "demo" || pR(e.coverage?.hotmart ?? [], t.start, t.end, n));
	return e.mode === "live" && o && !r.insights.length && (i.spend = 0, i.impressions = 0, i.clicks = 0, i.views = 0, i.checkouts = 0, i.purchases = 0), e.mode !== "demo" && s && !r.orders.length && (i.gross = 0, i.net = 0, i.sales = 0), e.mode === "manual" && (e.manualStatusComplete && s || (i.pending = null, i.refunds = null), i.trackingRate = null, i.attributedRoas = null), i.mer = zL(i.gross, i.spend), i.profit = i.net !== null && i.spend !== null ? i.net - i.spend : null, o || (i.spend = null, i.mer = null, i.profit = null, i.cpa = null, i.cpc = null, i.ctr = null, i.cpm = null, i.frequency = null, i.metaRoas = null, i.attributedRoas = null, i.impressions = null, i.clicks = null, i.views = null, i.checkouts = null, i.purchases = null, i.costPerView = null, i.connectRate = null, i.costPerCheckout = null, i.pvToCheckout = null, i.pvToPurchase = null), s || (i.gross = null, i.net = null, i.profit = null, i.sales = null, i.ticket = null, i.mer = null, i.attributedRoas = null, i.trackingRate = null), e.mode === "manual" && (i.trackingRate = zL(i.purchases === null ? null : i.purchases * 100, i.sales)), {
		metrics: i,
		metaCovered: o,
		hotmartCovered: s
	};
}
// analytics/src/lib/performance.ts
function hR(e, t, n = UL((/* @__PURE__ */ new Date()).toISOString())) {
	let r = ZL(e, t), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let e of r.orders) {
		let t = WL(e);
		i.set(t, [...i.get(t) ?? [], e]);
	}
	for (let e of r.insights) a.set(e.date, [...a.get(e.date) ?? [], e]);
	let o = 0, s = 0, c = 0, l = 10 ** VL(t.currency);
	return Array.from({ length: GL(t.start, t.end) }, (r, u) => {
		let d = KL(t.start, u), f = mR(e, {
			...t,
			start: d,
			end: d
		}, n, {
			orders: i.get(d) ?? [],
			insights: a.get(d) ?? []
		}).metrics;
		return o = o === null || f.gross === null ? null : o + f.gross / l, s = s === null || f.spend === null ? null : s + f.spend / l, c = c === null || f.sales === null ? null : c + f.sales, {
			day: d,
			label: d.slice(8) + "/" + d.slice(5, 7),
			revenue: f.gross === null ? null : f.gross / l,
			spend: f.spend === null ? null : f.spend / l,
			sales: f.sales,
			mer: f.mer,
			cpa: f.cpa === null ? null : f.cpa / l,
			roas: f.metaRoas,
			cumulativeRevenue: o,
			cumulativeSpend: s,
			cumulativeSales: c
		};
	});
}
function gR(e, t, n, r) {
	let i = e.filter((e) => e.accountId === r && e.date >= t && e.date <= n).sort((e, t) => e.date.localeCompare(t.date)), a = e.filter((e) => e.accountId === r && e.date < t).sort((e, t) => t.date.localeCompare(e.date))[0], o = i.at(-1) ?? null, s = a ?? i[0] ?? null, c = o && s && o.date !== s.date ? o.followers - s.followers : null;
	return {
		points: i,
		latest: o,
		baseline: s,
		delta: c,
		percent: c !== null && s?.followers ? c / s.followers * 100 : null,
		partialBaseline: !a
	};
}
function _R(e, t, n) {
	let r = (e.instagramDaily ?? []).filter((e) => e.date >= t && e.date <= n).sort((e, t) => e.date.localeCompare(t.date)), i = GL(t, n), a = i > 0 && r.length === i && new Set(r.map((e) => e.date)).size === i, o = (e) => a ? r.reduce((t, n) => t + n[e], 0) : null;
	return {
		rows: r,
		complete: a,
		views: o("views"),
		interactions: o("interactions"),
		followers: e.instagramFollowersKind === "new" ? o("followers") : null
	};
}
function vR(e, t, n, r) {
	let i = ZL(e, t), a = /* @__PURE__ */ new Map();
	for (let e of i.insights) {
		let t = `${e.accountId}:${e.adId}`;
		a.set(t, [...a.get(t) ?? [], e]);
	}
	return [...a].map(([t, n]) => ({
		key: t,
		ad: n[0],
		creative: e.creatives?.find((e) => e.accountId === n[0].accountId && e.adId === n[0].adId),
		metrics: QL([], n, [])
	})).filter((e) => (e.metrics.spend ?? 0) >= r).sort((e, t) => {
		let r = n === "roas" ? e.metrics.metaRoas : e.metrics[n], i = n === "roas" ? t.metrics.metaRoas : t.metrics[n];
		return r === null ? 1 : i === null ? -1 : i - r;
	});
}
// analytics/src/lib/operation.ts
var yR = "2026-08-21", bR = /*#__PURE__*/ JSON.parse("[{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-01\",\"src\":\"assets/images/analytics-creatives/catalog/06e6561b43745456.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-02\",\"src\":\"assets/images/analytics-creatives/catalog/d3ab0b83a7813b3e.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-03\",\"src\":\"assets/images/analytics-creatives/catalog/4554d5c24dd03f58.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-04\",\"src\":\"assets/images/analytics-creatives/catalog/12aea56bede5a031.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-05\",\"src\":\"assets/images/analytics-creatives/catalog/7f7d2c96ecc49b92.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-01\",\"src\":\"assets/images/analytics-creatives/catalog/46fafd5bdbfb3cac.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-02\",\"src\":\"assets/images/analytics-creatives/catalog/09747b279a73eef9.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-03\",\"src\":\"assets/images/analytics-creatives/catalog/2447d4aa336020c0.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-04\",\"src\":\"assets/images/analytics-creatives/catalog/d8b7d9df3208061b.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-05\",\"src\":\"assets/images/analytics-creatives/catalog/2170730126ac2120.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-01\",\"src\":\"assets/images/analytics-creatives/catalog/8d51547d82f8ad77.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-02\",\"src\":\"assets/images/analytics-creatives/catalog/0aff548a48598099.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-03\",\"src\":\"assets/images/analytics-creatives/catalog/0e5bc0ecb86d3b18.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-04\",\"src\":\"assets/images/analytics-creatives/catalog/d4c00bd36f501deb.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-05\",\"src\":\"assets/images/analytics-creatives/catalog/1a03cc002b0a864e.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-01\",\"src\":\"assets/images/analytics-creatives/catalog/5353c1320a2917e1.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-02\",\"src\":\"assets/images/analytics-creatives/catalog/d9707463a7434629.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-03\",\"src\":\"assets/images/analytics-creatives/catalog/747ebbdce233ee43.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-04\",\"src\":\"assets/images/analytics-creatives/catalog/8d381b026ea8e48b.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-05\",\"src\":\"assets/images/analytics-creatives/catalog/42865b751b70d5e4.webp\",\"note\":\"CAMPEOES-LABS-ESCURO/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-01\",\"src\":\"assets/images/analytics-creatives/catalog/afe467521bbe4555.webp\",\"note\":\"CAMPEOES-LABS/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-02\",\"src\":\"assets/images/analytics-creatives/catalog/d1a8ad21f2c17590.webp\",\"note\":\"CAMPEOES-LABS/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-03\",\"src\":\"assets/images/analytics-creatives/catalog/060b54f9453c1b1f.webp\",\"note\":\"CAMPEOES-LABS/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-04\",\"src\":\"assets/images/analytics-creatives/catalog/a6a6ae6e4c8bdd19.webp\",\"note\":\"CAMPEOES-LABS/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-BB-05\",\"src\":\"assets/images/analytics-creatives/catalog/02806a3a4c9254b3.webp\",\"note\":\"CAMPEOES-LABS/baixo/black-box\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-01\",\"src\":\"assets/images/analytics-creatives/catalog/dd759340ecc0bbf7.webp\",\"note\":\"CAMPEOES-LABS/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-02\",\"src\":\"assets/images/analytics-creatives/catalog/6b8146651609f0fe.webp\",\"note\":\"CAMPEOES-LABS/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-03\",\"src\":\"assets/images/analytics-creatives/catalog/cd089ade587ea703.webp\",\"note\":\"CAMPEOES-LABS/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-04\",\"src\":\"assets/images/analytics-creatives/catalog/5a585ea22c41e201.webp\",\"note\":\"CAMPEOES-LABS/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-CBB-05\",\"src\":\"assets/images/analytics-creatives/catalog/26133d4adbdad231.webp\",\"note\":\"CAMPEOES-LABS/baixo/cubebaby-baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-01\",\"src\":\"assets/images/analytics-creatives/catalog/1431a771a9d0174f.webp\",\"note\":\"CAMPEOES-LABS/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-02\",\"src\":\"assets/images/analytics-creatives/catalog/08eb2475efae5cea.webp\",\"note\":\"CAMPEOES-LABS/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-03\",\"src\":\"assets/images/analytics-creatives/catalog/f547b9c6b6e10455.webp\",\"note\":\"CAMPEOES-LABS/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-04\",\"src\":\"assets/images/analytics-creatives/catalog/8f2c7357fd19d5d3.webp\",\"note\":\"CAMPEOES-LABS/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-MK-05\",\"src\":\"assets/images/analytics-creatives/catalog/9c4aa9e07e2e2313.webp\",\"note\":\"CAMPEOES-LABS/baixo/mk300\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-01\",\"src\":\"assets/images/analytics-creatives/catalog/1f6f42f3d60bb5ed.webp\",\"note\":\"CAMPEOES-LABS/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-02\",\"src\":\"assets/images/analytics-creatives/catalog/8fb59266f4cb7c99.webp\",\"note\":\"CAMPEOES-LABS/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-03\",\"src\":\"assets/images/analytics-creatives/catalog/9b44af6eeea92318.webp\",\"note\":\"CAMPEOES-LABS/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-04\",\"src\":\"assets/images/analytics-creatives/catalog/c9abbbdb5ded5fc2.webp\",\"note\":\"CAMPEOES-LABS/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CCB-TB-05\",\"src\":\"assets/images/analytics-creatives/catalog/47120c1c47be8e57.webp\",\"note\":\"CAMPEOES-LABS/baixo/tank-b\"},{\"brand\":\"Mvave BR\",\"title\":\"CGuia01 - Capa\",\"src\":\"assets/images/analytics-creatives/catalog/52adf3b7ac799d9a.webp\",\"note\":\"Arquivo do repositório\"},{\"brand\":\"Mvave BR\",\"title\":\"CB01-baixo-mix-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/749f4e6348912c36.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB02-baixo-quantidade-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/929facd7e59937eb.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB03-baixo-definicao-cube-baby-bass\",\"src\":\"assets/images/analytics-creatives/catalog/80864ffea3173690.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB04-baixo-grave-fundamental-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/6c4d3dd73937e8ca.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB05-baixo-encaixe-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/d12cfeb368730502.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB06-baixo-corpo-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/07a804f588e6ccfc.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB07-baixo-respostas-cube-baby-bass\",\"src\":\"assets/images/analytics-creatives/catalog/624ca570273e2fb4.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB08-baixo-presenca-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/994b2c0f36d585b7.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB09-baixo-articulacao-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/4b51b7217d893e36.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB10-baixo-variedade-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/b80c592cae2a11db.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB11-baixo-compare-cube-baby-bass\",\"src\":\"assets/images/analytics-creatives/catalog/05fbc3a7841f59cd.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB12-baixo-palheta-dedos-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/07220fba3f046b17.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB13-baixo-organizacao-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/d291ffbc87dba297.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB14-baixo-afinacoes-baixas-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/4e6b77932fb51287.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB15-baixo-redondo-cube-baby-bass\",\"src\":\"assets/images/analytics-creatives/catalog/347fb755ec5c1714.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB16-baixo-some-na-mix-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/cd15ef14ae96a0d1.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB17-baixo-possibilidades-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/95b5abb9ef1761a8.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB18-baixo-contexto-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/d49ccb6f49a53b06.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB19-baixo-equilibrio-cube-baby-bass\",\"src\":\"assets/images/analytics-creatives/catalog/319a8fc3cb7daded.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"CB20-baixo-curadoria-tank-b\",\"src\":\"assets/images/analytics-creatives/catalog/66c6d3e3aad6d89f.webp\",\"note\":\"baixo\"},{\"brand\":\"Mvave BR\",\"title\":\"GG01-organizacao\",\"src\":\"assets/images/analytics-creatives/catalog/0cd16ca17682952f.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG02-praticidade\",\"src\":\"assets/images/analytics-creatives/catalog/eb54bba690802197.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG03-checklist-antes\",\"src\":\"assets/images/analytics-creatives/catalog/dd5268377507aa2e.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG04-checklist-montagem\",\"src\":\"assets/images/analytics-creatives/catalog/8f20bff615500dc2.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG05-checklist-refino\",\"src\":\"assets/images/analytics-creatives/catalog/e31abe5b99a7a30d.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG06-checklist-palco\",\"src\":\"assets/images/analytics-creatives/catalog/bcbf270a9b52ac23.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG07-cadeia-de-sinal\",\"src\":\"assets/images/analytics-creatives/catalog/aaf10e4010cb38bc.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG08-uma-mudanca\",\"src\":\"assets/images/analytics-creatives/catalog/ddb08bfb97f0a80a.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG09-tres-instrumentos\",\"src\":\"assets/images/analytics-creatives/catalog/2e04f2a747eaad78.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG10-41-paginas\",\"src\":\"assets/images/analytics-creatives/catalog/1e876277e0db53e2.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG11-dicionario-efeitos\",\"src\":\"assets/images/analytics-creatives/catalog/fb769d7ac4d2fe92.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG12-delay\",\"src\":\"assets/images/analytics-creatives/catalog/95c6f45e616a4b2a.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG13-reverb\",\"src\":\"assets/images/analytics-creatives/catalog/29a0f2bc65ab0f48.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG14-estilos\",\"src\":\"assets/images/analytics-creatives/catalog/eedbfc5e02a37929.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG15-receitas-rapidas\",\"src\":\"assets/images/analytics-creatives/catalog/852f837eaf628281.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG16-resolva-rapido\",\"src\":\"assets/images/analytics-creatives/catalog/fe440559cdd1adff.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG17-na-banda\",\"src\":\"assets/images/analytics-creatives/catalog/d360bd792327143c.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG18-volume-justo\",\"src\":\"assets/images/analytics-creatives/catalog/966a706d360345b7.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG19-menos-menus\",\"src\":\"assets/images/analytics-creatives/catalog/d1acc33c48f5f406.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"GG20-oferta\",\"src\":\"assets/images/analytics-creatives/catalog/9f5dee1f6b45ca0d.webp\",\"note\":\"guia\"},{\"brand\":\"Mvave BR\",\"title\":\"CG01-guitarra-versatilidade-tank-g\",\"src\":\"assets/images/analytics-creatives/catalog/ac229310735eb0cc.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG02-guitarra-estilos-blackbox\",\"src\":\"assets/images/analytics-creatives/catalog/28f46f493f8aa4db.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG03-guitarra-clean-cube-baby-guitar\",\"src\":\"assets/images/analytics-creatives/catalog/61db2722fb8fb0a5.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG04-guitarra-crunch-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/d58fcaf6f1f2cc91.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG05-guitarra-high-gain-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/e6a3788031464b39.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG06-guitarra-rock-tank-mini\",\"src\":\"assets/images/analytics-creatives/catalog/a2af174fd4a16817.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG07-guitarra-biblioteca-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/231ede7c493c4777.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG08-guitarra-transformacao-tank-g\",\"src\":\"assets/images/analytics-creatives/catalog/6f9a6aee7f586fb7.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG09-guitarra-compare-blackbox\",\"src\":\"assets/images/analytics-creatives/catalog/2df056444c740d15.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG10-guitarra-gabinetes-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/5595b20a96cf50c8.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG11-guitarra-dinamica-cube-baby-guitar\",\"src\":\"assets/images/analytics-creatives/catalog/5a98a0789456bd57.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG12-guitarra-praticidade-tank-mini\",\"src\":\"assets/images/analytics-creatives/catalog/6bf5d06ef7b49997.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG13-guitarra-possibilidades-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/256eff6159ce77e4.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG14-guitarra-definicao-high-gain-tank-g\",\"src\":\"assets/images/analytics-creatives/catalog/2307de37d2d64484.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG15-guitarra-clean-crunch-blackbox\",\"src\":\"assets/images/analytics-creatives/catalog/327f358beb69da51.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG16-guitarra-descoberta-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/028aad7aae7bb201.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG17-guitarra-mix-cube-baby-guitar\",\"src\":\"assets/images/analytics-creatives/catalog/28d7736b7ec0914e.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG18-guitarra-referencias-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/53f259eaa72f8902.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG19-guitarra-setup-compacto-tank-mini\",\"src\":\"assets/images/analytics-creatives/catalog/4505374cdf97c1b7.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CG20-guitarra-curadoria-tank-g\",\"src\":\"assets/images/analytics-creatives/catalog/a8131ecfdad0c34d.webp\",\"note\":\"guitarra\"},{\"brand\":\"Mvave BR\",\"title\":\"CV01-violao-naturalidade-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/37fa24f8e2d8ddd3.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV02-violao-organizacao-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/7ed08254beee7c19.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV03-violao-quantidade-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/ebf250e67020e80c.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV04-violao-som-em-linha-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/2f78c4f7b84671ae.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV05-violao-aco-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/0483ebdb07f57d12.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV06-violao-nylon-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/c6c4c19aa1216cf2.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV07-violao-compare-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/36c2c2e3e2fdd030.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV08-violao-piezo-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/a6421eaeb5dd588b.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV09-violao-praticidade-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/c68163dcf2790508.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV10-violao-referencias-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/35a5e74b273eeaa1.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV11-violao-naturalidade-ao-vivo-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/d502acea108002b9.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV12-violao-gravacao-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/cd32e324fd5a4f89.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV13-violao-brilho-controlado-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/7e4f5c1bfc8c269d.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV14-violao-corpo-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/00948f85fc5443b2.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV15-violao-dedilhado-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/f33ebd05d857202e.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV16-violao-batida-irbox\",\"src\":\"assets/images/analytics-creatives/catalog/950b4b82b3783936.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV17-violao-dois-violoes-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/1fa45834a2f30f14.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV18-violao-som-duro-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/463b7e4e577d709a.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV19-violao-possibilidades-mk300\",\"src\":\"assets/images/analytics-creatives/catalog/dcd6e3e8d3ac5d65.webp\",\"note\":\"violao\"},{\"brand\":\"Mvave BR\",\"title\":\"CV20-violao-curadoria-cube-baby-ac\",\"src\":\"assets/images/analytics-creatives/catalog/383446e3a3061e00.webp\",\"note\":\"violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ01\",\"src\":\"assets/images/analytics-creatives/catalog/7e7763493b81e5ee.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ02\",\"src\":\"assets/images/analytics-creatives/catalog/9be6bc1cc3037ca3.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ03\",\"src\":\"assets/images/analytics-creatives/catalog/9097a3bf59a00369.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ04\",\"src\":\"assets/images/analytics-creatives/catalog/9da26b998b4c9392.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ05\",\"src\":\"assets/images/analytics-creatives/catalog/43cdd85f8c60d4ec.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ06\",\"src\":\"assets/images/analytics-creatives/catalog/f2d54566a7712789.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ07\",\"src\":\"assets/images/analytics-creatives/catalog/4ba9effe74ad17c7.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ08\",\"src\":\"assets/images/analytics-creatives/catalog/b2bb844d2668fce6.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ09\",\"src\":\"assets/images/analytics-creatives/catalog/1a6911add3ac1e48.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ10\",\"src\":\"assets/images/analytics-creatives/catalog/e19e5d2703744ad0.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ11\",\"src\":\"assets/images/analytics-creatives/catalog/0d402015fb7909ad.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ12\",\"src\":\"assets/images/analytics-creatives/catalog/6eed7077b1d1ca86.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ13\",\"src\":\"assets/images/analytics-creatives/catalog/113d1ff4614af85d.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ14\",\"src\":\"assets/images/analytics-creatives/catalog/4a72523ddef88184.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ15\",\"src\":\"assets/images/analytics-creatives/catalog/31f25b8e0ece8338.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ16\",\"src\":\"assets/images/analytics-creatives/catalog/54820c02248569b0.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ17\",\"src\":\"assets/images/analytics-creatives/catalog/a70cfef2dcb6c735.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ18\",\"src\":\"assets/images/analytics-creatives/catalog/b19bce586c68a3ac.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ19\",\"src\":\"assets/images/analytics-creatives/catalog/c0aa829a5e53a989.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ20\",\"src\":\"assets/images/analytics-creatives/catalog/7da282762e7d4ce2.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ21\",\"src\":\"assets/images/analytics-creatives/catalog/c340b8f82a025a1d.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ22\",\"src\":\"assets/images/analytics-creatives/catalog/8ec55cc8889a7f6c.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ23\",\"src\":\"assets/images/analytics-creatives/catalog/deb49f4b79610cc5.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ24\",\"src\":\"assets/images/analytics-creatives/catalog/04c550d7e4d6876c.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ25\",\"src\":\"assets/images/analytics-creatives/catalog/973e1e4d0d3a01e9.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ26\",\"src\":\"assets/images/analytics-creatives/catalog/00bf954bbfbadce5.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ27\",\"src\":\"assets/images/analytics-creatives/catalog/547df70abb7ff77c.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ28\",\"src\":\"assets/images/analytics-creatives/catalog/ba759fd14e9860f8.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ29\",\"src\":\"assets/images/analytics-creatives/catalog/da91a7d65d0c8785.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"SEQ30\",\"src\":\"assets/images/analytics-creatives/catalog/ad297ca3d47aec1c.webp\",\"note\":\"2026-10-10-lote-02/acordes-em-sequencia\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV11\",\"src\":\"assets/images/analytics-creatives/catalog/df7e57744705c6ca.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV12\",\"src\":\"assets/images/analytics-creatives/catalog/b9c508066972c127.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV13\",\"src\":\"assets/images/analytics-creatives/catalog/eaa20baf9294ab15.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV14\",\"src\":\"assets/images/analytics-creatives/catalog/c723f9c738efa294.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV15\",\"src\":\"assets/images/analytics-creatives/catalog/dc00a1f9f158bb15.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV16\",\"src\":\"assets/images/analytics-creatives/catalog/dda2367bfcb996a7.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV17\",\"src\":\"assets/images/analytics-creatives/catalog/8fcc76bcd5c32842.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV18\",\"src\":\"assets/images/analytics-creatives/catalog/2fd53d2029ab223a.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV19\",\"src\":\"assets/images/analytics-creatives/catalog/b912f7d58e5eed07.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV20\",\"src\":\"assets/images/analytics-creatives/catalog/df128f413d1d29b0.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV21\",\"src\":\"assets/images/analytics-creatives/catalog/ce659c9798a1c7ab.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV22\",\"src\":\"assets/images/analytics-creatives/catalog/d556fd9a3ae3a1f5.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV23\",\"src\":\"assets/images/analytics-creatives/catalog/25b1be269373aecf.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV24\",\"src\":\"assets/images/analytics-creatives/catalog/adc90937b76fac71.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV25\",\"src\":\"assets/images/analytics-creatives/catalog/a86d86e21ce31647.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV26\",\"src\":\"assets/images/analytics-creatives/catalog/e66778095fb1f083.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV27\",\"src\":\"assets/images/analytics-creatives/catalog/f14152bb0fe9c5ee.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV28\",\"src\":\"assets/images/analytics-creatives/catalog/ac3c496ae4cf679b.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV29\",\"src\":\"assets/images/analytics-creatives/catalog/7a86fae5dd0730aa.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV30\",\"src\":\"assets/images/analytics-creatives/catalog/9c169d5281252601.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV31\",\"src\":\"assets/images/analytics-creatives/catalog/4b2cbb29f7fdd7c2.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV32\",\"src\":\"assets/images/analytics-creatives/catalog/8eddf4bff85bb363.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV33\",\"src\":\"assets/images/analytics-creatives/catalog/5b6d24b4372c9f66.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV34\",\"src\":\"assets/images/analytics-creatives/catalog/254e225742a0b1a8.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV35\",\"src\":\"assets/images/analytics-creatives/catalog/9d5bbf9bd449feb5.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV36\",\"src\":\"assets/images/analytics-creatives/catalog/34635d7a6eefcb13.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV37\",\"src\":\"assets/images/analytics-creatives/catalog/511c7826a16773c5.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV38\",\"src\":\"assets/images/analytics-creatives/catalog/6103aac250d661c8.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV39\",\"src\":\"assets/images/analytics-creatives/catalog/e1678f57bbfef3ad.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV40\",\"src\":\"assets/images/analytics-creatives/catalog/82839143bf856852.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV41\",\"src\":\"assets/images/analytics-creatives/catalog/b5eeb2e35cd616bf.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV42\",\"src\":\"assets/images/analytics-creatives/catalog/974794639863a947.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV43\",\"src\":\"assets/images/analytics-creatives/catalog/b214e0719b6804fb.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV44\",\"src\":\"assets/images/analytics-creatives/catalog/f133f6979b49a1cd.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV45\",\"src\":\"assets/images/analytics-creatives/catalog/f0967ea7bf3fb3a5.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV46\",\"src\":\"assets/images/analytics-creatives/catalog/320956e3bbc796ca.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV47\",\"src\":\"assets/images/analytics-creatives/catalog/08b0b0a8cd2d1889.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV48\",\"src\":\"assets/images/analytics-creatives/catalog/af500482e3e25090.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV49\",\"src\":\"assets/images/analytics-creatives/catalog/c55e7bf0f9598c9a.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV50\",\"src\":\"assets/images/analytics-creatives/catalog/1ccd860b7adda6f8.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV51\",\"src\":\"assets/images/analytics-creatives/catalog/e674ddc4f23bf20e.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV52\",\"src\":\"assets/images/analytics-creatives/catalog/9511650b71ec494f.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV53\",\"src\":\"assets/images/analytics-creatives/catalog/a11d0c0f725aebe2.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV54\",\"src\":\"assets/images/analytics-creatives/catalog/2c67ef49492eebb0.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV55\",\"src\":\"assets/images/analytics-creatives/catalog/60ffa80d489824e1.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV56\",\"src\":\"assets/images/analytics-creatives/catalog/99b9630d067256bd.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV57\",\"src\":\"assets/images/analytics-creatives/catalog/627ca3e1c5ff86c6.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV58\",\"src\":\"assets/images/analytics-creatives/catalog/c1cf12bca4b0f441.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV59\",\"src\":\"assets/images/analytics-creatives/catalog/3198c76e4e30919b.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV60\",\"src\":\"assets/images/analytics-creatives/catalog/16c5d2d8562110b1.webp\",\"note\":\"2026-10-10-lote-02/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC11\",\"src\":\"assets/images/analytics-creatives/catalog/1f8933652d266715.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC12\",\"src\":\"assets/images/analytics-creatives/catalog/ac56d6c862027e5b.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC13\",\"src\":\"assets/images/analytics-creatives/catalog/15a1922218b451c5.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC14\",\"src\":\"assets/images/analytics-creatives/catalog/90345642c875f563.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC15\",\"src\":\"assets/images/analytics-creatives/catalog/9efe54e3721d61f8.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC16\",\"src\":\"assets/images/analytics-creatives/catalog/e76f3392541c67a0.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC17\",\"src\":\"assets/images/analytics-creatives/catalog/2be6260c629e8c4f.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC18\",\"src\":\"assets/images/analytics-creatives/catalog/8d64935503d2ee09.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC19\",\"src\":\"assets/images/analytics-creatives/catalog/3b14886a153b4879.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC20\",\"src\":\"assets/images/analytics-creatives/catalog/ae97a9f5515e2926.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC21\",\"src\":\"assets/images/analytics-creatives/catalog/1335c0595506e791.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC22\",\"src\":\"assets/images/analytics-creatives/catalog/180589ecfa6ada72.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC23\",\"src\":\"assets/images/analytics-creatives/catalog/e09ed9893e53b99d.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC24\",\"src\":\"assets/images/analytics-creatives/catalog/5bdb780eb43ef493.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC25\",\"src\":\"assets/images/analytics-creatives/catalog/16a7a34021325a63.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC26\",\"src\":\"assets/images/analytics-creatives/catalog/627dd87a15e1d8f4.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC27\",\"src\":\"assets/images/analytics-creatives/catalog/168a0e8c5c43f606.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC28\",\"src\":\"assets/images/analytics-creatives/catalog/d1eeb0d2fea51a19.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC29\",\"src\":\"assets/images/analytics-creatives/catalog/eee350b317e4fe7f.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC30\",\"src\":\"assets/images/analytics-creatives/catalog/40b02e520b11d67d.webp\",\"note\":\"2026-10-10-lote-02/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV01\",\"src\":\"assets/images/analytics-creatives/catalog/fea10d76f8de4aae.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV02\",\"src\":\"assets/images/analytics-creatives/catalog/006df43df535e6cd.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV03\",\"src\":\"assets/images/analytics-creatives/catalog/081b863f16d87ec0.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV04\",\"src\":\"assets/images/analytics-creatives/catalog/2fde010f88c192a9.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV05\",\"src\":\"assets/images/analytics-creatives/catalog/e9c60c1015cf42f6.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV06\",\"src\":\"assets/images/analytics-creatives/catalog/a5aed671ec5c5521.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV07\",\"src\":\"assets/images/analytics-creatives/catalog/f25a6c5af59c7b8e.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV08\",\"src\":\"assets/images/analytics-creatives/catalog/5337101405e6ab40.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV09\",\"src\":\"assets/images/analytics-creatives/catalog/3199bdaf568d9972.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"DFV10\",\"src\":\"assets/images/analytics-creatives/catalog/9e04a58963f165f0.webp\",\"note\":\"2026-10-10/de-ferias-com-o-violao\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC01\",\"src\":\"assets/images/analytics-creatives/catalog/6226ac94e680cc17.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC02\",\"src\":\"assets/images/analytics-creatives/catalog/32f4da2c86f4159b.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC03\",\"src\":\"assets/images/analytics-creatives/catalog/84d99f221e897b9a.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC04\",\"src\":\"assets/images/analytics-creatives/catalog/2361bbbe465fa08e.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC05\",\"src\":\"assets/images/analytics-creatives/catalog/13623b37c0633f12.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC06\",\"src\":\"assets/images/analytics-creatives/catalog/32ab53af29d78160.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC07\",\"src\":\"assets/images/analytics-creatives/catalog/ea10ab0b2436d747.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC08\",\"src\":\"assets/images/analytics-creatives/catalog/83fffa4a0d0467d1.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC09\",\"src\":\"assets/images/analytics-creatives/catalog/8b0ccf3caa41cd20.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"TAC10\",\"src\":\"assets/images/analytics-creatives/catalog/b4b63dad2df2504e.webp\",\"note\":\"2026-10-10/troca-de-acordes\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC01\",\"src\":\"assets/images/analytics-creatives/catalog/81290880e85704f7.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC02\",\"src\":\"assets/images/analytics-creatives/catalog/5c621a5eb7661a1e.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC03\",\"src\":\"assets/images/analytics-creatives/catalog/a0cb39b4f8851272.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC04\",\"src\":\"assets/images/analytics-creatives/catalog/b85c5f955d659b92.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC05\",\"src\":\"assets/images/analytics-creatives/catalog/55f7a35b6013204e.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC06\",\"src\":\"assets/images/analytics-creatives/catalog/9cc70d4caa62c9a6.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC07\",\"src\":\"assets/images/analytics-creatives/catalog/47e250a3b9c76eab.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC08\",\"src\":\"assets/images/analytics-creatives/catalog/b7daa5c7ca4a66ed.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC09\",\"src\":\"assets/images/analytics-creatives/catalog/62eafe50bbe27411.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC10\",\"src\":\"assets/images/analytics-creatives/catalog/77ac4b45035962d0.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC11\",\"src\":\"assets/images/analytics-creatives/catalog/a46ec78183f360bf.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC12\",\"src\":\"assets/images/analytics-creatives/catalog/04870f55f8f50327.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC13\",\"src\":\"assets/images/analytics-creatives/catalog/d2a216e3cbc2ad12.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC14\",\"src\":\"assets/images/analytics-creatives/catalog/b2c46e921b636cd4.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC15\",\"src\":\"assets/images/analytics-creatives/catalog/48fa89d08d18d0bc.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC16\",\"src\":\"assets/images/analytics-creatives/catalog/e4625a14a39e865a.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC17\",\"src\":\"assets/images/analytics-creatives/catalog/a03dcd0a46edfdba.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC18\",\"src\":\"assets/images/analytics-creatives/catalog/25166072d63a9d8e.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC19\",\"src\":\"assets/images/analytics-creatives/catalog/c54c422300d6e077.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Oficina do Violão\",\"title\":\"VBC20\",\"src\":\"assets/images/analytics-creatives/catalog/7f07ceca1a029c21.webp\",\"note\":\"2026-11-03-violao-bem-cuidado/imagens\"},{\"brand\":\"Mvave BR\",\"title\":\"ES-C07-guitarra-gabinetes\",\"src\":\"assets/images/analytics-creatives/catalog/69a17e116c3d6249.webp\",\"note\":\"Arquivo do repositório\"},{\"brand\":\"Mvave BR\",\"title\":\"ES-C11-bajo-cantidad\",\"src\":\"assets/images/analytics-creatives/catalog/69e35332d7863792.webp\",\"note\":\"Arquivo do repositório\"},{\"brand\":\"Mvave BR\",\"title\":\"ES-C22-acustica-naturalidad\",\"src\":\"assets/images/analytics-creatives/catalog/1a28ccbaa584fd40.webp\",\"note\":\"Arquivo do repositório\"}]"), xR = (e) => e === null ? "—" : e.toLocaleString("pt-BR");
function SR({ data: e, filters: t, compact: n = !1 }) {
	let [r, i] = (0, b.useState)("views"), a = _R(e, t.start, t.end), { rows: o, complete: s } = a, c = e.instagramAudience;
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel manual-instagram",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Insights do Instagram" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Novos seguidores, visualizações e interações · período selecionado" })] }), /* @__PURE__ */ (0, S.jsxs)("select", {
					"aria-label": "Indicador do Instagram",
					value: r,
					onChange: (e) => i(e.target.value),
					children: [
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "views",
							children: "Visualizações"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "interactions",
							children: "Interações"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "followers",
							children: "Novos seguidores"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "instagram-numbers",
				children: [
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Novos seguidores" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(a.followers) })] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Visualizações no período" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(a.views) })] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Interações no período" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(a.interactions) })] })
				]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "instagram-chart",
				children: /* @__PURE__ */ (0, S.jsx)(Fc, {
					width: "100%",
					height: "100%",
					minWidth: 0,
					children: /* @__PURE__ */ (0, S.jsxs)(fI, {
						data: o,
						children: [
							/* @__PURE__ */ (0, S.jsx)(wj, {
								stroke: "#292929",
								strokeDasharray: "3 5",
								vertical: !1
							}),
							/* @__PURE__ */ (0, S.jsx)(iP, {
								dataKey: "date",
								tickFormatter: (e) => e.slice(8, 10) + "/" + e.slice(5, 7),
								tick: {
									fill: "#929292",
									fontSize: 10
								},
								minTickGap: 30
							}),
							/* @__PURE__ */ (0, S.jsx)(yP, { tick: {
								fill: "#929292",
								fontSize: 10
							} }),
							/* @__PURE__ */ (0, S.jsx)(xT, { contentStyle: {
								background: "#202020",
								border: "1px solid #3b3b3b"
							} }),
							/* @__PURE__ */ (0, S.jsx)(OM, {
								type: "linear",
								dataKey: r,
								name: {
									views: "Visualizações",
									interactions: "Interações",
									followers: "Novos seguidores"
								}[r],
								stroke: "#c9a4ff",
								fill: "#c9a4ff20"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, S.jsxs)("p", {
				className: "table-footer",
				children: [s ? "Os três indicadores somam os novos registros diários do período." : "Cobertura incompleta: totais indisponíveis; o gráfico mostra os dias recebidos.", " Novos seguidores representam aquisições no período, não o total atual da conta nem o saldo após deixar de seguir."]
			}),
			!n && c && /* @__PURE__ */ (0, S.jsxs)("div", {
				className: "audience-grid",
				children: [
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("h3", { children: "Faixa etária e gênero" }), c.age.map((e) => /* @__PURE__ */ (0, S.jsxs)("p", { children: [
						e.label,
						" ",
						/* @__PURE__ */ (0, S.jsxs)("strong", { children: [
							"Homens ",
							e.men,
							"% · Mulheres ",
							e.women,
							"%"
						] })
					] }, e.label))] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("h3", { children: "Cidades principais" }), c.cities.slice(0, 5).map((e) => /* @__PURE__ */ (0, S.jsxs)("p", { children: [
						e.label,
						" ",
						/* @__PURE__ */ (0, S.jsxs)("strong", { children: [e.value, "%"] })
					] }, e.label))] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("h3", { children: "Países principais" }), c.countries.slice(0, 5).map((e) => /* @__PURE__ */ (0, S.jsxs)("p", { children: [
						e.label,
						" ",
						/* @__PURE__ */ (0, S.jsxs)("strong", { children: [e.value, "%"] })
					] }, e.label))] })
				]
			}),
			c && /* @__PURE__ */ (0, S.jsx)("p", {
				className: "table-footer",
				children: "Público geral: retrato do arquivo enviado, sem período especificado; não é filtrado pelas datas acima."
			})
		]
	});
}
function CR({ orders: e, metrics: t }) {
	let n = e.filter((e) => LL(e.status)), r = (e) => n.filter((t) => t.manualSourceCategory === e).length, i = r("Código numérico SCK"), a = t.sales && t.purchases !== null ? t.purchases / t.sales * 100 : null;
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel attribution-panel",
		children: [
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Tracking das vendas" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Compras Meta ÷ vendas aprovadas Hotmart × 100" })] })
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-number",
				children: [a === null ? "—" : a.toLocaleString("pt-BR", { maximumFractionDigits: 1 }), /* @__PURE__ */ (0, S.jsx)("span", { children: "%" })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("p", {
				className: "attribution-description",
				children: [
					"compras reportadas pela Meta",
					/* @__PURE__ */ (0, S.jsx)("br", {}),
					"÷ vendas aprovadas Hotmart"
				]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Compras Meta" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(t.purchases) })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Vendas Hotmart" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(t.sales) })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Código numérico SCK" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(i) })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Hotmart Sales Agents" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(r("Hotmart Sales Agents")) })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Marketplace Hotmart" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(r("Marketplace Hotmart")) })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attribution-row",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Order bumps · ferramenta" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: xR(n.filter((e) => e.isBump).length) })]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "insight-note",
				children: /* @__PURE__ */ (0, S.jsx)("p", { children: "Tracking compara as compras reportadas pela Meta com as vendas oficiais da Hotmart, no mesmo período e moeda. Order bumps já entram no total Hotmart quando aprovados; não são somados novamente." })
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "attributed-roas",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "ROAS Hotmart por anúncio" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: "—" })]
			})
		]
	});
}
function wR() {
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel creative-panel",
		children: [
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Biblioteca de criativos" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Pré-visualizações dos arquivos encontrados nos repositórios" })] })
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "filter-note",
				children: "As peças abaixo ainda não estão vinculadas aos anúncios do relatório. Os nomes e as pastas indicam o material de origem; versões LATAM são identificadas no nome."
			}),
			["Mvave BR", "Oficina do Violão"].map((e) => /* @__PURE__ */ (0, S.jsxs)("details", { children: [/* @__PURE__ */ (0, S.jsxs)("summary", { children: [
				e,
				" · ",
				bR.filter((t) => t.brand === e).length,
				" peças"
			] }), /* @__PURE__ */ (0, S.jsx)("div", {
				className: "creative-grid",
				children: bR.filter((t) => t.brand === e).map((e) => /* @__PURE__ */ (0, S.jsxs)("article", {
					className: "creative-card",
					children: [/* @__PURE__ */ (0, S.jsx)(w, {
						src: e.src,
						alt: `${e.brand}: ${e.title}`,
						width: 480,
						height: 480,
						unoptimized: !0,
						loading: "lazy",
						className: "creative-image"
					}), /* @__PURE__ */ (0, S.jsxs)("div", {
						className: "creative-card-body",
						children: [/* @__PURE__ */ (0, S.jsx)("h3", { children: e.title }), /* @__PURE__ */ (0, S.jsx)("small", { children: e.note })]
					})]
				}, e.src))
			})] }, e))
		]
	});
}
// analytics/src/components/manual-fields.tsx
function TR({ data: e, actions: t, onChange: n }) {
	let [r, i] = (0, b.useState)(""), [a, o] = (0, b.useState)(!1);
	async function s(e) {
		await t.save(e), n(e);
	}
	async function c(t) {
		t.preventDefault();
		let n = t.currentTarget, r = new FormData(n), a = String(r.get("username")).trim().replace(/^@/, "").toLowerCase(), c = String(r.get("date")), l = Number(r.get("followers"));
		if (!/^[a-z0-9._]{1,30}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(c) || !Number.isSafeInteger(l) || l < 0) i("Confira o perfil, a data e a quantidade inteira de seguidores.");
		else {
			o(!0);
			try {
				await s([...(e.followers ?? []).filter((e) => e.username !== a || e.date !== c), {
					accountId: "manual-instagram-" + a,
					username: a,
					date: c,
					followers: l,
					observedAt: (/* @__PURE__ */ new Date()).toISOString()
				}].sort((e, t) => e.date.localeCompare(t.date))), i("Registro salvo neste navegador. Selecione o período da data informada para vê-lo no gráfico. Baixe a cópia para levar a outra máquina.");
			} catch {
				i("Não foi possível salvar. Tente novamente.");
			} finally {
				o(!1);
			}
		}
	}
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel manual-fields",
		children: [
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Seus registros de seguidores" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Informe a contagem observada e a data. O gráfico usa apenas esses registros." })] })
			}),
			/* @__PURE__ */ (0, S.jsxs)("form", {
				className: "manual-form",
				onSubmit: c,
				children: [
					/* @__PURE__ */ (0, S.jsxs)("label", { children: ["Perfil do Instagram", /* @__PURE__ */ (0, S.jsx)("input", {
						name: "username",
						placeholder: "@perfil",
						defaultValue: e.followers?.at(-1)?.username ?? "",
						required: !0,
						maxLength: 31
					})] }),
					/* @__PURE__ */ (0, S.jsxs)("label", { children: ["Data do registro", /* @__PURE__ */ (0, S.jsx)("input", {
						name: "date",
						type: "date",
						required: !0
					})] }),
					/* @__PURE__ */ (0, S.jsxs)("label", { children: ["Quantidade de seguidores", /* @__PURE__ */ (0, S.jsx)("input", {
						name: "followers",
						type: "number",
						min: "0",
						step: "1",
						required: !0
					})] }),
					/* @__PURE__ */ (0, S.jsx)("button", {
						className: "button primary",
						disabled: a,
						children: "Salvar registro"
					})
				]
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "filter-note",
				children: "Um registro com o mesmo perfil e data substitui o anterior. Os dados são salvos criptografados neste navegador; publicar o site não envia esses registros automaticamente."
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "manual-actions",
				children: [/* @__PURE__ */ (0, S.jsx)("button", {
					className: "button secondary",
					disabled: a,
					onClick: async () => {
						try {
							await t.download(), i("Cópia criptografada baixada. Ela pode ser restaurada após entrar com sua senha.");
						} catch {
							i("Não foi possível baixar a cópia.");
						}
					},
					children: "Baixar registros"
				}), /* @__PURE__ */ (0, S.jsxs)("label", {
					className: "button secondary",
					children: ["Restaurar registros", /* @__PURE__ */ (0, S.jsx)("input", {
						"aria-label": "Restaurar registros",
						type: "file",
						accept: ".json",
						disabled: a,
						onChange: async (e) => {
							let n = e.target.files?.[0];
							if (n) {
								o(!0);
								try {
									await s(await t.restore(n)), i("Registros restaurados neste navegador.");
								} catch {
									i("Arquivo inválido ou vinculado a outro acesso.");
								} finally {
									o(!1), e.target.value = "";
								}
							}
						}
					})]
				})]
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				role: "status",
				children: r
			}),
			(e.followers ?? []).length > 0 && /* @__PURE__ */ (0, S.jsx)("div", {
				className: "table-scroll",
				children: /* @__PURE__ */ (0, S.jsxs)("table", { children: [/* @__PURE__ */ (0, S.jsx)("thead", { children: /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Perfil" }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Data" }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Seguidores" }),
					/* @__PURE__ */ (0, S.jsx)("th", {})
				] }) }), /* @__PURE__ */ (0, S.jsx)("tbody", { children: e.followers?.map((t) => /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, S.jsxs)("td", { children: ["@", t.username] }),
					/* @__PURE__ */ (0, S.jsx)("td", { children: t.date.split("-").reverse().join("/") }),
					/* @__PURE__ */ (0, S.jsx)("td", { children: t.followers.toLocaleString("pt-BR") }),
					/* @__PURE__ */ (0, S.jsx)("td", { children: /* @__PURE__ */ (0, S.jsx)("button", {
						className: "text-button",
						disabled: a,
						onClick: async () => {
							o(!0);
							try {
								await s(e.followers.filter((e) => e !== t)), i("Registro removido.");
							} catch {
								i("Não foi possível remover.");
							} finally {
								o(!1);
							}
						},
						children: "Remover"
					}) })
				] }, t.accountId + t.date)) })] })
			})
		]
	});
}
// analytics/src/components/performance-panels.tsx
var ER = (e) => e === null ? "—" : e.toLocaleString("pt-BR", { maximumFractionDigits: 0 }), DR = (e) => e === null ? "—" : `${e.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`, OR = (e) => e === null ? "—" : `${e.toLocaleString("pt-BR", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})}x`, kR = (e) => e.slice(8) + "/" + e.slice(5, 7) + "/" + e.slice(0, 4), AR = {
	background: "#202020",
	border: "1px solid #3b3b3b",
	borderRadius: 10,
	color: "#fafafa"
};
function jR({ metrics: e, currency: t, manual: n = !1 }) {
	let [r, i] = (0, b.useState)(e.metaRoas === null && n ? "mer" : "meta"), a = r === "mer" ? e.mer : r === "meta" ? e.metaRoas : e.attributedRoas;
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "roas-hero",
		"aria-label": "ROAS em destaque",
		children: [/* @__PURE__ */ (0, S.jsxs)("div", {
			className: "roas-main",
			children: [
				/* @__PURE__ */ (0, S.jsxs)("span", {
					className: "eyebrow",
					children: [/* @__PURE__ */ (0, S.jsx)(OL, { size: 15 }), " RETORNO SOBRE ANÚNCIOS"]
				}),
				/* @__PURE__ */ (0, S.jsxs)("div", {
					className: "roas-head",
					children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: r === "mer" ? "MER" : "ROAS" }), /* @__PURE__ */ (0, S.jsxs)("select", {
						"aria-label": "Fonte do ROAS em destaque",
						value: r,
						onChange: (e) => i(e.target.value),
						children: [
							n && /* @__PURE__ */ (0, S.jsx)("option", {
								value: "mer",
								children: "Operação · todas as origens"
							}),
							/* @__PURE__ */ (0, S.jsx)("option", {
								value: "meta",
								children: "Atribuído pela Meta"
							}),
							/* @__PURE__ */ (0, S.jsx)("option", {
								value: "hotmart",
								children: "Hotmart · atribuição por anúncio"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, S.jsx)("strong", { children: OR(a) }),
				/* @__PURE__ */ (0, S.jsx)("p", { children: r === "mer" ? "Receita bruta Hotmart ÷ investimento Meta. Inclui todas as origens; não comprova atribuição." : r === "meta" ? "Valor de compras atribuído pela Meta ÷ investimento." : "Receita aprovada Hotmart com origem verificável ÷ investimento." }),
				/* @__PURE__ */ (0, S.jsxs)("small", { children: [
					"MER geral: ",
					OR(e.mer),
					" · inclui todas as origens no recorte."
				] })
			]
		}), /* @__PURE__ */ (0, S.jsxs)("div", {
			className: "roas-context",
			children: [
				/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Investimento em anúncios" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: HL(e.spend, t) })] }),
				/* @__PURE__ */ (0, S.jsxs)("article", { children: [
					/* @__PURE__ */ (0, S.jsx)("span", { children: "Vendas aprovadas · Hotmart" }),
					/* @__PURE__ */ (0, S.jsx)("strong", { children: ER(e.sales) }),
					/* @__PURE__ */ (0, S.jsxs)("small", { children: [HL(e.gross, t), " em receita bruta"] })
				] }),
				/* @__PURE__ */ (0, S.jsxs)("article", { children: [
					/* @__PURE__ */ (0, S.jsx)("span", { children: "Tracking das vendas" }),
					/* @__PURE__ */ (0, S.jsx)("strong", { children: DR(e.trackingRate) }),
					/* @__PURE__ */ (0, S.jsx)("small", { children: n ? "Compras Meta ÷ vendas aprovadas Hotmart" : `${ER(e.attributed)} com origem mapeada` })
				] })
			]
		})]
	});
}
function MR({ metrics: e, currency: t }) {
	let n = [
		{
			title: "Cliques no link",
			value: e.clicks,
			icon: fL,
			cost: "CPC",
			costValue: e.cpc,
			rate: "CTR de link",
			rateValue: e.ctr,
			formula: "Cliques no link ÷ impressões"
		},
		{
			title: "Page View · destino",
			value: e.views,
			icon: XI,
			cost: "Custo por PV",
			costValue: e.costPerView,
			rate: "Connect Rate",
			rateValue: e.connectRate,
			formula: "Visualizações da página de destino ÷ cliques no link"
		},
		{
			title: "Initiate Checkout",
			value: e.checkouts,
			icon: wL,
			cost: "Custo por checkout",
			costValue: e.costPerCheckout,
			rate: "PV → checkout",
			rateValue: e.pvToCheckout,
			formula: "Checkouts iniciados ÷ visualizações da página de destino"
		},
		{
			title: "Compras · Meta",
			value: e.purchases,
			icon: SL,
			cost: "Custo por compra",
			costValue: e.cpa,
			rate: "PV → compra",
			rateValue: e.pvToPurchase,
			formula: "Compras Meta ÷ visualizações da página de destino"
		}
	];
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel funnel-panel",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Do clique à compra" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Eventos da Meta · veja o custo e a passagem entre etapas" })] }), /* @__PURE__ */ (0, S.jsx)("span", {
					className: "eyebrow",
					children: "FUNIL DE PERFORMANCE"
				})]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "performance-funnel",
				children: n.map(({ title: e, value: n, icon: r, cost: i, costValue: a, rate: o, rateValue: s, formula: c }, l) => /* @__PURE__ */ (0, S.jsxs)("article", { children: [
					/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "stage-title",
						children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: ["0", l + 1] }), /* @__PURE__ */ (0, S.jsx)(r, { size: 18 })]
					}),
					/* @__PURE__ */ (0, S.jsx)("h3", { children: e }),
					/* @__PURE__ */ (0, S.jsx)("strong", {
						className: "stage-value",
						children: ER(n)
					}),
					/* @__PURE__ */ (0, S.jsxs)("dl", { children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: i }), /* @__PURE__ */ (0, S.jsx)("dd", { children: HL(a, t) })] }), /* @__PURE__ */ (0, S.jsxs)("div", {
						title: c + " × 100",
						children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: o }), /* @__PURE__ */ (0, S.jsx)("dd", { children: DR(s) })]
					})] }),
					/* @__PURE__ */ (0, S.jsxs)("small", { children: [c, " × 100"] })
				] }, e))
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "table-footer",
				children: "PV significa landing page view, não o evento genérico PageView do pixel. As etapas podem usar janelas de atribuição diferentes e não formam uma coorte única."
			})
		]
	});
}
function NR({ data: e, orders: t, metrics: n }) {
	let r = t.filter((e) => LL(e.status)), i = r.filter((e) => e.manualSourcePresent || Object.values(e.source).some(Boolean)), a = i.filter((t) => !YL(t, e.mappings));
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: e.mode === "manual" ? "Origens registradas na Hotmart" : "Tracking de vendas" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Códigos de origem recebidos nos pedidos Hotmart" })] }), /* @__PURE__ */ (0, S.jsx)(OL, { size: 18 })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "tracking-summary",
				children: [
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: e.mode === "manual" ? "Com código de origem" : "Com atribuição confirmada" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: ER(e.mode === "manual" ? i.length : n.attributed) })] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: e.mode === "manual" ? "Código numérico SCK" : "Origem recebida, sem mapeamento" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: ER(e.mode === "manual" ? r.filter((e) => e.manualSourceCategory === "Código numérico SCK").length : a.length) })] }),
					/* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Sem identificador de origem" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: ER(r.length - i.length) })] })
				]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "table-scroll",
				children: /* @__PURE__ */ (0, S.jsxs)("table", { children: [/* @__PURE__ */ (0, S.jsx)("thead", { children: /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Transação" }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Produto" }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "SRC / SCK / XCOD" }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Correspondência" })
				] }) }), /* @__PURE__ */ (0, S.jsx)("tbody", { children: r.slice(0, 8).map((t) => {
					let n = YL(t, e.mappings);
					return /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, S.jsx)("td", { children: t.transaction }),
						/* @__PURE__ */ (0, S.jsx)("td", { children: t.product }),
						/* @__PURE__ */ (0, S.jsx)("td", { children: Object.entries(t.source).map(([e, t]) => `${e}: ${t}`).join(" · ") || t.manualSourceCategory || "Não informado" }),
						/* @__PURE__ */ (0, S.jsx)("td", { children: n ? `Anúncio ${n.adId}` : e.mode === "manual" && t.manualSourcePresent ? "Código recebido; anúncio não confirmado" : "Origem não identificada" })
					] }, `${t.accountId}:${t.transaction}`);
				}) })] })
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "table-footer",
				children: "Até 8 pedidos para conferência. Não atribuimos vendas apenas porque os nomes da campanha e do produto se parecem."
			})
		]
	});
}
function PR({ series: e, filters: t }) {
	let [n, r] = (0, b.useState)("cumulative"), i = {
		cumulative: {
			title: "Crescimento da operação",
			primary: "cumulativeRevenue",
			secondary: "cumulativeSpend",
			label: "Receita acumulada",
			second: "Investimento acumulado"
		},
		revenue: {
			title: "Receita e investimento",
			primary: "revenue",
			secondary: "spend",
			label: "Receita Hotmart",
			second: "Investimento Meta"
		},
		sales: {
			title: "Evolução das vendas",
			primary: "sales",
			label: "Vendas aprovadas"
		},
		cumulativeSales: {
			title: "Vendas acumuladas",
			primary: "cumulativeSales",
			label: "Vendas aprovadas acumuladas"
		},
		roas: {
			title: "Evolução do ROAS",
			primary: "roas",
			label: "ROAS Meta"
		},
		mer: {
			title: "Evolução do MER",
			primary: "mer",
			label: "MER"
		},
		cpa: {
			title: "Evolução do custo por compra",
			primary: "cpa",
			label: "CPA Meta"
		}
	}[n];
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel main-chart",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: i.title }), /* @__PURE__ */ (0, S.jsxs)("p", { children: [
					t.start === "2026-08-21" ? "Desde o início da operação · " : "",
					kR(t.start),
					" a ",
					kR(t.end)
				] })] }), /* @__PURE__ */ (0, S.jsxs)("select", {
					"aria-label": "Indicador do gráfico",
					value: n,
					onChange: (e) => r(e.target.value),
					children: [
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "cumulative",
							children: "Receita acumulada"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "revenue",
							children: "Receita × mídia"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "sales",
							children: "Vendas por dia"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "cumulativeSales",
							children: "Vendas acumuladas"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "roas",
							children: "ROAS Meta"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "mer",
							children: "MER"
						}),
						/* @__PURE__ */ (0, S.jsx)("option", {
							value: "cpa",
							children: "Custo por compra"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "chart-legend",
				children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [/* @__PURE__ */ (0, S.jsx)("i", { className: "legend-orange" }), i.label] }), i.second && /* @__PURE__ */ (0, S.jsxs)("span", { children: [/* @__PURE__ */ (0, S.jsx)("i", { className: "legend-grey" }), i.second] })]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "chart-container",
				children: /* @__PURE__ */ (0, S.jsx)(Fc, {
					width: "100%",
					height: "100%",
					minWidth: 0,
					children: /* @__PURE__ */ (0, S.jsxs)(fI, {
						data: e,
						margin: {
							top: 10,
							right: 10,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, S.jsx)("defs", { children: /* @__PURE__ */ (0, S.jsxs)("linearGradient", {
								id: "historyFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, S.jsx)("stop", {
									offset: "0%",
									stopColor: "#fc7306",
									stopOpacity: .25
								}), /* @__PURE__ */ (0, S.jsx)("stop", {
									offset: "95%",
									stopColor: "#fc7306",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, S.jsx)(wj, {
								stroke: "#292929",
								strokeDasharray: "3 5",
								vertical: !1
							}),
							/* @__PURE__ */ (0, S.jsx)(iP, {
								dataKey: "label",
								tick: {
									fill: "#929292",
									fontSize: 11
								},
								tickLine: !1,
								axisLine: !1,
								minTickGap: 30
							}),
							/* @__PURE__ */ (0, S.jsx)(yP, {
								width: 54,
								tick: {
									fill: "#929292",
									fontSize: 11
								},
								tickLine: !1,
								axisLine: !1,
								tickFormatter: (e) => Number(e) >= 1e3 ? `${(Number(e) / 1e3).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k` : Number(e).toLocaleString("pt-BR", { maximumFractionDigits: 1 })
							}),
							/* @__PURE__ */ (0, S.jsx)(xT, {
								contentStyle: AR,
								formatter: (e, t) => [typeof e == "number" ? e.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : "—", t === i.primary ? i.label : i.second]
							}),
							i.secondary && /* @__PURE__ */ (0, S.jsx)(OM, {
								type: "monotone",
								dataKey: i.secondary,
								stroke: "#9faaa4",
								strokeWidth: 2,
								fill: "transparent"
							}),
							/* @__PURE__ */ (0, S.jsx)(OM, {
								type: "monotone",
								dataKey: i.primary,
								stroke: "#fc7306",
								strokeWidth: 2.5,
								fill: "url(#historyFill)"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "chart-footnote",
				children: [
					"Valores monetários em ",
					t.currency,
					". Acumulados começam no início do recorte e ficam indisponíveis quando há lacunas na cobertura."
				]
			})
		]
	});
}
function FR({ data: e, filters: t }) {
	let [n, r] = (0, b.useState)(""), i = [...new Map((e.followers ?? []).map((e) => [e.accountId, e.username])).entries()], a = n || i[0]?.[0] || "", o = gR(e.followers ?? [], t.start, t.end, a);
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel instagram-panel",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsxs)("h2", { children: [/* @__PURE__ */ (0, S.jsx)(RI, { size: 18 }), " Crescimento no Instagram"] }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Seguidores da operação · independente do filtro de anúncios/produto" })] }), i.length > 0 && /* @__PURE__ */ (0, S.jsx)("select", {
					"aria-label": "Conta Instagram",
					value: a,
					onChange: (e) => r(e.target.value),
					children: i.map(([e, t]) => /* @__PURE__ */ (0, S.jsxs)("option", {
						value: e,
						children: ["@", t]
					}, e))
				})]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "instagram-numbers",
				children: [/* @__PURE__ */ (0, S.jsxs)("article", { children: [
					/* @__PURE__ */ (0, S.jsx)("span", { children: "Seguidores no último registro do período" }),
					/* @__PURE__ */ (0, S.jsx)("strong", { children: ER(o.latest?.followers ?? null) }),
					/* @__PURE__ */ (0, S.jsx)("small", { children: o.latest ? kR(o.latest.date) : e.mode === "manual" ? "Aguardando seus registros" : "Aguardando integração" })
				] }), /* @__PURE__ */ (0, S.jsxs)("article", { children: [
					/* @__PURE__ */ (0, S.jsx)("span", { children: "Variação entre registros" }),
					/* @__PURE__ */ (0, S.jsxs)("strong", {
						className: o.delta !== null && o.delta >= 0 ? "positive" : "",
						children: [o.delta !== null && o.delta > 0 ? "+" : "", ER(o.delta)]
					}),
					/* @__PURE__ */ (0, S.jsxs)("small", { children: [DR(o.percent), o.baseline ? ` · base de ${kR(o.baseline.date)}` : ""] })
				] })]
			}),
			o.points.length > 0 ? /* @__PURE__ */ (0, S.jsx)("div", {
				className: "instagram-chart",
				children: /* @__PURE__ */ (0, S.jsx)(Fc, {
					width: "100%",
					height: "100%",
					minWidth: 0,
					children: /* @__PURE__ */ (0, S.jsxs)(fI, {
						data: o.points,
						margin: {
							left: 8,
							right: 20,
							top: 10,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, S.jsx)(wj, {
								stroke: "#292929",
								strokeDasharray: "3 5",
								vertical: !1
							}),
							/* @__PURE__ */ (0, S.jsx)(iP, {
								dataKey: "date",
								tickFormatter: kR,
								minTickGap: 45,
								tick: {
									fill: "#929292",
									fontSize: 10
								},
								tickLine: !1,
								axisLine: !1
							}),
							/* @__PURE__ */ (0, S.jsx)(yP, {
								domain: ["auto", "auto"],
								tick: {
									fill: "#929292",
									fontSize: 10
								},
								tickLine: !1,
								axisLine: !1
							}),
							/* @__PURE__ */ (0, S.jsx)(xT, {
								labelFormatter: (e) => kR(String(e)),
								contentStyle: AR
							}),
							/* @__PURE__ */ (0, S.jsx)(OM, {
								type: "linear",
								dataKey: "followers",
								name: "Seguidores",
								stroke: "#c9a4ff",
								fill: "#c9a4ff14",
								strokeWidth: 2,
								dot: o.points.length < 3
							})
						]
					})
				})
			}) : /* @__PURE__ */ (0, S.jsx)("p", {
				className: "empty-copy",
				children: e.mode === "manual" ? "Informe seguidores na aba Instagram. Inclua a data de cada contagem para construir o histórico." : "O histórico começa na primeira coleta autorizada. Registros antigos só aparecerão se existirem dados verificáveis."
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "table-footer",
				children: e.mode === "demo" ? "Contagens e crescimento fictícios para validar o layout." : o.partialBaseline ? "Sem registro anterior ao período: a variação usa o primeiro registro disponível." : e.mode === "manual" ? "Cada ponto é uma contagem informada manualmente. Dias sem registro não são reconstruídos." : "Cada ponto é uma coleta real. O gráfico não reconstrói dias anteriores à integração."
			})
		]
	});
}
function IR({ src: e, demo: t, index: n, name: r }) {
	let [i, a] = (0, b.useState)(!1);
	return t ? /* @__PURE__ */ (0, S.jsxs)("div", {
		className: `demo-creative art-${n % 3}`,
		children: [
			/* @__PURE__ */ (0, S.jsx)("span", { children: "EXEMPLO FICTÍCIO" }),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "demo-pedal",
				children: [
					/* @__PURE__ */ (0, S.jsx)("i", {}),
					/* @__PURE__ */ (0, S.jsx)("i", {}),
					/* @__PURE__ */ (0, S.jsx)("i", {}),
					/* @__PURE__ */ (0, S.jsx)("b", { children: "MV" }),
					/* @__PURE__ */ (0, S.jsx)("em", { children: "●" })
				]
			}),
			/* @__PURE__ */ (0, S.jsx)("strong", { children: n % 3 == 0 ? "Seu próximo timbre." : n % 3 == 1 ? "Mais som. Mais você." : "Comece a tocar." }),
			/* @__PURE__ */ (0, S.jsx)("small", { children: "Mockup de layout · não é um anúncio real" })
		]
	}) : i || !e ? /* @__PURE__ */ (0, S.jsxs)("div", {
		className: "creative-unavailable",
		children: [
			/* @__PURE__ */ (0, S.jsx)(eL, { size: 30 }),
			/* @__PURE__ */ (0, S.jsx)("span", { children: "Prévia indisponível" }),
			/* @__PURE__ */ (0, S.jsx)("small", { children: "Arquivo correspondente ainda não localizado ou prévia indisponível." })
		]
	}) : /* @__PURE__ */ (0, S.jsx)(w, {
		unoptimized: !0,
		src: e,
		alt: `Criativo: ${r}`,
		width: 600,
		height: 600,
		onError: () => a(!0),
		className: "creative-image"
	});
}
function LR({ data: e, filters: t }) {
	let [n, r] = (0, b.useState)(e.mode === "manual" ? "purchases" : "roas"), [i, a] = (0, b.useState)("0"), [o, s] = (0, b.useState)(null), c = (0, b.useRef)(null), l = (0, b.useMemo)(() => vR(e, t, n, Math.max(0, Number(i) || 0) * 10 ** VL(t.currency)), [
		e,
		t,
		n,
		i
	]), u = l.find((e) => e.key === o);
	(0, b.useEffect)(() => {
		u && !c.current?.open && c.current?.showModal(), !u && c.current?.open && c.current.close();
	}, [u]);
	let d = (t, n) => e.mode === "manual" ? e.creatives?.find((e) => e.accountId === t && e.adId === n)?.imageUrl ?? "" : "/api/creative-image?" + new URLSearchParams({
		organization: e.organizationId,
		account: t,
		ad: n
	});
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel creative-panel",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Criativos em perspectiva" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Identifique a imagem, o anúncio e o resultado no mesmo lugar" })] }), /* @__PURE__ */ (0, S.jsx)(eL, { size: 18 })]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "creative-filters",
				children: [
					/* @__PURE__ */ (0, S.jsxs)("label", { children: ["Ordenar por", /* @__PURE__ */ (0, S.jsxs)("select", {
						value: n,
						onChange: (e) => r(e.target.value),
						children: [
							/* @__PURE__ */ (0, S.jsx)("option", {
								value: "roas",
								children: "Maior ROAS Meta"
							}),
							/* @__PURE__ */ (0, S.jsx)("option", {
								value: "purchases",
								children: "Mais compras Meta"
							}),
							/* @__PURE__ */ (0, S.jsx)("option", {
								value: "spend",
								children: "Maior investimento"
							})
						]
					})] }),
					/* @__PURE__ */ (0, S.jsxs)("label", { children: [
						"Gasto mínimo (",
						t.currency,
						")",
						/* @__PURE__ */ (0, S.jsx)("input", {
							type: "number",
							min: "0",
							step: "1",
							value: i,
							onChange: (e) => a(e.target.value)
						})
					] }),
					/* @__PURE__ */ (0, S.jsx)("span", { children: "Avalie o ROAS junto com o gasto e a quantidade de compras." })
				]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "creative-grid",
				children: l.slice(0, 12).map((n, r) => /* @__PURE__ */ (0, S.jsxs)("article", {
					className: "creative-card",
					children: [/* @__PURE__ */ (0, S.jsxs)("button", {
						className: "creative-preview",
						"aria-label": `Ampliar criativo ${n.ad.ad}`,
						onClick: () => s(n.key),
						children: [
							/* @__PURE__ */ (0, S.jsx)(IR, {
								src: d(n.ad.accountId, n.ad.adId),
								demo: e.mode === "demo",
								index: r,
								name: n.ad.ad
							}),
							/* @__PURE__ */ (0, S.jsxs)("span", {
								className: "creative-rank",
								children: ["#", r + 1]
							}),
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "creative-expand",
								children: /* @__PURE__ */ (0, S.jsx)(MI, { size: 16 })
							})
						]
					}), /* @__PURE__ */ (0, S.jsxs)("div", {
						className: "creative-card-body",
						children: [
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "eyebrow",
								children: n.creative?.videoId ? "CAPA DE VÍDEO" : "PRÉVIA DO ANÚNCIO"
							}),
							/* @__PURE__ */ (0, S.jsx)("h3", { children: n.ad.ad }),
							/* @__PURE__ */ (0, S.jsx)("p", { children: n.ad.campaign }),
							/* @__PURE__ */ (0, S.jsxs)("dl", { children: [
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "ROAS Meta" }), /* @__PURE__ */ (0, S.jsx)("dd", {
									className: "orange-value",
									children: OR(n.metrics.metaRoas)
								})] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Compras" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: ER(n.metrics.purchases) })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Gasto" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: HL(n.metrics.spend, t.currency) })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Custo por compra" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: HL(n.metrics.cpa, t.currency) })] })
							] }),
							/* @__PURE__ */ (0, S.jsx)("small", { children: e.mode === "manual" ? n.creative?.matchBasis || "Prévia ainda não vinculada" : "ID do anúncio: " + n.ad.adId })
						]
					})]
				}, n.key))
			}),
			!l.length && /* @__PURE__ */ (0, S.jsx)("p", {
				className: "empty-copy",
				children: "Nenhum criativo com movimentação neste recorte."
			}),
			/* @__PURE__ */ (0, S.jsx)("p", {
				className: "table-footer",
				children: "Até 12 anúncios. No relatório manual, as prévias usam o código da peça no repositório; variações e versões históricas podem diferir. Anúncios sem arquivo correspondente continuam sem imagem."
			}),
			/* @__PURE__ */ (0, S.jsxs)("dialog", {
				ref: c,
				className: "creative-dialog",
				onClose: () => s(null),
				children: [/* @__PURE__ */ (0, S.jsx)("button", {
					className: "icon-button dialog-close",
					"aria-label": "Fechar prévia",
					onClick: () => c.current?.close(),
					children: /* @__PURE__ */ (0, S.jsx)(PL, { size: 20 })
				}), u && /* @__PURE__ */ (0, S.jsxs)(S.Fragment, { children: [
					/* @__PURE__ */ (0, S.jsx)(IR, {
						src: d(u.ad.accountId, u.ad.adId),
						demo: e.mode === "demo",
						index: l.indexOf(u),
						name: u.ad.ad
					}),
					/* @__PURE__ */ (0, S.jsx)("h2", { children: u.ad.ad }),
					/* @__PURE__ */ (0, S.jsxs)("p", { children: [
						u.ad.campaign,
						" → ",
						u.ad.adset
					] }),
					/* @__PURE__ */ (0, S.jsxs)("small", { children: [
						"Anúncio ",
						u.ad.adId,
						" · ROAS ",
						OR(u.metrics.metaRoas)
					] })
				] })]
			})
		]
	});
}
// analytics/src/components/dashboard.tsx
var RR = [
	{
		id: "overview",
		label: "Visão geral",
		icon: iL
	},
	{
		id: "meta",
		label: "Meta Ads",
		icon: AL
	},
	{
		id: "hotmart",
		label: "Hotmart",
		icon: QI
	},
	{
		id: "campaigns",
		label: "Campanhas",
		icon: nL
	},
	{
		id: "creatives",
		label: "Criativos",
		icon: eL
	},
	{
		id: "tracking",
		label: "Tracking",
		icon: OL
	},
	{
		id: "instagram",
		label: "Instagram",
		icon: RI
	},
	{
		id: "products",
		label: "Produtos",
		icon: PI
	},
	{
		id: "reports",
		label: "Relatórios",
		icon: BI
	},
	{
		id: "integrations",
		label: "Integrações",
		icon: oL
	},
	{
		id: "settings",
		label: "Configurações",
		icon: vL
	}
], zR = (e, t = 2) => e === null ? "—" : e.toLocaleString("pt-BR", {
	maximumFractionDigits: t,
	minimumFractionDigits: t
}), BR = (e) => e === null ? "—" : `${zR(e)}x`, VR = (e) => e === null ? "—" : e.toLocaleString("pt-BR", { maximumFractionDigits: 0 }), HR = (e) => new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "short",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "America/Sao_Paulo"
}).format(new Date(e));
function UR({ initialData: e, initialStart: t, initialEnd: n, manualActions: r, manualNotice: i }) {
	let a = E(), [o, s] = (0, b.useState)(() => Date.now()), [c, l] = (0, b.useState)(e), [u, d] = (0, b.useState)("overview"), [f, p] = (0, b.useState)(!1), [m, h] = (0, b.useState)({
		start: t,
		end: n,
		currency: "BRL",
		account: "all",
		product: "all"
	}), [g, _] = (0, b.useState)({
		start: t,
		end: n
	}), [v, y] = (0, b.useState)(!0), [x, T] = (0, b.useState)(!1), [D, O] = (0, b.useState)(""), [k, ee] = (0, b.useState)(e.mode === "manual" ? "Importação manual" : e.mode === "demo" ? "Demonstração" : "Conectando"), A = (0, b.useCallback)(async (t) => {
		if (e.mode === "live") {
			T(!0);
			try {
				let n = new URLSearchParams({
					organization: e.organizationId,
					start: m.start,
					end: m.end
				}), r = await fetch(`/api/report?${n}`, {
					cache: "no-store",
					signal: t
				});
				if (r.status === 401 || r.status === 403) {
					a.replace("/login"), a.refresh();
					return;
				}
				if (!r.ok) throw Error("REPORT_UNAVAILABLE");
				let i = await r.json();
				t?.aborted || (l(i), s(Date.now()), O(""));
			} catch (e) {
				e instanceof DOMException && e.name === "AbortError" || O("Não foi possível atualizar. Os últimos dados carregados continuam na tela.");
			} finally {
				t?.aborted || T(!1);
			}
		}
	}, [
		e.mode,
		e.organizationId,
		m.start,
		m.end,
		a
	]);
	(0, b.useEffect)(() => {
		if (e.mode !== "live") return;
		let t = new AbortController(), n = $L(), r, i = !1, a = () => {
			i || t.signal.aborted || (i = !0, A(t.signal).finally(() => {
				i = !1;
			}));
		};
		a();
		let o = n.channel(`analytics-${e.organizationId}`);
		for (let t of [
			"hotmart_orders",
			"sync_jobs",
			"attribution_mapping",
			"instagram_snapshots",
			"ad_creatives"
		]) o.on("postgres_changes", {
			event: "*",
			schema: "public",
			table: t,
			filter: `organization_id=eq.${e.organizationId}`
		}, () => {
			clearTimeout(r), r = setTimeout(a, 700);
		});
		o.subscribe((e) => {
			t.signal.aborted || ee(e === "SUBSCRIBED" ? "Ao vivo" : e === "CHANNEL_ERROR" || e === "TIMED_OUT" ? "Reconectando" : "Conectando");
		});
		let s = setInterval(a, 6e4);
		return () => {
			t.abort(), clearTimeout(r), clearInterval(s), n.removeChannel(o);
		};
	}, [
		e.mode,
		e.organizationId,
		A
	]);
	let j = (0, b.useMemo)(() => ZL(c, m), [c, m]), M = (0, b.useMemo)(() => mR(c, m, UL(new Date(o).toISOString())), [
		c,
		m,
		o
	]), N = M.metrics, P = (0, b.useMemo)(() => mR(c, qL(m), UL(new Date(o).toISOString())).metrics, [
		c,
		m,
		o
	]), te = [.../* @__PURE__ */ new Set([
		"BRL",
		...c.orders.map((e) => e.currency),
		...c.insights.map((e) => e.currency)
	])], ne = [...new Map(c.orders.map((e) => [e.productId, e.product])).entries()], re = (0, b.useMemo)(() => hR(c, m, UL(new Date(o).toISOString())), [
		c,
		m,
		o
	]), ie = [...new Set(j.orders.map((e) => e.productId))].map((e) => {
		let t = j.orders.filter((t) => t.productId === e), n = t.filter((e) => LL(e.status));
		return {
			id: e,
			name: t[0].product,
			sales: n.length,
			revenue: n.reduce((e, t) => e + t.gross, 0)
		};
	}).sort((e, t) => t.revenue - e.revenue), ae = [...new Set(j.orders.filter((e) => LL(e.status)).map((e) => e.payment))].map((e) => ({
		name: e === "CREDIT_CARD" ? "Cartão" : e,
		value: j.orders.filter((t) => LL(t.status) && t.payment === e).length
	})), F = c.mode === "manual", oe = c.mode === "demo", se = RR.find((e) => e.id === u), ce = j.orders.length > 0 || j.insights.length > 0, le = c.mode === "live" && c.sync.some((e) => !e.lastSuccess || o - Date.parse(e.lastSuccess) > (e.provider === "instagram" ? 120 : 15) * 6e4 || e.status === "error");
	function ue(e) {
		d(e), p(!1);
	}
	function de(e) {
		e.preventDefault();
		let t = GL(g.start, g.end);
		!Number.isFinite(t) || t < 1 || t > 3660 ? O("Escolha um período válido de até 10 anos.") : (O(""), h({
			...m,
			...g
		}));
	}
	function fe(e) {
		let t = oe || F ? n : UL((/* @__PURE__ */ new Date()).toISOString()), r = {
			start: e === 0 ? yR : KL(t, 1 - e),
			end: t
		};
		_(r), h({
			...m,
			...r
		});
	}
	return /* @__PURE__ */ (0, S.jsxs)("div", {
		className: `dashboard-shell ${F ? "manual-analytics" : ""}`,
		children: [
			/* @__PURE__ */ (0, S.jsx)("a", {
				className: "skip-link",
				href: "#main-content",
				children: "Pular para o conteúdo"
			}),
			f && /* @__PURE__ */ (0, S.jsx)("button", {
				className: "sidebar-backdrop",
				"aria-label": "Fechar menu",
				onClick: () => p(!1)
			}),
			/* @__PURE__ */ (0, S.jsxs)("aside", {
				className: `sidebar ${f ? "open" : ""}`,
				children: [
					/* @__PURE__ */ (0, S.jsxs)(C, {
						href: F ? "clientes/analytics/index.html" : oe ? "/demo" : "/dashboard",
						className: "brand official-brand",
						children: [/* @__PURE__ */ (0, S.jsx)(w, {
							src: "/brand.svg",
							alt: "Marketing Figueroa",
							width: 158,
							height: 58,
							priority: !0
						}), /* @__PURE__ */ (0, S.jsx)("small", { children: "ANALYTICS" })]
					}),
					/* @__PURE__ */ (0, S.jsx)("button", {
						className: "mobile-close icon-button",
						"aria-label": "Fechar menu",
						onClick: () => p(!1),
						children: /* @__PURE__ */ (0, S.jsx)(PL, { size: 20 })
					}),
					/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "workspace",
						children: [
							/* @__PURE__ */ (0, S.jsx)("div", {
								className: "workspace-icon",
								children: "M"
							}),
							/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("strong", { children: c.organization }), /* @__PURE__ */ (0, S.jsx)("small", { children: "Visão da operação" })] }),
							/* @__PURE__ */ (0, S.jsx)(WI, { size: 14 })
						]
					}),
					/* @__PURE__ */ (0, S.jsx)("span", {
						className: "nav-caption",
						children: "WORKSPACE"
					}),
					/* @__PURE__ */ (0, S.jsx)("nav", {
						"aria-label": "Navegação principal",
						children: RR.map(({ id: e, label: t, icon: n }) => /* @__PURE__ */ (0, S.jsxs)("button", {
							className: `${u === e ? "active" : ""} ${e === "integrations" ? "nav-divider" : ""}`,
							onClick: () => ue(e),
							"aria-current": u === e ? "page" : void 0,
							children: [
								/* @__PURE__ */ (0, S.jsx)(n, { size: 18 }),
								F && e === "integrations" ? "Dados manuais" : F && e === "campaigns" ? "Anúncios" : t,
								u === e && /* @__PURE__ */ (0, S.jsx)("span", { className: "nav-dot" })
							]
						}, e))
					}),
					/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "sidebar-bottom",
						children: [
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "private-note",
								children: [/* @__PURE__ */ (0, S.jsx)(bL, { size: 18 }), /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("strong", { children: oe ? "Ambiente demonstrativo" : "Ambiente privado" }), /* @__PURE__ */ (0, S.jsx)("small", { children: oe ? "Dados 100% fictícios" : F ? "Dados manuais criptografados" : "Acesso protegido com MFA" })] })]
							}),
							/* @__PURE__ */ (0, S.jsxs)("a", {
								className: "help-link",
								href: "#method",
								onClick: () => ue("reports"),
								children: [/* @__PURE__ */ (0, S.jsx)(JI, { size: 16 }), " Como ler os indicadores"]
							}),
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "sidebar-footer",
								children: [
									/* @__PURE__ */ (0, S.jsx)("span", {
										className: "avatar",
										children: oe ? "D" : "F"
									}),
									/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("strong", { children: oe ? "Visitante" : "Conta autorizada" }), /* @__PURE__ */ (0, S.jsx)("small", { children: oe ? "Modo de demonstração" : "Sessão verificada" })] }),
									oe ? /* @__PURE__ */ (0, S.jsx)(C, {
										href: "/login",
										"aria-label": "Ir para login",
										children: /* @__PURE__ */ (0, S.jsx)(cL, { size: 17 })
									}) : /* @__PURE__ */ (0, S.jsx)("form", {
										action: uR,
										children: /* @__PURE__ */ (0, S.jsx)("button", {
											className: "icon-button",
											title: "Sair",
											"aria-label": "Sair",
											children: /* @__PURE__ */ (0, S.jsx)(cL, { size: 17 })
										})
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "main-shell",
				children: [/* @__PURE__ */ (0, S.jsxs)("header", {
					className: "topbar",
					children: [/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "breadcrumb",
						children: [
							/* @__PURE__ */ (0, S.jsx)("button", {
								className: "mobile-toggle icon-button",
								onClick: () => p(!0),
								"aria-label": "Abrir menu",
								"aria-expanded": f,
								children: /* @__PURE__ */ (0, S.jsx)(uL, { size: 20 })
							}),
							/* @__PURE__ */ (0, S.jsx)("span", { children: "Workspace" }),
							/* @__PURE__ */ (0, S.jsx)(KI, { size: 13 }),
							/* @__PURE__ */ (0, S.jsx)("strong", { children: se.label })
						]
					}), /* @__PURE__ */ (0, S.jsxs)("div", {
						className: "topbar-right",
						children: [
							/* @__PURE__ */ (0, S.jsxs)("span", {
								className: `connection ${oe ? "demo" : ""}`,
								children: [/* @__PURE__ */ (0, S.jsx)("i", {}), k]
							}),
							/* @__PURE__ */ (0, S.jsx)("span", { className: "topbar-separator" }),
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "avatar small",
								children: oe ? "D" : "F"
							})
						]
					})]
				}), /* @__PURE__ */ (0, S.jsxs)("main", {
					id: "main-content",
					className: "main-content",
					children: [
						oe && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "demo-banner",
							children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [
								/* @__PURE__ */ (0, S.jsx)(IL, { size: 14 }),
								/* @__PURE__ */ (0, S.jsx)("strong", { children: "Demonstração" }),
								" Você está explorando dados fictícios. Nenhuma plataforma está conectada."
							] }), /* @__PURE__ */ (0, S.jsxs)(C, {
								href: "/login",
								children: ["Acesso privado ", /* @__PURE__ */ (0, S.jsx)(MI, { size: 14 })]
							})]
						}),
						/* @__PURE__ */ (0, S.jsxs)("div", {
							className: "page-heading",
							children: [
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [
									/* @__PURE__ */ (0, S.jsx)("span", {
										className: "eyebrow",
										children: "MVAVE BR / PERFORMANCE"
									}),
									/* @__PURE__ */ (0, S.jsxs)("h1", { children: [u === "overview" ? "Sua operação, em perspectiva." : se.label, /* @__PURE__ */ (0, S.jsx)("span", {
										className: "orange-dot",
										children: "."
									})] }),
									/* @__PURE__ */ (0, S.jsx)("p", { children: u === "overview" ? "Mídia, vendas e resultado. Cada número no seu devido lugar." : WR[u] })
								] }),
								F && /* @__PURE__ */ (0, S.jsxs)("button", {
									className: "button secondary",
									onClick: () => ue("instagram"),
									children: [/* @__PURE__ */ (0, S.jsx)(RI, { size: 15 }), "Ver Instagram"]
								}),
								!oe && !F && /* @__PURE__ */ (0, S.jsxs)("button", {
									className: "button secondary",
									disabled: x,
									onClick: () => void A(),
									children: [/* @__PURE__ */ (0, S.jsx)(mL, {
										size: 15,
										className: x ? "spin" : ""
									}), x ? "Atualizando…" : "Atualizar visão"]
								})
							]
						}),
						!["integrations", "settings"].includes(u) && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "filter-panel",
							children: [
								/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "filter-selects",
									children: [
										/* @__PURE__ */ (0, S.jsxs)("label", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "CONTA" }), /* @__PURE__ */ (0, S.jsxs)("select", {
											value: m.account,
											onChange: (e) => h({
												...m,
												account: e.target.value
											}),
											children: [/* @__PURE__ */ (0, S.jsx)("option", {
												value: "all",
												children: "Toda a operação"
											}), c.accounts.map((e) => /* @__PURE__ */ (0, S.jsx)("option", {
												value: e.id,
												children: e.name
											}, e.id))]
										})] }),
										/* @__PURE__ */ (0, S.jsxs)("label", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "PRODUTO" }), /* @__PURE__ */ (0, S.jsxs)("select", {
											value: m.product,
											onChange: (e) => h({
												...m,
												product: e.target.value
											}),
											children: [/* @__PURE__ */ (0, S.jsx)("option", {
												value: "all",
												children: "Todos os produtos"
											}), ne.map(([e, t]) => /* @__PURE__ */ (0, S.jsx)("option", {
												value: e,
												children: t
											}, e))]
										})] }),
										/* @__PURE__ */ (0, S.jsxs)("label", {
											className: "currency-filter",
											children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "MOEDA" }), /* @__PURE__ */ (0, S.jsx)("select", {
												value: m.currency,
												onChange: (e) => h({
													...m,
													currency: e.target.value
												}),
												children: te.map((e) => /* @__PURE__ */ (0, S.jsx)("option", { children: e }, e))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, S.jsxs)("form", {
									className: "date-filter",
									onSubmit: de,
									children: [
										/* @__PURE__ */ (0, S.jsx)(II, { size: 16 }),
										/* @__PURE__ */ (0, S.jsx)("input", {
											"aria-label": "Data inicial",
											type: "date",
											value: g.start,
											onChange: (e) => _({
												...g,
												start: e.target.value
											}),
											required: !0
										}),
										/* @__PURE__ */ (0, S.jsx)("span", { children: "—" }),
										/* @__PURE__ */ (0, S.jsx)("input", {
											"aria-label": "Data final",
											type: "date",
											value: g.end,
											onChange: (e) => _({
												...g,
												end: e.target.value
											}),
											required: !0
										}),
										/* @__PURE__ */ (0, S.jsx)("button", {
											className: "icon-button apply-date",
											title: "Aplicar período",
											"aria-label": "Aplicar período",
											children: /* @__PURE__ */ (0, S.jsx)(HI, { size: 16 })
										})
									]
								}),
								/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "filter-bottom",
									children: [
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "presets",
											children: [
												/* @__PURE__ */ (0, S.jsx)("button", {
													onClick: () => fe(0),
													className: m.start === "2026-08-21" ? "selected" : "",
													children: "Desde 21/08/2026"
												}),
												F && c.manualPeriods?.map((e) => /* @__PURE__ */ (0, S.jsx)("button", {
													className: m.start === e.start && m.end === e.end ? "selected" : "",
													onClick: () => {
														_({
															start: e.start,
															end: e.end
														}), h({
															...m,
															start: e.start,
															end: e.end
														});
													},
													children: e.month
												}, e.start)),
												!F && [
													7,
													14,
													30
												].map((e) => /* @__PURE__ */ (0, S.jsxs)("button", {
													onClick: () => fe(e),
													className: GL(m.start, m.end) === e ? "selected" : "",
													children: [e, " dias"]
												}, e))
											]
										}),
										/* @__PURE__ */ (0, S.jsxs)("label", {
											className: "compare",
											children: [/* @__PURE__ */ (0, S.jsx)("input", {
												type: "checkbox",
												checked: v,
												onChange: (e) => y(e.target.checked)
											}), " Comparar com período anterior"]
										}),
										/* @__PURE__ */ (0, S.jsx)("span", { children: "America/Sao_Paulo" })
									]
								})
							]
						}),
						F && !oe && /* @__PURE__ */ (0, S.jsx)("p", {
							className: "filter-note",
							children: "Dados reais de arquivos manuais · Meta disponível por período completo do export; Hotmart por dia. Campos ausentes ficam em branco. Nenhuma conta conectada."
						}),
						i && /* @__PURE__ */ (0, S.jsx)("div", {
							className: "notice",
							role: "status",
							children: i
						}),
						D && /* @__PURE__ */ (0, S.jsx)("div", {
							className: "notice error-notice",
							role: "alert",
							children: D
						}),
						le && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "notice",
							children: ["Há integrações sem atualização recente. Confira a cobertura antes de tomar decisões. ", /* @__PURE__ */ (0, S.jsx)("button", {
								className: "text-button",
								onClick: () => ue("integrations"),
								children: "Ver integrações →"
							})]
						}),
						!oe && (!M.metaCovered || !M.hotmartCovered) && !["integrations", "settings"].includes(u) && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "notice",
							children: [
								"Histórico ainda incompleto no período: ",
								M.metaCovered ? "" : "Meta Ads ",
								M.hotmartCovered ? "" : "Hotmart",
								". Indicadores sem cobertura ficam indisponíveis. Tabelas mostram somente os registros já importados."
							]
						}),
						(m.account !== "all" || m.product !== "all") && !["settings", "integrations"].includes(u) && /* @__PURE__ */ (0, S.jsx)("p", {
							className: "filter-note",
							children: "Neste recorte, vendas e mídia são relacionadas somente por mapeamentos explícitos. Vendas sem origem identificada podem ficar fora; o investimento por produto inclui apenas anúncios mapeados."
						}),
						!ce && ![
							"integrations",
							"settings",
							"instagram"
						].includes(u) && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "empty-state",
							children: [
								/* @__PURE__ */ (0, S.jsx)(BI, { size: 28 }),
								/* @__PURE__ */ (0, S.jsx)("h2", { children: "Nenhum dado neste período." }),
								/* @__PURE__ */ (0, S.jsx)("p", { children: oe ? "Explore os dados fictícios de 21 de agosto a 1 de novembro de 2026." : F ? "Selecione um dos períodos importados para visualizar os dados." : "Conecte as integrações e aguarde o primeiro processamento, ou escolha outro período." }),
								/* @__PURE__ */ (0, S.jsx)("button", {
									className: "button secondary",
									onClick: () => oe ? fe(30) : ue("integrations"),
									children: oe ? "Ver 30 dias de demonstração" : "Ver integrações"
								})
							]
						}),
						["overview", "meta"].includes(u) && /* @__PURE__ */ (0, S.jsxs)(S.Fragment, { children: [/* @__PURE__ */ (0, S.jsx)(jR, {
							metrics: N,
							currency: m.currency,
							manual: F
						}), /* @__PURE__ */ (0, S.jsx)(MR, {
							metrics: N,
							currency: m.currency
						})] }),
						[
							"overview",
							"meta",
							"hotmart"
						].includes(u) && /* @__PURE__ */ (0, S.jsxs)(S.Fragment, { children: [
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "section-caption",
								children: [/* @__PURE__ */ (0, S.jsx)("span", { children: u === "meta" ? "DESEMPENHO DA MÍDIA" : u === "hotmart" ? "FINANCEIRO CONFIRMADO" : "O QUE MOVE A OPERAÇÃO" }), /* @__PURE__ */ (0, S.jsx)("span", { children: v ? `${GL(m.start, m.end)} dias × período anterior` : "Período selecionado" })]
							}),
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "kpi-grid",
								children: [
									/* @__PURE__ */ (0, S.jsx)(GR, {
										title: u === "meta" ? "Investimento em mídia" : "Receita bruta aprovada",
										value: HL(u === "meta" ? N.spend : N.gross, m.currency),
										change: v ? JL(u === "meta" ? N.spend : N.gross, u === "meta" ? P.spend : P.gross) : null,
										detail: u === "meta" ? "Meta Ads · valor gasto" : F ? "Hotmart · bruto sem impostos do export" : "Hotmart · total pago nas compras aprovadas",
										icon: /* @__PURE__ */ (0, S.jsx)(ML, { size: 18 }),
										featured: !0
									}),
									/* @__PURE__ */ (0, S.jsx)(GR, {
										title: u === "meta" ? "Compras atribuídas · Meta" : "Investimento em mídia",
										value: u === "meta" ? VR(N.purchases) : HL(N.spend, m.currency),
										change: v ? JL(u === "meta" ? N.purchases : N.spend, u === "meta" ? P.purchases : P.spend) : null,
										detail: u === "meta" ? "Conversões reportadas pela plataforma" : "Meta Ads · valor gasto",
										icon: /* @__PURE__ */ (0, S.jsx)(fL, { size: 18 }),
										neutral: !0
									}),
									/* @__PURE__ */ (0, S.jsx)(GR, {
										title: u === "meta" ? "ROAS · Meta" : "Resultado após mídia",
										value: u === "meta" ? BR(N.metaRoas) : HL(N.profit, m.currency),
										change: v ? JL(u === "meta" ? N.metaRoas : N.profit, u === "meta" ? P.metaRoas : P.profit) : null,
										detail: u === "meta" ? "Valor atribuído Meta ÷ investimento" : "Líquido apurado − investimento",
										icon: /* @__PURE__ */ (0, S.jsx)(AL, { size: 18 })
									}),
									/* @__PURE__ */ (0, S.jsx)(GR, {
										title: u === "meta" ? "CPA · Meta" : "MER da operação",
										value: u === "meta" ? HL(N.cpa, m.currency) : BR(N.mer),
										change: v ? JL(u === "meta" ? N.cpa : N.mer, u === "meta" ? P.cpa : P.mer) : null,
										detail: u === "meta" ? "Investimento ÷ compras Meta" : "Receita bruta ÷ investimento total",
										icon: /* @__PURE__ */ (0, S.jsx)(BI, { size: 18 }),
										inverse: u === "meta"
									})
								]
							}),
							/* @__PURE__ */ (0, S.jsx)("div", {
								className: "secondary-kpis",
								children: (u === "meta" ? [
									["Impressões", VR(N.impressions)],
									["CPC · link", HL(N.cpc, m.currency)],
									["CTR · link", N.ctr === null ? "—" : zR(N.ctr) + "%"],
									["CPM", HL(N.cpm, m.currency)],
									["Frequência", zR(N.frequency)]
								] : [
									["Vendas aprovadas", VR(N.sales)],
									["Ticket médio", HL(N.ticket, m.currency)],
									["Líquido apurado", HL(N.net, m.currency)],
									["Pendentes", VR(N.pending)],
									["Reembolsos / chargebacks", VR(N.refunds)]
								]).map(([e, t]) => /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: e }), /* @__PURE__ */ (0, S.jsx)("strong", { children: t })] }, e))
							}),
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "charts-grid",
								children: [/* @__PURE__ */ (0, S.jsx)(PR, {
									series: re,
									filters: m
								}), F ? /* @__PURE__ */ (0, S.jsx)(CR, {
									orders: j.orders,
									metrics: N
								}) : /* @__PURE__ */ (0, S.jsxs)("section", {
									className: "panel attribution-panel",
									children: [
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "panel-heading",
											children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "De onde vêm as vendas" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Atribuição verificável · Hotmart" })] }), /* @__PURE__ */ (0, S.jsx)(oL, { size: 17 })]
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "attribution-number",
											children: [N.trackingRate === null ? "—" : Math.round(N.trackingRate), /* @__PURE__ */ (0, S.jsx)("span", { children: "%" })]
										}),
										/* @__PURE__ */ (0, S.jsxs)("p", {
											className: "attribution-description",
											children: [
												"das vendas aprovadas com",
												/* @__PURE__ */ (0, S.jsx)("br", {}),
												"origem identificada"
											]
										}),
										/* @__PURE__ */ (0, S.jsx)("div", {
											className: "attribution-track",
											children: /* @__PURE__ */ (0, S.jsx)("span", { style: { width: `${N.sales ? N.attributed / N.sales * 100 : 0}%` } })
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "attribution-row",
											children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [/* @__PURE__ */ (0, S.jsx)("i", {}), "Com identificação"] }), /* @__PURE__ */ (0, S.jsx)("strong", { children: N.attributed })]
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "attribution-row muted",
											children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [/* @__PURE__ */ (0, S.jsx)("i", {}), "Origem não identificada"] }), /* @__PURE__ */ (0, S.jsx)("strong", { children: N.unattributed })]
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "insight-note",
											children: [/* @__PURE__ */ (0, S.jsx)(bL, { size: 17 }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Sem correspondência confiável, a venda permanece sem atribuição." })]
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "attributed-roas",
											children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "ROAS Hotmart atribuído" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: BR(N.attributedRoas) })]
										})
									]
								})]
							})
						] }),
						F && u === "overview" && /* @__PURE__ */ (0, S.jsx)(SR, {
							data: c,
							filters: m,
							compact: !0
						}),
						[
							"overview",
							"campaigns",
							"meta"
						].includes(u) && /* @__PURE__ */ (0, S.jsx)(KR, {
							manual: F,
							insights: j.insights,
							orders: j.orders,
							mappings: c.mappings,
							currency: m.currency
						}),
						[
							"overview",
							"hotmart",
							"products"
						].includes(u) && /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "bottom-grid",
							children: [/* @__PURE__ */ (0, S.jsxs)("section", {
								className: "panel",
								children: [/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "panel-heading",
									children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Receita por produto" }), /* @__PURE__ */ (0, S.jsxs)("p", { children: ["Compras aprovadas · ", m.currency] })] }), /* @__PURE__ */ (0, S.jsx)(PI, { size: 17 })]
								}), ie.length ? ie.map((e, t) => /* @__PURE__ */ (0, S.jsxs)("div", {
									className: "product-row",
									children: [
										/* @__PURE__ */ (0, S.jsxs)("span", {
											className: "product-index",
											children: ["0", t + 1]
										}),
										/* @__PURE__ */ (0, S.jsxs)("div", {
											className: "product-info",
											children: [
												/* @__PURE__ */ (0, S.jsx)("strong", { children: e.name }),
												/* @__PURE__ */ (0, S.jsxs)("span", { children: [e.sales, " vendas aprovadas"] }),
												/* @__PURE__ */ (0, S.jsx)("div", {
													className: "product-track",
													children: /* @__PURE__ */ (0, S.jsx)("i", { style: { width: `${ie[0].revenue ? e.revenue / ie[0].revenue * 100 : 0}%` } })
												})
											]
										}),
										/* @__PURE__ */ (0, S.jsx)("strong", { children: HL(e.revenue, m.currency) })
									]
								}, e.id)) : /* @__PURE__ */ (0, S.jsx)("p", {
									className: "empty-copy",
									children: "Nenhuma venda no recorte selecionado."
								})]
							}), /* @__PURE__ */ (0, S.jsxs)("section", {
								className: "panel",
								children: [/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "panel-heading",
									children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Formas de pagamento" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Distribuição das vendas aprovadas" })] }), /* @__PURE__ */ (0, S.jsx)(ML, { size: 17 })]
								}), /* @__PURE__ */ (0, S.jsx)("div", {
									className: "payment-chart",
									children: /* @__PURE__ */ (0, S.jsx)(Fc, {
										width: "100%",
										height: "100%",
										minWidth: 0,
										children: /* @__PURE__ */ (0, S.jsxs)(uI, {
											data: ae,
											layout: "vertical",
											margin: {
												left: 0,
												right: 20,
												top: 12,
												bottom: 12
											},
											children: [
												/* @__PURE__ */ (0, S.jsx)(iP, {
													type: "number",
													hide: !0
												}),
												/* @__PURE__ */ (0, S.jsx)(yP, {
													type: "category",
													dataKey: "name",
													width: 95,
													tick: {
														fill: "#b4b4b4",
														fontSize: 12
													},
													axisLine: !1,
													tickLine: !1
												}),
												/* @__PURE__ */ (0, S.jsx)(xT, {
													cursor: { fill: "#ffffff05" },
													contentStyle: {
														background: "#202020",
														border: "1px solid #333",
														borderRadius: 8
													}
												}),
												/* @__PURE__ */ (0, S.jsx)(LN, {
													dataKey: "value",
													name: "Vendas",
													fill: "#fc7306",
													radius: [
														0,
														5,
														5,
														0
													],
													barSize: 18
												})
											]
										})
									})
								})]
							})]
						}),
						u === "hotmart" && /* @__PURE__ */ (0, S.jsxs)("section", {
							className: "panel",
							children: [
								/* @__PURE__ */ (0, S.jsx)("div", {
									className: "panel-heading",
									children: /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Pedidos no período" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Uma linha por transação; sem dados pessoais dos compradores" })] })
								}),
								/* @__PURE__ */ (0, S.jsx)("div", {
									className: "table-scroll",
									children: /* @__PURE__ */ (0, S.jsxs)("table", { children: [/* @__PURE__ */ (0, S.jsx)("thead", { children: /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, S.jsx)("th", { children: "Transação" }),
										/* @__PURE__ */ (0, S.jsx)("th", { children: "Produto" }),
										/* @__PURE__ */ (0, S.jsx)("th", { children: "Status" }),
										/* @__PURE__ */ (0, S.jsx)("th", { children: "Tipo" }),
										/* @__PURE__ */ (0, S.jsx)("th", { children: F ? "Bruto sem impostos" : "Total pago" })
									] }) }), /* @__PURE__ */ (0, S.jsx)("tbody", { children: j.orders.slice(0, 100).map((e) => /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, S.jsx)("td", { children: e.transaction }),
										/* @__PURE__ */ (0, S.jsx)("td", { children: e.product }),
										/* @__PURE__ */ (0, S.jsx)("td", { children: e.status }),
										/* @__PURE__ */ (0, S.jsx)("td", { children: F ? e.manualTool || "Não informado" : e.isBump ? "Order bump" : e.isFunnel ? "Funil" : "Compra" }),
										/* @__PURE__ */ (0, S.jsx)("td", { children: HL(e.gross, e.currency) })
									] }, `${e.accountId}:${e.transaction}`)) })] })
								}),
								/* @__PURE__ */ (0, S.jsx)("p", {
									className: "table-footer",
									children: "Exibindo até 100 transações. Totais consideram todo o período selecionado."
								})
							]
						}),
						["overview", "creatives"].includes(u) && /* @__PURE__ */ (0, S.jsx)(LR, {
							data: c,
							filters: m
						}),
						F && u === "creatives" && /* @__PURE__ */ (0, S.jsx)(wR, {}),
						F && u === "tracking" && /* @__PURE__ */ (0, S.jsx)(CR, {
							orders: j.orders,
							metrics: N
						}),
						u === "tracking" && /* @__PURE__ */ (0, S.jsx)(NR, {
							data: c,
							orders: j.orders,
							metrics: N
						}),
						F && u === "instagram" && r && /* @__PURE__ */ (0, S.jsxs)("details", {
							className: "manual-total-details",
							children: [/* @__PURE__ */ (0, S.jsx)("summary", { children: "Registrar total atual de seguidores (opcional)" }), /* @__PURE__ */ (0, S.jsx)(TR, {
								data: c,
								actions: r,
								onChange: (e) => l({
									...c,
									followers: e
								})
							})]
						}),
						F && u === "instagram" && /* @__PURE__ */ (0, S.jsx)(SR, {
							data: c,
							filters: m
						}),
						(!F && ["overview", "instagram"].includes(u) || F && u === "instagram" && !!c.followers?.length) && /* @__PURE__ */ (0, S.jsx)(FR, {
							data: c,
							filters: m
						}),
						u === "integrations" && (F ? /* @__PURE__ */ (0, S.jsxs)("section", {
							className: "panel reports-panel",
							children: [
								/* @__PURE__ */ (0, S.jsx)("div", {
									className: "panel-heading",
									children: /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Arquivos importados" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Meta Ads e Hotmart · Mvave BR" })] })
								}),
								c.manualPeriods?.map((e) => /* @__PURE__ */ (0, S.jsxs)("article", { children: [/* @__PURE__ */ (0, S.jsxs)("h3", { children: [
									e.month,
									" · ",
									e.start,
									" a ",
									e.end
								] }), /* @__PURE__ */ (0, S.jsx)("ul", { children: e.sources.map((e) => /* @__PURE__ */ (0, S.jsxs)("li", { children: [
									e.name,
									" · ",
									e.rows,
									" registros"
								] }, e.name)) })] }, e.start)),
								/* @__PURE__ */ (0, S.jsx)("p", {
									className: "notice",
									children: "A Oficina do Violão ainda não tem dados nestes arquivos. Para novembro, recomendamos atualização semanal e conferência no fechamento do mês."
								})
							]
						}) : /* @__PURE__ */ (0, S.jsx)(qR, { data: c })),
						u === "settings" && /* @__PURE__ */ (0, S.jsxs)("section", {
							className: "panel settings-panel",
							children: [
								/* @__PURE__ */ (0, S.jsx)("h2", { children: "Configuração da operação" }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Organização" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: c.organization })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Fuso dos relatórios" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: "America/Sao_Paulo" })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Moedas" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: "Separadas, sem conversão automática" })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Controle de acesso" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: oe ? "Demonstração pública, sem dados reais" : F ? "Portal privado + pacote criptografado" : "Supabase Auth + MFA + RLS" })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Cadastro de usuários" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: "Somente por administrador" })] }),
								/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("span", { children: "Aparência" }), /* @__PURE__ */ (0, S.jsx)("strong", { children: "Escura · identidade Figueroa" })] }),
								/* @__PURE__ */ (0, S.jsx)("p", {
									className: "notice",
									children: F ? "Os relatórios são importados dos arquivos enviados. Seguidores são informados manualmente e salvos neste navegador." : "Contas, permissões e segredos são gerenciados no ambiente administrativo do Supabase e da hospedagem. Esta tela não recebe tokens."
								})
							]
						}),
						u === "reports" && /* @__PURE__ */ (0, S.jsxs)("section", {
							className: "panel reports-panel",
							id: "method",
							children: [/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "panel-heading",
								children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: "Relatório da operação" }), /* @__PURE__ */ (0, S.jsx)("p", { children: "Exporte os indicadores do recorte atual" })] }), /* @__PURE__ */ (0, S.jsxs)("button", {
									className: "button primary",
									onClick: () => JR(N, m, oe),
									children: [/* @__PURE__ */ (0, S.jsx)(AI, { size: 16 }), "Exportar CSV"]
								})]
							}), /* @__PURE__ */ (0, S.jsxs)("div", {
								className: "method-grid",
								children: [
									/* @__PURE__ */ (0, S.jsxs)("article", { children: [
										/* @__PURE__ */ (0, S.jsx)("span", { children: "01 / FINANCEIRO" }),
										/* @__PURE__ */ (0, S.jsx)("h3", { children: "A Hotmart confirma a receita." }),
										/* @__PURE__ */ (0, S.jsx)("p", { children: F ? "Bruto sem impostos e líquido vêm do export Hotmart na moeda de recebimento, pela data da transação. Apenas Completo e Aprovado entram na receita. Pendentes e reembolsos são contados conforme o status no export atualizado, pela data original da transação. A ferramenta da venda é mostrada quando informada. Referências de transação foram anonimizadas." : "O bruto usa o total pago, incluindo juros e tributos quando informados. Conta apenas pedidos APPROVED ou COMPLETE. Reembolsos e chargebacks são separados, pela data original de aprovação." })
									] }),
									/* @__PURE__ */ (0, S.jsxs)("article", { children: [
										/* @__PURE__ */ (0, S.jsx)("span", { children: "02 / EFICIÊNCIA" }),
										/* @__PURE__ */ (0, S.jsx)("h3", { children: "MER é uma visão da operação." }),
										/* @__PURE__ */ (0, S.jsx)("p", { children: "Receita bruta aprovada dividida pelo investimento. Pode incluir origens orgânicas. ROAS Meta usa somente o valor atribuído pela plataforma; ROAS Hotmart considera apenas vendas com mapeamento confiável." })
									] }),
									/* @__PURE__ */ (0, S.jsxs)("article", { children: [
										/* @__PURE__ */ (0, S.jsx)("span", { children: "03 / RESULTADO" }),
										/* @__PURE__ */ (0, S.jsx)("h3", { children: "Sem líquido, sem estimativa." }),
										/* @__PURE__ */ (0, S.jsx)("p", { children: "O líquido depende da comissão do participante da operação na mesma moeda. O resultado subtrai a mídia desse valor; não inclui honorários, tributos da empresa ou outros custos. Campos incompletos ficam indisponíveis." })
									] }),
									/* @__PURE__ */ (0, S.jsxs)("article", { children: [
										/* @__PURE__ */ (0, S.jsx)("span", { children: "04 / COMPARAÇÃO" }),
										/* @__PURE__ */ (0, S.jsx)("h3", { children: "Períodos do mesmo tamanho." }),
										/* @__PURE__ */ (0, S.jsxs)("p", { children: [
											"O comparativo usa os ",
											GL(m.start, m.end),
											" dias imediatamente anteriores. Base zero ou dado ausente não gera percentual. Totais em moedas distintas nunca são somados."
										] })
									] })
								]
							})]
						}),
						/* @__PURE__ */ (0, S.jsxs)("footer", {
							className: "dashboard-footer",
							children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [
								"MARKETING FIGUEROA ",
								/* @__PURE__ */ (0, S.jsx)("b", { children: "/" }),
								" ANALYTICS"
							] }), /* @__PURE__ */ (0, S.jsxs)("span", { children: [
								oe ? "Dados fictícios · apenas para demonstração" : "Dados privados · acesso restrito",
								" ",
								/* @__PURE__ */ (0, S.jsx)("span", {
									className: "footer-dot",
									children: "●"
								}),
								" America/Sao_Paulo"
							] })]
						})
					]
				})]
			})
		]
	});
}
var WR = {
	creatives: "Identifique os anúncios com melhor resultado no período.",
	tracking: "Confira a ligação entre vendas e anúncios.",
	instagram: "Acompanhe a evolução dos seguidores da operação.",
	meta: "Investimento e conversões atribuídas pela plataforma.",
	hotmart: "Vendas confirmadas, status e valores preservados.",
	campaigns: "Da campanha ao anúncio, com contexto para decidir.",
	products: "O desempenho de cada produto na operação.",
	reports: "Critérios claros. Relatórios que você pode conferir.",
	integrations: "Acompanhe a origem e a atualização dos dados.",
	settings: "Identidade, acesso e critérios da sua operação."
};
function GR({ title: e, value: t, change: n, detail: r, icon: i, featured: a = !1, inverse: o = !1, neutral: s = !1 }) {
	return /* @__PURE__ */ (0, S.jsxs)("article", {
		className: `kpi ${a ? "featured" : ""}`,
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "kpi-title",
				children: [/* @__PURE__ */ (0, S.jsx)("span", { children: e }), i]
			}),
			/* @__PURE__ */ (0, S.jsx)("strong", {
				className: "kpi-value",
				children: t
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "kpi-comparison",
				children: [n === null ? /* @__PURE__ */ (0, S.jsx)("span", {
					className: "delta neutral",
					children: "—"
				}) : /* @__PURE__ */ (0, S.jsxs)("span", {
					className: `delta ${s ? "neutral" : n !== null && (o ? n < 0 : n > 0) ? "positive" : "negative"}`,
					children: [
						n >= 0 ? /* @__PURE__ */ (0, S.jsx)(MI, { size: 13 }) : /* @__PURE__ */ (0, S.jsx)(OI, { size: 13 }),
						" ",
						zR(Math.abs(n), 1),
						"%"
					]
				}), /* @__PURE__ */ (0, S.jsx)("span", { children: n === null ? "Sem comparação disponível" : "vs. período anterior" })]
			}),
			/* @__PURE__ */ (0, S.jsx)("p", { children: r })
		]
	});
}
function KR({ insights: e, orders: t, mappings: n, currency: r, manual: i = !1 }) {
	let [a, o] = (0, b.useState)(""), [s, c] = (0, b.useState)("all"), [l, u] = (0, b.useState)(i ? "ad" : "campaign"), [d, f] = (0, b.useState)(null), [p, m] = (0, b.useState)(null), [h, g] = (0, b.useState)({
		key: "spend",
		direction: -1
	}), [_, v] = (0, b.useState)([
		"spend",
		"purchases",
		"cpa",
		"roas",
		"hotmart"
	]), [y, x] = (0, b.useState)(!1), C = {
		spend: "Investimento",
		purchases: "Compras Meta",
		cpa: "CPA Meta",
		roas: "ROAS Meta",
		hotmart: "Receita atribuída",
		clicks: "Cliques",
		ctr: "CTR"
	}, w = (0, b.useMemo)(() => {
		let r = /* @__PURE__ */ new Map();
		for (let t of e) {
			if (d && `${t.accountId}:${t.campaignId}` !== d || p && `${t.accountId}:${t.adsetId}` !== p) continue;
			let e = `${t.accountId}:${l === "campaign" ? t.campaignId : l === "adset" ? t.adsetId : t.adId}`, n = r.get(e) || [];
			n.push(t), r.set(e, n);
		}
		return [...r].map(([e, r]) => {
			let i = r[0], a = l === "campaign" ? i.campaign : l === "adset" ? i.adset : i.ad, o = QL(t.filter((e) => {
				let t = YL(e, n);
				return t && t.accountId === i.accountId && t.campaignId === i.campaignId && (l === "campaign" || t.adsetId === i.adsetId) && (l !== "ad" || t.adId === i.adId);
			}), r, n);
			return {
				id: e,
				name: a,
				status: r.some((e) => e.status === "ACTIVE") ? "ACTIVE" : r.some((e) => e.status === "PAUSED" || e.status === "CAMPAIGN_PAUSED" || e.status === "ADSET_PAUSED") ? "PAUSED" : "UNKNOWN",
				spend: o.spend,
				purchases: o.purchases,
				cpa: o.cpa,
				roas: o.metaRoas,
				hotmart: o.gross,
				clicks: o.clicks,
				ctr: o.ctr
			};
		}).filter((e) => e.name.toLocaleLowerCase("pt-BR").includes(a.toLocaleLowerCase("pt-BR")) && (s === "all" || e.status === s)).sort((e, t) => {
			let n = e[h.key], r = t[h.key];
			return n === null ? 1 : r === null ? -1 : (typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r))) * h.direction;
		});
	}, [
		e,
		t,
		n,
		d,
		p,
		l,
		a,
		s,
		h
	]);
	function T(e) {
		l === "campaign" ? (f(e), u("adset")) : l === "adset" && (m(e), u("ad"));
	}
	return /* @__PURE__ */ (0, S.jsxs)("section", {
		className: "panel campaign-panel",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "panel-heading",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("h2", { children: l === "campaign" ? "Desempenho das campanhas" : l === "adset" ? "Conjuntos de anúncios" : "Anúncios" }), /* @__PURE__ */ (0, S.jsx)("p", { children: l === "campaign" ? "Campanhas com movimentação no período" : i ? "Referências do XLSX · nomes de campanha e conjunto não exportados" : "Hierarquia da conta · recorte selecionado" })] }), /* @__PURE__ */ (0, S.jsxs)("button", {
					className: "button secondary small-button",
					onClick: () => x(!y),
					"aria-expanded": y,
					children: [/* @__PURE__ */ (0, S.jsx)(EL, { size: 14 }), "Colunas"]
				})]
			}),
			y && /* @__PURE__ */ (0, S.jsx)("div", {
				className: "column-options",
				children: Object.entries(C).map(([e, t]) => /* @__PURE__ */ (0, S.jsxs)("label", { children: [/* @__PURE__ */ (0, S.jsx)("input", {
					type: "checkbox",
					checked: _.includes(e),
					onChange: () => v(_.includes(e) ? _.filter((t) => t !== e) : [..._, e])
				}), t] }, e))
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "table-toolbar",
				children: [
					/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "search-field",
						children: [/* @__PURE__ */ (0, S.jsx)(gL, { size: 15 }), /* @__PURE__ */ (0, S.jsx)("input", {
							"aria-label": "Pesquisar campanhas, conjuntos ou anúncios",
							placeholder: "Buscar por nome…",
							value: a,
							onChange: (e) => o(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, S.jsx)("div", {
						className: "status-tabs",
						children: [
							["all", "Todas"],
							["ACTIVE", "Ativas"],
							["PAUSED", "Pausadas"]
						].map(([e, t]) => /* @__PURE__ */ (0, S.jsx)("button", {
							onClick: () => c(e),
							className: s === e ? "selected" : "",
							children: t
						}, e))
					}),
					!i && l !== "campaign" && /* @__PURE__ */ (0, S.jsx)("button", {
						className: "text-button",
						onClick: () => {
							f(null), m(null), u("campaign");
						},
						children: "← Campanhas"
					})
				]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "table-scroll",
				children: [/* @__PURE__ */ (0, S.jsxs)("table", { children: [/* @__PURE__ */ (0, S.jsx)("thead", { children: /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, S.jsx)("th", { children: /* @__PURE__ */ (0, S.jsxs)("button", {
						onClick: () => g({
							key: "name",
							direction: h.direction * -1
						}),
						children: [l === "campaign" ? "Campanha" : l === "adset" ? "Conjunto" : "Anúncio", " ↕"]
					}) }),
					/* @__PURE__ */ (0, S.jsx)("th", { children: "Status" }),
					_.map((e) => /* @__PURE__ */ (0, S.jsx)("th", {
						"aria-sort": h.key === e ? h.direction === 1 ? "ascending" : "descending" : "none",
						children: /* @__PURE__ */ (0, S.jsxs)("button", {
							onClick: () => g({
								key: e,
								direction: h.key === e ? h.direction * -1 : -1
							}),
							children: [
								C[e],
								" ",
								h.key === e ? h.direction === 1 ? "↑" : "↓" : "↕"
							]
						})
					}, e))
				] }) }), /* @__PURE__ */ (0, S.jsx)("tbody", { children: w.map((e) => /* @__PURE__ */ (0, S.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, S.jsx)("td", { children: /* @__PURE__ */ (0, S.jsxs)("button", {
						className: "campaign-name",
						onClick: () => T(e.id),
						disabled: l === "ad",
						children: [
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "campaign-icon",
								children: /* @__PURE__ */ (0, S.jsx)(nL, { size: 14 })
							}),
							/* @__PURE__ */ (0, S.jsxs)("span", { children: [e.name, /* @__PURE__ */ (0, S.jsx)("small", { children: i ? "Referência do anúncio no export" : e.id })] }),
							l !== "ad" && /* @__PURE__ */ (0, S.jsx)(KI, { size: 13 })
						]
					}) }),
					/* @__PURE__ */ (0, S.jsx)("td", { children: /* @__PURE__ */ (0, S.jsxs)("span", {
						className: `status-pill ${e.status === "ACTIVE" ? "active" : ""}`,
						children: [/* @__PURE__ */ (0, S.jsx)("i", {}), e.status === "ACTIVE" ? "Ativa" : e.status === "PAUSED" ? "Pausada" : "Não informado"]
					}) }),
					_.map((t) => {
						let n = e[t];
						return /* @__PURE__ */ (0, S.jsx)("td", {
							className: t === "roas" ? "roas-cell" : "",
							children: [
								"spend",
								"cpa",
								"hotmart"
							].includes(t) ? HL(n, r) : t === "roas" ? BR(n) : t === "ctr" ? n === null ? "—" : zR(n) + "%" : VR(n)
						}, t);
					})
				] }, e.id)) })] }), !w.length && /* @__PURE__ */ (0, S.jsx)("p", {
					className: "empty-copy",
					children: "Nenhum resultado para estes filtros."
				})]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "table-footer",
				children: [/* @__PURE__ */ (0, S.jsxs)("span", { children: [
					w.length,
					" ",
					l === "campaign" ? "campanhas" : l === "adset" ? "conjuntos" : "anúncios",
					" no recorte"
				] }), /* @__PURE__ */ (0, S.jsx)("span", { children: "Meta e Hotmart têm critérios de atribuição diferentes." })]
			})
		]
	});
}
function qR({ data: e }) {
	return /* @__PURE__ */ (0, S.jsx)("div", {
		className: "integration-grid",
		children: e.sync.map((t) => /* @__PURE__ */ (0, S.jsxs)("section", {
			className: "panel integration-card",
			children: [
				/* @__PURE__ */ (0, S.jsx)("div", {
					className: `provider-icon ${t.provider}`,
					children: t.provider === "meta" ? /* @__PURE__ */ (0, S.jsx)(AL, { size: 27 }) : t.provider === "instagram" ? /* @__PURE__ */ (0, S.jsx)(RI, { size: 27 }) : /* @__PURE__ */ (0, S.jsx)(QI, { size: 27 })
				}),
				/* @__PURE__ */ (0, S.jsx)("span", {
					className: "eyebrow",
					children: t.provider === "meta" ? "MÍDIA PAGA" : t.provider === "instagram" ? "AUDIÊNCIA" : "FONTE FINANCEIRA"
				}),
				/* @__PURE__ */ (0, S.jsx)("h2", { children: t.provider === "meta" ? "Meta Ads" : t.provider === "instagram" ? "Instagram" : "Hotmart" }),
				/* @__PURE__ */ (0, S.jsx)("p", { children: t.provider === "meta" ? "Leitura pela API oficial de marketing. Sem acesso à sua sessão pessoal do Facebook." : t.provider === "instagram" ? "Coleta autorizada da contagem atual de seguidores. Histórico a partir da primeira coleta." : "Webhooks de compras e conciliação periódica pela API oficial." }),
				/* @__PURE__ */ (0, S.jsx)("div", {
					className: "integration-status",
					children: /* @__PURE__ */ (0, S.jsxs)("span", {
						className: `status-pill ${t.status === "success" ? "active" : ""}`,
						children: [/* @__PURE__ */ (0, S.jsx)("i", {}), e.mode === "demo" ? "Não conectada" : t.status === "pending" ? "Aguardando configuração" : t.status === "running" ? "Sincronizando" : t.status === "error" ? "Falha de sincronização" : "Último lote concluído"]
					})
				}),
				/* @__PURE__ */ (0, S.jsxs)("dl", { children: [
					t.provider === "hotmart" && /* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Último webhook processado" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: t.lastEvent ? HR(t.lastEvent) : "Nenhum evento" })] }),
					/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Último lote concluído" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: t.lastSuccess ? HR(t.lastSuccess) : "Nenhuma sincronização" })] }),
					/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Atualização prevista" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: t.provider === "meta" ? "Lotes a cada 5 minutos" : t.provider === "instagram" ? "A cada hora" : "Webhooks + conferência agendada" })] }),
					/* @__PURE__ */ (0, S.jsxs)("div", { children: [/* @__PURE__ */ (0, S.jsx)("dt", { children: "Permissão" }), /* @__PURE__ */ (0, S.jsx)("dd", { children: t.provider === "meta" ? "Leitura · ads_read" : t.provider === "instagram" ? "Leitura de conta profissional" : "Eventos + leitura de vendas" })] })
				] }),
				t.message && /* @__PURE__ */ (0, S.jsx)("p", {
					className: "notice",
					children: t.message
				}),
				/* @__PURE__ */ (0, S.jsxs)("details", { children: [
					/* @__PURE__ */ (0, S.jsxs)("summary", { children: ["Como ativar esta integração ", /* @__PURE__ */ (0, S.jsx)(WI, { size: 15 })] }),
					/* @__PURE__ */ (0, S.jsx)("p", { children: t.provider === "meta" ? "O administrador configura um token de integração de um usuário de sistema autorizado, o ID da conta e a versão da API nos segredos do servidor. A sessão pessoal do Facebook não é utilizada." : t.provider === "instagram" ? "O administrador informa o ID da conta profissional vinculada a uma Página e configura o token autorizado de leitura nos segredos do servidor. O gráfico não inventa histórico anterior à conexão." : "O administrador configura as credenciais da API e o Hottok nos segredos do servidor, cadastra o endpoint HTTPS /api/webhooks/hotmart e valida uma compra de teste." }),
					/* @__PURE__ */ (0, S.jsx)("p", { children: "Depois, execute as migrations e ative os agendamentos documentados em analytics/README.md." })
				] })
			]
		}, t.provider))
	});
}
function JR(e, t, n) {
	let r = dR(e, t, n), i = URL.createObjectURL(new Blob([r], { type: "text/csv;charset=utf-8;" })), a = document.createElement("a");
	a.href = i, a.download = `figueroa-${n ? "demo-" : ""}${t.start}-${t.end}.csv`, a.click(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
// analytics/manual/crypto.ts
var YR = (e) => Uint8Array.from(atob(e), (e) => e.charCodeAt(0)), XR = (e) => btoa(Array.from(e, (e) => String.fromCharCode(e)).join(""));
async function ZR(e, t, n) {
	let r = await crypto.subtle.importKey("raw", new TextEncoder().encode(e), "PBKDF2", !1, ["deriveKey"]);
	return crypto.subtle.deriveKey({
		name: "PBKDF2",
		salt: t,
		iterations: n,
		hash: "SHA-256"
	}, r, {
		name: "AES-GCM",
		length: 256
	}, !1, ["encrypt", "decrypt"]);
}
async function QR(e, t) {
	if (e.version !== 1 || e.kdf !== "PBKDF2-SHA256" || e.iterations !== 6e5) throw Error("INVALID_ENVELOPE");
	let n = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv: YR(e.iv)
	}, await ZR(t, YR(e.salt), e.iterations), YR(e.data));
	return JSON.parse(new TextDecoder().decode(n));
}
async function $R(e, t) {
	let n = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), r = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12)), i = await crypto.subtle.encrypt({
		name: "AES-GCM",
		iv: r
	}, await ZR(t, n, 6e5), new TextEncoder().encode(JSON.stringify(e)));
	return {
		version: 1,
		kdf: "PBKDF2-SHA256",
		iterations: 6e5,
		salt: XR(n),
		iv: XR(r),
		data: XR(new Uint8Array(i))
	};
}
// analytics/manual/entry.tsx
var ez = (e) => document.getElementById(e), tz = "figueroa-analytics-followers-v1", nz = (0, x.createRoot)(ez("dashboard")), rz;
function iz(e) {
	let t = e;
	if (t?.type !== "figueroa-manual-followers-v1" || !Array.isArray(t.followers) || t.followers.length > 1e4) throw Error("INVALID_FOLLOWERS");
	let n = /* @__PURE__ */ new Set();
	for (let e of t.followers) {
		if (!/^[a-z0-9._]{1,30}$/.test(e.username) || e.accountId !== "manual-instagram-" + e.username || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !Number.isFinite(Date.parse(e.date)) || !Number.isSafeInteger(e.followers) || e.followers < 0 || !Number.isFinite(Date.parse(e.observedAt))) throw Error("INVALID_FOLLOWERS");
		let t = e.accountId + e.date;
		if (n.has(t)) throw Error("DUPLICATE_FOLLOWERS");
		n.add(t);
	}
	return t.followers;
}
async function az(e) {
	if (iR()?.role !== "master") throw Error("SESSION");
	let t = await fetch(new URL("assets/reports/manual-analytics.enc.json", document.baseURI), { cache: "no-store" });
	if (!t.ok) throw Error("NETWORK");
	let n = await QR(await t.json(), e);
	if (n.dataset?.mode !== "manual" || !n.dataset.manualPeriods?.length) throw Error("INVALID_REPORT");
	let r = n.dataset, i = localStorage.getItem(tz), a = "";
	if (i) try {
		r.followers = iz(await QR(JSON.parse(i), e));
	} catch {
		a = "O relatório foi aberto, mas os registros locais de seguidores não puderam ser lidos. Restaure sua cópia de registros na aba Instagram. Salvar novos registros substituirá a cópia local.";
	}
	sessionStorage.removeItem("figueroa-analytics-key-v1");
	let o = () => {
		if (iR()?.role !== "master") throw aR(), Error("SESSION");
	}, s = async (t) => {
		o();
		let n = await $R({
			type: "figueroa-manual-followers-v1",
			followers: t
		}, e);
		o(), localStorage.setItem(tz, JSON.stringify(n)), r.followers = t;
	}, c = async () => {
		o();
		let t = await $R({
			type: "figueroa-manual-followers-v1",
			followers: r.followers ?? []
		}, e), n = URL.createObjectURL(new Blob([JSON.stringify(t)], { type: "application/json" })), i = document.createElement("a");
		i.href = n, i.download = "analytics-seguidores.enc.json", i.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
	}, l = async (t) => {
		if (o(), t.size > 5e6) throw Error("FILE_SIZE");
		return iz(await QR(JSON.parse(await t.text()), e));
	}, u = r.manualPeriods;
	nz.render(/* @__PURE__ */ (0, S.jsx)(UR, {
		initialData: r,
		initialStart: u[0].start,
		initialEnd: u.at(-1).end,
		manualActions: {
			save: s,
			download: c,
			restore: l
		},
		manualNotice: a
	})), ez("access-gate").hidden = !0, ez("dashboard").hidden = !1;
}
async function oz(e) {
	if (e.role !== "master") throw Error("ROLE");
	e.analyticsKey ? (clearTimeout(rz), rz = setTimeout(() => {
		nz.unmount(), aR();
	}, Math.max(0, e.expires - Date.now())), await az(e.analyticsKey)) : (ez("access-gate").hidden = !1, document.querySelector("[data-login-feedback]").textContent = "Entre novamente com sua senha para abrir o Analytics.");
}
lR(oz, { requiredRole: "master" });
var sz = iR();
sz && oz(sz).catch(() => {
	ez("access-gate").hidden = !1, document.querySelector("[data-login-feedback]").textContent = "Não foi possível carregar o relatório. Confira a conexão e tente entrar novamente.";
}), window.addEventListener("pageshow", () => {
	!ez("dashboard").hidden && !iR() && (nz.unmount(), aR());
});
