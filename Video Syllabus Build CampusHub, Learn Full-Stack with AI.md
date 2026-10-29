# Video Syllabus: Build CampusHub, Learn Full-Stack with AI

1-hour videos | MERN fundamentals | API-first | No DSA

## How this course works

**One project, video by video.** Everyone builds CampusHub, a campus hub where students discover events and clubs, register, and get reminders, while club admins publish and manage them. It grows with the course, **back end first**: JavaScript you run in the terminal (Module 2), a REST API with a written contract (Module 3), a MongoDB-backed API with login, roles and real-time seats (Module 4), the web pages that will show it (Module 5), a browser client that talks to the real API (Module 6), a React front end on that same API (Module 7), a tested, secured, live deployment (Module 8), and a capstone extension each student makes their own (Module 9). No module stands alone: each ends with a bridge video that deliberately exposes the pain the next module solves.

**API-driven development.** The API is designed before it is built and built before any screen uses it. Every resource starts as a contract: an OpenAPI document plus a Postman collection with example requests and expected responses. The contract is reviewed, then implemented, then proven by automated tests and by running the collection from the Postman CLI. By the time students write their first HTML form, every endpoint it will call already exists, is documented, and is tested. The front end is a client of a working API, not the other way round.

**Every video has the same shape**, so beginners always know where they are: a 5-minute recap and hook; a \~25-minute concept lesson covering what it is, syntax, when to use it, when not to, and common mistakes (slides or animation first, then small throwaway examples in VS Code); a \~20-minute CampusHub checkpoint where the concept is applied to the real project; a 5-minute AI ritual and quiz; and a 2-minute homework brief.

**AI ladder.** Level 1: explain-only (Modules 1-2). Level 2: hints and review (Modules 3-4). Level 3: generate, then verify (Modules 5-7). Level 4: spec-driven, small reviewed tasks (Modules 8-9). Every module ends with an AI-off checkpoint. Four standing rules: predict before you run, ask AI to explain and not just write, type it yourself, teach it back.

**Scope.** DSA is excluded. Programming logic is taught only as far as building features requires. A follow-up AI course (LLM APIs, RAG, agents) will extend this same app. The video count is not fixed: a topic gets a second video when students need it.

## Module 1: Foundations, Tools and Learning with AI (Videos 1-7)

### Video 1: Welcome, the Roadmap and the Learning Contract

Opens with a 60-second demo of the finished CampusHub, then a slide walkthrough of the course map, from the API to the interface, so students see where they are heading and why the back end comes first. The core of the video is the learning contract: watch, pause, predict, type, never paste. In VS Code you ask an AI the same question two ways, "write this for me" versus "explain this and give me a hint", and compare what each leaves in your head. Covers when AI helps learning and when it quietly replaces it. Homework: a README with each student's goal and the four rules.

### Video 2: How the Internet Works

An animated motion graphic follows one request from the browser through DNS to a server and back, covering IP addresses, HTTP request and response, methods, headers, JSON bodies, status codes, and the difference between static files and a running server. Then you open Chrome DevTools, go to the Network tab, and inspect a real site's API calls side by side with the animation, and repeat one of them in Postman. Project step: sketch CampusHub's resources (events, clubs, users, registrations) and who talks to whom. AI ritual: ask AI to explain DNS simply, then verify one claim in DevTools.

### Video 3: Setting Up Your Dev Machine

Full handholding, screen by screen, on Windows, macOS, and Linux. Install VS Code, Node.js (LTS), Git, Postman and the Postman CLI, and Docker Desktop; set up Prettier and ESLint. Then a gentle terminal lesson: pwd, ls, cd, mkdir, touch, and what a PATH is. Deliberately trigger the three most common errors (command not found, wrong folder, permission denied) and show how to read them. When to use the terminal and when a GUI is fine. AI ritual: paste an error and ask for the cause, not the fix.

### Video 4: Git and GitHub from Zero

An animated slide explains the mental model: working folder, staging area, commit history, remote. Then the terminal: git init, status, add, commit, log, diff, branch, push, plus .gitignore. Covers when to commit (small, meaningful steps), when not to (secrets, node\_modules, giant files), and writing useful commit messages. Project step: create the CampusHub repository with a README and make the first push. Students also learn to recover from the classic mistake of committing the wrong file. AI ritual: never run a git command you cannot explain.

### Video 5: Thinking Like a Programmer

Mostly whiteboard and slides, with light code. Teaches decomposition and pseudocode first, then translates to JavaScript run with node in the terminal: variables, data types, conditions, and loops, with the question "should this student see this event?" as the running example. Covers when a for loop fits and when a while loop does, and why you plan before you type. Project step: write pseudocode for registering for an event, including a full-capacity case. AI ritual: have AI critique your pseudocode, then test it with edge cases like zero, negative, and empty.

### Video 6: Functions, Debugging and Reading Errors

Introduces functions (parameters, return values, arrow function preview) and when a function is worth extracting versus over-abstracting. The second half is a debugging clinic: console.log, the VS Code debugger with breakpoints on a Node script, and reading a stack trace line by line. You break the same function five different ways on purpose. Project step: write helpers such as formatDate and isEventFull in a scratch file, with hand-written test cases. AI ritual: the debugging protocol of reproduce, hypothesize, test, and only then ask AI.

### Video 7: How LLMs Work and Using AI Responsibly

Slides and live demos cover tokens, context windows, hallucination, and temperature at a conceptual level. You catch an AI inventing a function that does not exist, then show how to verify claims against MDN and official docs. Teaches prompt anatomy (context, task, constraints, format) and a five-point verification checklist. Covers privacy, never pasting secrets, and academic integrity. Project step: add an AI\_LOG.md to the repo. Ends with the Module 1 AI-off checkpoint. Bridge: we have a repo and a plan, so next we learn the language the whole stack speaks.

## Module 2: JavaScript and Node.js in the Terminal (Videos 8-17)

Every example in this module runs with node, not in a browser. Students learn the language without the DOM in the way, and everything they write here moves straight into the server in Module 3.

### Video 8: JavaScript Basics Done Properly

A deeper pass over variables and types than Module 1: let versus const (and why not var), primitives, typeof, null versus undefined, template literals, == versus ===, truthy and falsy. Shows the type coercion traps that bite beginners and when each is safe to rely on, with extra attention to strings that arrive from a request and look like numbers. Project step: a CampusHub data module of events as constants. AI ritual: ask AI for tricky coercion examples and predict every output before running.

### Video 9: Control Flow and Functions in Depth

Covers if/else, switch, ternary, for and for...of, then function declarations, expressions, arrows, default parameters, and the idea of pure versus impure functions. Teaches when an arrow function is the right choice, when a nested ternary is a bad idea, and how to read code by tracing it. Project step: the registration eligibility logic (capacity, deadline, duplicate check) as pure functions the API will reuse. AI ritual: write console.assert tests for it.

### Video 10: Arrays and Array Methods

Covers array basics, then map, filter, find, some, every, reduce, and sort with a comparator, always with the mutating versus non-mutating distinction. Teaches when map beats forEach and a loop, and when reduce hurts readability. Project step: transform the events array to list upcoming events, search by title, sort by date, and group by category: exactly the queries the events endpoint will answer. AI ritual: refactor a loop into array methods and confirm the output is identical.

### Video 11: Objects, Destructuring, Spread and JSON

Covers object literals, dot versus bracket access, methods, Object.keys and entries, destructuring, spread and rest, optional chaining, nullish coalescing, and JSON.parse and stringify. Includes the shallow-versus-deep copy trap with a live bug. Project step: model events, users, clubs, and registrations as objects and write the events.json file the first API will serve. AI ritual: have AI find mutation bugs in a sample.

### Video 12: Scope, Closures and Execution Context

An animated call stack and scope chain makes hoisting, the temporal dead zone, and closures visible. Covers when closures are useful (factories, middleware, private state) and their classic pitfalls in loops. Project step: a registration counter factory and a tiny function that returns a configured logger, the same shape Express middleware will have. AI ritual: teach-back, where students explain a closure to the AI and ask where their explanation is wrong.

### Video 13: Modules, Error Handling and Clean Code

Covers ES modules (named versus default exports), try/catch/finally, throwing Errors, custom error types, and defensive input checks. Teaches when to throw versus return a value and why swallowing errors is dangerous. Also naming and small functions. Project step: split CampusHub utilities into modules and add a validation module and an error class with a status code. AI ritual: a code review with AI using a written checklist.

### Video 14: Asynchronous JavaScript: Event Loop, Callbacks and Promises

An animation shows the call stack, task queue, and microtask queue in action. Covers setTimeout, callbacks and callback hell, Promise states, then, catch, finally, and Promise.all, allSettled, and race, with guidance on when to run work in parallel. Explains why a server must never block the event loop. Project step: a fake slow data source for CampusHub that returns promises. AI ritual: predict the output order of an async snippet before running it.

### Video 15: async/await, Fetch and Real Data

Covers async/await syntax, try/catch with await, and fetch from Node for GET and POST, response.ok, status codes, headers, and JSON parsing, calling a real public API. Teaches when to await sequentially versus in parallel and the common mistake of ignoring failed responses. Project step: a script that calls a public API, handles every failure, and saves the result as JSON. AI ritual: ask AI to review your error handling and decide which suggestions are valid.

### Video 16: Node.js, npm and Packages

Explains what Node is and how it differs from the browser (no DOM, with process and file access), using a short REPL session. Covers package.json, scripts, semantic versioning, dependencies versus devDependencies, node\_modules, and the lockfile. Teaches when to add a package and when to write the code yourself, including supply-chain risk and how to vet a package and pin its version. Project step: initialize the server folder in the CampusHub repo and move the Module 2 code into it.

### Video 17: Node Core Modules, Streams and Module 2 Checkpoint

Covers fs/promises, path, os, and EventEmitter, a first look at streams (reading a large file without loading it all), and CommonJS versus ES modules in Node. Teaches when sync versus async file APIs are appropriate. Project step: a seed script that reads events.json and writes a summary report. Ends with a 20-minute AI-off challenge: a command-line tool that answers three questions about the events data. Bridge: only the person at this terminal can ask our data anything, so next we put it behind an API anyone can call.

## Module 3: API-First Backend with Express (Videos 18-27)

### Video 18: Your First Server and Express Basics

Starts with the raw http module so students see what Express removes, then moves to app.get, req, res, res.json, res.status, node --watch, and ports. Test every route in Postman and save the requests into a CampusHub collection from day one. Project step: GET /api/health and GET /api/events returning data from the JSON file. Teaches when Express is enough and when a heavier framework might be considered.

### Video 19: REST API Design and the API Contract

Slides and a whiteboard cover resources, noun-based URLs, HTTP methods, status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500), idempotency, pagination and filter parameters, one error shape, and versioning under /api/v1. Teaches when REST fits and when something else might. Project step: write the CampusHub API contract as an OpenAPI document before any more code: every endpoint, request, response, error, and who may call it. AI helps draft it; you review and defend every line.

### Video 20: Contract-First with Postman: Collections, Examples and Mocks

Import the OpenAPI document into Postman, generate the collection, add example responses, and run a mock server so the API can be "used" before it exists. Write Postman tests (status, shape, headers) for each request and run the whole collection from the Postman CLI in the terminal. Teaches why the contract is the source of truth and how a failing collection run tells you exactly what is not built yet. Project step: a collection that is all red today and will turn green endpoint by endpoint.

### Video 21: Routing, Controllers and Project Structure

Covers express.Router, route params, query strings, request bodies, express.json, and the routes, controllers, and services split. Teaches when to split files and when a flat structure is fine. Project step: events CRUD on an in-memory array with filtering, search, sorting, and pagination by query string, matching the contract, with the Postman collection turning green. AI ritual: have AI propose a folder structure and compare it to yours.

### Video 22: Middleware: The Heart of Express

An animation shows the request moving through the middleware chain and why order matters. Covers next(), built-in and third-party middleware (cors, morgan, helmet), custom middleware, and the four-argument error handler. Teaches when logic belongs in middleware versus a controller. Project step: request logger, CORS reserved for the future web client, and a 404 handler that returns the contract's error shape.

### Video 23: Validation and Centralized Error Handling

Validate request bodies, params, and queries with a schema library such as Zod, create a custom ApiError, handle async errors consistently, and return one error shape everywhere. Covers why server validation is always required, because any client (including one you have not built yet) can send anything, and why stack traces never reach clients. Project step: validation on events and registrations, with 422 responses that name each bad field. AI ritual: ask AI to write malicious request bodies and add them to the Postman collection as tests.

### Video 24: Environment Variables, Config and Secrets

Covers dotenv, process.env, .env.example, a central config module that validates settings at startup, and the difference between server and client variables (nothing secret ever ships to a browser). Shows how a leaked secret in Git history is handled: rotate first, clean later. Project step: config for PORT, NODE\_ENV, and future database and JWT secrets, Postman environments for local and production, plus a repo scan for accidental secrets.

### Video 25: Testing and Documenting APIs

Covers automated tests with Vitest and Supertest next to the Postman collection, and what each is best at. Teaches what to test at the API level and what a test pyramid looks like for a backend. Serves the OpenAPI document as browsable docs and checks that responses still match it. Project step: a Supertest suite for the events routes, the collection run by the Postman CLI in one npm script, and an API section in the README. AI ritual: generate tests with AI and mutate the code to verify they catch bugs.

### Video 26: Authentication: Hashing, Sessions and JWT

Slides and animation separate authentication from authorization and show why plain-text passwords are never acceptable. Covers bcrypt hashing and salting, sessions with cookies versus JWT, short-lived access tokens and rotating refresh tokens, httpOnly cookies, and the basics of XSS and CSRF. Teaches when JWT fits and when sessions are simpler. Project step: register, login, refresh, and logout endpoints with in-memory users, added to the contract first, then tested in Postman with its cookie jar.

### Video 27: Authorization, RBAC, Rate Limiting and Module 3 Checkpoint

Covers auth middleware that verifies tokens, roles (student, club admin, admin), the difference between 401 and 403, ownership checks, and rate limiting with helmet for basic hardening. Project step: protect create, update, and delete event routes by role and ownership, with Postman tests for each role. Ends with the AI-off checkpoint: add one protected route from scratch, contract first. Bridge: users and events vanish when the server restarts, so next we give the API a real database.

## Module 4: MongoDB and a Production-Shaped API (Videos 28-36)

### Video 28: Databases and MongoDB Fundamentals

Explains why apps need databases and compares SQL and MongoDB honestly, including when MongoDB fits and when it does not. Covers documents, collections, BSON, and ObjectId. Run MongoDB Atlas Local in Docker for development and create an Atlas free cluster for later, connect with Compass, then use mongosh for insert, find, update, and delete with operators like $gt, $in, and $set. Project step: create the CampusHub database and seed events manually.

### Video 29: Mongoose: Schemas, Models and Validation

Covers connecting with Mongoose, schema types, required, min, enum, defaults, timestamps, custom validators, and model CRUD, plus lean and the find versus findById distinction. Teaches why schema validation and API validation are both needed. Project step: Event and User models, and the controllers switched from the in-memory array to MongoDB, with the Postman collection proving nothing in the contract changed.

### Video 30: Data Modeling: Embedding vs Referencing

A whiteboard session teaches that access patterns drive design, so the contract's endpoints decide the schema. Covers one-to-few embedding, one-to-many references, many-to-many through a registrations collection, denormalization trade-offs, and document size. Project step: model Club, Event with a club reference, and Registration with a unique compound index. AI ritual: ask AI for alternative schemas and trade-offs, then make and defend your own choice.

### Video 31: Relations in Practice: populate and Aggregation

Covers populate, field selection, filters, and an introduction to aggregation with $match, $group, $sort, and $lookup. Teaches when populate is enough and when aggregation is better, and how to spot N+1 query problems. Project step: event details with club info, a My Registrations endpoint, and an admin stats endpoint of registrations per category and per event.

### Video 32: Indexes, Pagination, Sorting and Search

Covers single, compound, unique, and text indexes, explain output, and the cost of over-indexing. Compares skip and limit pagination with cursor-based pagination and when each is appropriate. Project step: a paginated, sortable, filterable, searchable events endpoint with indexes for the hot queries, verified with explain and timed in Postman.

### Video 33: Persistent Auth and Safe Registrations

Swap the in-memory users for Mongoose, enforce a unique email index, keep password hashing in one place, and store only a hash of each refresh token so a leaked database cannot be replayed. Then the hardest write in the app: registering for an event with an atomic findOneAndUpdate and $inc, so two students can never take the last seat. Project step: auth and registrations on MongoDB, with a test that fires concurrent registrations at a nearly full event.

### Video 34: File Uploads and Real-Time Basics

Covers multer for uploads, file type and size validation, and why files are stored in object storage rather than in the database. Introduces cloud storage options and the risks of unsafe uploads. Adds Socket.IO to the server: each event is a room, and every registration change broadcasts the new seats-left count, with a clear comparison of when WebSockets are worth it versus polling. Project step: the poster upload endpoint and the seats channel, tested with a small Node socket client.

### Video 35: Caching, Background Jobs and Data Protection

Covers HTTP caching headers, in-memory caching, a Redis overview, and the stale-data bugs caching can cause. Introduces background jobs with a scheduled reminder email (node-cron and a test inbox). Covers database user permissions, Atlas network access, least privilege, and never returning fields like password hashes. Project step: a reminder job and response shaping.

### Video 36: CampusHub API v1 and Module 4 Checkpoint

Integration day: a seed script with demo users for every role, the full Postman collection green from the CLI, the Supertest suite green against an in-memory MongoDB, and AI-assisted review of schemas and slow queries, with every AI claim verified against real explain output. Ends with a 30-minute AI-off challenge: add one field through the contract, model, validation, and tests. Bridge: the API is complete, documented, and tested, but only developers with Postman can use it, so next it gets a face.

## Module 5: Web UI with HTML, CSS and the Browser (Videos 37-47)

### Video 37: HTML Essentials and Semantic Structure

Built live in VS Code with Live Server and the browser's Elements panel open. Covers the document skeleton, headings, links, images, and lists, then the semantic elements (header, nav, main, section, article, footer) and when each beats a plain div. Shows what "div soup" looks like and why screen readers and search engines care. Project step: the CampusHub home and event pages, shaped by the fields the API already returns. AI ritual: ask AI to generate a skeleton, compare it against yours, and mark anything non-semantic.

### Video 38: Forms, Inputs and Native Validation

Teaches form, label, and the main input types (text, email, date, number, select, textarea, checkbox, radio), with name versus id and GET versus POST demonstrated in the URL bar. Native validation (required, pattern, min, max) is shown working, then bypassed by editing the DOM, and the request still hits the API you built in Module 3, which answers 422. That is the proof that client validation is for comfort and server validation is for safety. Project step: the login, sign-up, and event forms, matching the contract's fields.

### Video 39: Accessibility from Day One

Starts with a screen reader demo that makes beginners feel the difference between good and bad markup. Covers alt text, labels, heading order, landmarks, keyboard navigation, focus, color contrast, and ARIA as a last resort, not a patch for bad HTML. Run Lighthouse and the browser's accessibility tree on CampusHub and fix what it finds. AI ritual: ask AI to review accessibility, then confirm with real tools, because AI misses things.

### Video 40: CSS Fundamentals: Selectors, Cascade and Specificity

An animated graphic shows how the browser decides which rule wins: origin, specificity, order. Covers element, class, id, descendant, and pseudo-class selectors, inheritance, rem versus px, color, and typography. Teaches when to use classes, why ids are for anchors, and why !important is a last resort. Project step: a base theme using CSS variables. AI ritual: solve a specificity puzzle yourself first, then ask AI to check.

### Video 41: The Box Model and Layout Basics

Visual and hands-on, with DevTools' box model inspector on screen. Covers content, padding, border, margin, box-sizing: border-box, margin collapse, display (block, inline, inline-block), and positioning (relative, absolute, sticky), including the situations where absolute positioning is the wrong tool. Project step: style the event card and add a sticky header. AI ritual: ask AI why an element overflows, then prove it in DevTools.

### Video 42: Flexbox

A motion graphic shows the main and cross axes so justify-content and align-items finally make sense. Covers direction, wrap, gap, grow, shrink, and basis. Teaches when flexbox is the right choice (one-dimensional layouts such as navbars and card rows) and when it is not. Project step: the navbar and a row of event cards. Students end with a short flexbox practice game to build muscle memory.

### Video 43: CSS Grid and Choosing Between Grid and Flexbox

Covers grid-template-columns, fr units, repeat, auto-fit with minmax, named areas, and gap. The centerpiece is a simple decision framework for grid versus flexbox, applied to three real layouts. Project step: the events gallery grid and a dashboard layout page. AI ritual: ask AI for both a grid and a flexbox version of the same layout and argue which is better and why.

### Video 44: Responsive Design, Mobile-First

Explains the viewport meta tag, mobile-first thinking, media queries, responsive images, and clamp(). Teaches when media queries are needed and when intrinsic layouts (auto-fit, flex-wrap) avoid them entirely. Use device mode to test phone, tablet, and desktop. Project step: make the CampusHub pages fully responsive with a CSS-only mobile menu. AI ritual: ask AI to review your CSS for fixed widths that will break small screens.

### Video 45: Tailwind CSS: Utility-First Styling

Shows what Tailwind is, why teams use it, and how to install it. Covers spacing and color scales, responsive prefixes, hover and focus states, and dark mode. Honest section on when Tailwind is a poor fit (tiny sites, unreadable class piles, team conventions) and how to keep it tidy. Project step: rebuild the header and event card in Tailwind. AI ritual: AI is fast at Tailwind classes and often subtly wrong, so verify visually and for accessibility.

### Video 46: Design-to-Code with AI

Take a reference design for the CampusHub log-in and events pages and build it step by step with AI. The workflow: describe the layout, build section by section, review the output for semantic HTML, accessibility, and responsiveness, then fix visual bugs with DevTools. Includes a reusable "AI generates, you review" checklist and a discussion of when hand-coding is faster. Project step: the log-in split screen and the events gallery.

### Video 47: Polish, Performance and Module 5 Checkpoint

Covers transitions, transforms, simple keyframe animation, and prefers-reduced-motion, with a clear answer on when not to animate. Then image optimization, lazy loading, favicon, and meta tags, followed by testing in Chrome, Firefox, and Safari and a Lighthouse target score. Ends with a timed AI-off challenge: build a responsive page from a screenshot. Bridge: the pages look finished but show hard-coded events while the real API sits idle, so next we connect them.

## Module 6: The DOM and Your API in the Browser (Videos 48-52)

### Video 48: The DOM: Selecting, Changing and Creating Elements

A graphic shows the DOM as a tree. Covers querySelector, textContent versus innerHTML (with a live XSS demonstration using an event title saved through your own API), createElement, classList, dataset, and attributes. Teaches when template strings are fine and when createElement is safer. Project step: render event cards from data in JavaScript. AI ritual: ask AI to write the render function, then audit it for injection risks.

### Video 49: Events and Interactivity

Covers addEventListener, the event object, bubbling and capturing, event delegation, preventDefault, and keyboard, input, and submit events. Teaches when to delegate and why inline onclick is discouraged. Project step: live search, category filter, and a modal that opens and closes with the keyboard (including Esc and focus management). AI ritual: ask AI to list keyboard accessibility problems in your modal.

### Video 50: Calling Your API from the Browser: fetch, CORS and Cookies

Covers fetch in the browser against the CampusHub API: query strings for search and pagination, POST with JSON, reading the error shape, and showing loading, empty, and error states. Then the browser's own rules: CORS (debug a deliberate CORS error using the reproduce, hypothesize, test protocol), credentials and the httpOnly refresh cookie, and why the access token lives in memory and not in localStorage. Project step: the events page and login form working against the real API.

### Video 51: Browser Storage and Thinking in State

Covers localStorage, sessionStorage, serialization, and cookies, plus limits and security cautions about what never to store. Introduces the render-from-state pattern: one source of truth, and the UI is a function of it. Project step: persisted UI preferences (theme, last filter) and a My Registrations list that is fetched from the API, not stored. This pattern is exactly what React will formalize. AI ritual: have AI hunt for state-sync bugs in your code.

### Video 52: CampusHub Web Client v1 and Module 6 Checkpoint

Consolidation day: a searchable, filterable, paginated events page, login and logout, and registration with real seat counts, all against the real API and split into modules. Add a manual test checklist and push. A 20-minute AI-off challenge closes the module. Bridge: show on screen how many places manually update the DOM after one registration and how easy it is to miss one. That pain is what React solves.

## Module 7: React Front End on the API (Videos 53-68)

### Video 53: Why React, Vite Setup and Project Structure

Starts by reopening the DOM code from Video 52 and showing why it does not scale, then introduces React's declarative model with a simple animation of state driving UI. Create a Vite and React project inside a client folder next to the server, add the Vite dev proxy to the API, set up Tailwind, and tour the generated files line by line. Teaches when React is worth it and when plain HTML is better. AI ritual: ask AI to explain the boilerplate and verify one claim in the docs.

### Video 54: JSX and Components

Covers JSX rules (single root, className, curly-brace expressions, self-closing tags), components as functions, naming, and composition. Teaches when to split UI into a component and when splitting makes things harder to read. Project step: port the header, footer, and event card from Module 5 into components, keeping the Tailwind styling. AI ritual: have AI convert a chunk of HTML to JSX and find the mistakes it makes.

### Video 55: Props, Children and Rendering Lists

Covers props, destructuring, default values, children, passing functions as props, keys in lists, and conditional rendering. Shows the classic bugs live: index as key, and a stray 0 rendered by an && expression. Project step: an EventList component that maps API data to EventCard (keyed by the database id) plus an empty-state component. AI ritual: predict what renders before running each snippet.

### Video 56: State with useState

Explains the difference between a plain variable and state using a re-render animation. Covers setter behavior, functional updates, and immutable updates for arrays and objects. Teaches where state should live and, importantly, when something should be derived instead of stored. Project step: search text, category filter, and sort as state, turned into API query parameters. AI ritual: ask AI to find redundant state in your component.

### Video 57: Events, Controlled Forms and Validation

Covers onChange, onSubmit, preventDefault, controlled versus uncontrolled inputs, form state objects, validation on blur and on submit, and accessible error messages. Maps the API's 422 field errors back onto the right inputs, so client and server rules agree. Notes when a library like React Hook Form becomes worth adopting. Project step: the login, sign-up, and event forms in React. AI ritual: ask AI for edge-case inputs and test them.

### Video 58: useEffect and the Component Lifecycle

An animated timeline shows when effects run, how dependencies work, and what cleanup does. Covers fetching from the API on mount and when filters change, aborting stale requests, and StrictMode's double run. The key lesson is when not to use an effect: deriving data and handling events do not need one. Project step: load events with loading and error states, set the document title, and debounce the search box with cleanup. AI ritual: review each effect and ask whether it is needed.

### Video 59: useRef, Custom Hooks and Reusable Logic

Covers useRef for DOM access and mutable values, the rules of hooks, and extracting logic into custom hooks. Teaches when a custom hook pays off and when it is just indirection. Project step: an api client module, a useApi hook for loading and error states, and useDebounce for search. AI ritual: ask AI to review the hooks for rules-of-hooks violations.

### Video 60: Routing with React Router

Covers BrowserRouter, Routes, Link, NavLink, URL params, search params, useNavigate, nested routes with Outlet, and a 404 page, and explains client-side versus server-side routing. Project step: Home, Events, Event Details, Clubs, My Registrations, and NotFound pages sharing one layout, with filters kept in the URL. Includes a short note on why routing affects SEO and when a framework like Next.js is considered. AI ritual: have AI list routing edge cases to test.

### Video 61: Composition and Reusable UI Patterns

Covers composition over prop explosion, children as slots, and building primitives (Button, Input, Card, Modal) with accessible behavior such as focus handling. Teaches the rule of three: abstract only after the third repetition. Project step: create a ui folder and refactor CampusHub to use it. AI ritual: have AI critique your component API and decide what to accept.

### Video 62: Sharing State: Context and Auth in the Browser

A diagram shows prop drilling pain, then lifting state up, then Context as the next step. Covers provider and useContext, splitting contexts, and the re-render caveat. Teaches when Context fits (theme, auth) and when it does not (fast-changing data). Project step: ThemeContext and an AuthContext that logs in against the API, keeps the access token in memory, silently refreshes it with the cookie, and a protected route component. Teaches why the client can hide things but only the server can enforce them.

### Video 63: Complex State with useReducer and Redux Toolkit

Covers reducers, actions, and dispatch, then a compact Redux Toolkit slice and store. The centerpiece is an honest comparison of useState, useReducer, Context, Redux, and lighter libraries, including why most apps do not need Redux. Project step: manage favorites and registrations with useReducer, then show the same logic in a Redux slice. AI ritual: ask AI to recommend a state approach for your app and challenge its reasoning.

### Video 64: Data Fetching States, Error Boundaries and Performance

Covers the loading, error, empty, and success pattern, error boundaries, and how React re-renders. Introduces React.memo, useMemo, and useCallback, with a strong warning about when not to use them, and route-level lazy loading with Suspense. Use React DevTools Profiler on a slow events page. Project step: pagination UI for the API's pages, skeleton loading, and a lazy-loaded route.

### Video 65: Full CRUD Workflows and Role-Based UI

Build the club admin dashboard and the admin page: create, edit, and delete events, view registrants, manage clubs, and show navigation and actions based on role. Discusses optimistic updates versus waiting for the server and when each is safe. Project step: the full workflow, where a club admin posts an event, a student registers, and the admin sees the stats. AI ritual: ask AI to find authorization gaps, then prove each one against the API with Postman.

### Video 66: Live Seats and Uploads in the UI

Connect the Socket.IO client to the seats channel from Video 34: join the event's room, update the seats meter live, and leave on unmount. Add the poster upload with a preview, progress, and the API's size and type errors. Teaches when real-time UI helps and when it only distracts. Project step: two browser windows registering at once, both meters updating.

### Video 67: Testing React Components

Covers Vitest and React Testing Library: render, screen, queries by role, userEvent, and mocking the API at the fetch layer with responses taken from the contract's examples. Teaches testing behavior rather than implementation, and what is not worth testing. Project step: tests for EventCard, the search filter, and form error mapping. AI ritual: have AI generate tests, then break the code on purpose to confirm each test actually fails.

### Video 68: Managing AI Changes and Module 7 Checkpoint (CampusHub v2)

A live multi-file refactor with AI: write a short spec, request the change, review the diff in Git, accept or reject each hunk, and commit checkpoints. Shows real AI failures such as invented props and unrequested edits. CampusHub v2, the full stack, runs from one command with routes, state, live seats, and tests, followed by a 30-minute AI-off challenge: one new field from the contract to the screen. Bridge: everything works on your laptop, so next we make it trustworthy, secure, and live.

## Module 8: Testing, Security and Deployment (Videos 69-74)

### Video 69: Testing Strategy for Full-Stack Apps

Covers the test pyramid (unit, integration, contract, end-to-end), assertions, mocks versus fakes, edge cases, regression tests, and coverage as a guide rather than a goal. Teaches when mocking helps and when it hides bugs. Project step: backend integration tests for auth and registration using an in-memory MongoDB, the Postman collection as a contract test, plus one Playwright test of the full registration flow. AI ritual: have AI propose test cases, then add the ones it missed.

### Video 70: Web Security Essentials for MERN

A defensive walkthrough of the OWASP essentials as they apply to MERN: NoSQL operator injection, XSS, CSRF, broken access control (including accessing another user's data by changing an id), broken authentication, misconfiguration, and vulnerable dependencies with npm audit. Each risk is demonstrated on a deliberately weak local branch of CampusHub, first against the API with Postman and then through the UI, then fixed with validation, sanitization, helmet, rate limiting, and ownership checks.

### Video 71: Git Collaboration: Branches, Pull Requests and Code Review

Covers feature branches, pull request descriptions, conventional commits, protected main, and a deliberately created merge conflict that students resolve together. Teaches a code review checklist, how to review a change to the API contract, and how to review a pull request written by AI. Project step: pairs work on conflicting changes to CampusHub, open pull requests, and review each other's code.

### Video 72: Verifying AI-Generated Code

A practical review protocol: read the diff, run the tests and the collection, confirm every imported package actually exists (AI sometimes invents them), scan for secrets, and check that every new endpoint is in the contract and has authentication and validation. Project step: give AI a task such as adding a comments feature, review its output for bugs, and write regression tests. Includes a reusable AI-assisted code review prompt.

### Video 73: CI/CD and Production Builds

Build a GitHub Actions workflow that installs, lints, runs the unit and integration tests and the Postman collection through the Postman CLI, and builds on every pull request. Covers production builds, environment configuration per environment, and deploying the API to Render or a similar host, the database on Atlas, and the front end to Vercel or Netlify. Teaches how cookies and CORS behave differently in production. Project step: CampusHub live with automatic deploys on merge.

### Video 74: Logs, Monitoring, Production Debugging and Module 8 Checkpoint

Covers structured logging, request ids, error tracking, health checks, uptime monitoring with a scheduled collection run, rollbacks, and a release checklist. Then a debugging drill: a bug is introduced in production and students diagnose it from logs, fix it, and redeploy. Covers common deployment failures such as a missing environment variable, CORS, cold starts, and Atlas network access. Bridge: the pieces are all here, so next you plan and build something of your own.

## Module 9: Capstone and Technical Viva (Videos 75-81)

### Video 75: From Idea to Spec

Teaches how to turn a problem into personas, user stories, acceptance criteria in Given/When/Then form, and a MoSCoW priority list. Each student picks a capstone extension to CampusHub (for example placement tracking, resource booking, or student activities) or proposes their own, then writes a SPEC.md. AI ritual: use AI as a sparring partner to find gaps in the spec, not to decide the scope.

### Video 76: Architecture and the API Contract

Covers data models, the OpenAPI contract and Postman collection for the new feature, wireframes, folder structure, a GitHub Projects board, task estimation, and short architecture decision records. You walk through CampusHub's own architecture diagram as a model, then students finalize their contract, plan, and sprint backlog.

### Video 77: Build Sprint 1: Data Layer and API

A live worked example: take one capstone-style feature from contract to a working, tested API using small commits, a feature branch, Supertest, the Postman collection, and a pull request. AI is used inside the spec-driven loop for small, reviewed tasks. Students build their own feature's API in parallel and compare approaches.

### Video 78: Build Sprint 2: Front End and Role-Based Workflows

Build the UI for the feature on the API from Sprint 1: forms with validation and server error mapping, loading and error states, role-based views, and an accessibility pass. Covers how to keep pull requests small and how to review each other's work.

### Video 79: Build Sprint 3: Testing, Hardening and Deployment

Add tests for the main flows, run the security checklist from Module 8, add rate limiting and logging, and deploy the feature through the CI pipeline. Teaches how to decide what to cut when time is short without sacrificing quality or security.

### Video 80: Documentation, Demo Prep and Code Walkthrough Skills

Covers writing a useful README, publishing the API documentation, and an architecture diagram, plus scripting and recording a short demo. Teaches how to explain a code path and justify trade-offs aloud. Includes a peer practice round where students trace a feature through the code and fix a small planted bug on camera.

### Video 81: Mock Viva, Final Demo and What Comes Next

A mock technical viva: explain the architecture, trace one request from UI to database, fix a minor defect live, and demo the deployed app. Students review their AI\_LOG.md from Video 7 and reflect on what helped and what hurt. Closes with a preview of the follow-up AI course, where CampusHub gains an AI assistant using LLM APIs, retrieval, and tool calling.
