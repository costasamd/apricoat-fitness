# Feature Specification: Apricot Fitness Center

**Feature Branch**: `001-apricot-fitness`  
**Created**: 2026-11-07  
**Updated**: 2026-11-09  
**Input**: User description: "Create a project specification for Apricot Fitness Center is an all-in-one web platform offering professional coaching, custom fitness plans, and an online store for authentic gym gear. Our goal is to help users achieve their health goals by providing top-tier guidance and reliable fitness products in a single place. Include: a project title and description, the purpose and target audience, user stories for core workflows (sign up, create, read, update, delete), acceptance criteria for each story, API endpoints, and implementation priority"

## Project Title and Description

**Project Title**: Apricot Fitness Center

**Project Description**: Apricot Fitness Center is an all-in-one web platform that combines professional coaching, personalized training plans, and a trusted online store for authentic fitness gear. The platform helps members achieve sustainable health goals by unifying training guidance, progress tracking, and product access in one experience.

## Purpose and Target Audience

**Purpose**: To help users build healthier habits, access expert coaching, follow structured fitness plans, and purchase authentic training gear with confidence. The product streamlines the journey from onboarding to goal tracking and product fulfillment while creating a dependable operational workflow for coaches and staff.

**Target Audience**:
- Individuals seeking structured fitness guidance and accountability
- Members who want personalized training plans and progress tracking
- Coaches and trainers who need to manage client programs and communication
- Staff managing memberships, product inventory, and user accounts
- Fitness shoppers who want authentic gym equipment and accessories

## MVP Scope

The MVP is **Phase 1** of the Implementation Priority section. It includes User Stories 1 to 5 in full and the Phase 1 scenarios of User Story 6. It excludes the Phase 2 scenarios of User Story 6, all of User Story 7 (delete and account closure), the product catalog, cart and orders, auditing, and the endpoints that support them. User stories are listed in build order: every Phase 1 story comes before any Phase 2 story, and inside each story the Phase 1 scenarios come first. The Implementation Priority section is the authority if labels ever disagree.

## Clarifications

These assumptions were added on 2026-11-09 to make the MVP stories testable. They are **proposed decisions and need team confirmation**.

- **Roles**: The system has three roles: `member`, `coach`, and `admin`.
- **Account creation**: Public sign-up always creates a `member`. Coach and admin accounts are created by an admin or seeded in the database; they cannot be created through public sign-up.
- **Coach-member link**: Each member profile has an optional `coachId`. An admin sets it through `PATCH /api/users/:id`. A coach may view members, and create plans for them, only when the member's `coachId` is that coach.
- **Goals storage**: Member goals and training preferences are part of the member profile and are saved through `PATCH /api/users/:id` and read through `GET /api/users/me`.

## User Scenarios & Testing

### User Story 1 - Member sign-up and onboarding (Phase: 1 - MVP)
A new user wants to create an account, set fitness goals, and begin working with the platform.

**Why this priority**: Account creation and onboarding are the entry point to the product and determine whether users complete the journey to coaching and training engagement.

**Independent Test**: A new user can complete sign-up, confirm account details, and create a basic profile without support.

**Acceptance Scenarios**:
1. **Given** a user has not created an account, **When** they complete the sign-up form with valid details, **Then** the system creates a member profile and sends a confirmation.
2. **Given** the user enters invalid or duplicate account details, **When** they submit the form, **Then** the system shows clear validation errors and prevents duplicate accounts.
3. **Given** a valid member profile exists, **When** the user sets goals and preferred training preferences, **Then** the system stores the information for use in future plan recommendations.

---

### User Story 2 - Log in and log out (Phase: 1 - MVP)
A registered user (member, coach, or admin) wants to log in to access their account and log out when finished.

**Why this priority**: Every protected workflow depends on knowing who the user is. Without login and session handling, profiles, plans, and role restrictions cannot work.

**Independent Test**: A registered user can log in with correct credentials, reach a protected page, log out, and then be unable to reach that page.

**Acceptance Scenarios**:
1. **Given** a registered user with valid credentials, **When** they submit the login form, **Then** the system starts an authenticated session and returns their role.
2. **Given** an email or password that is incorrect, **When** the user submits the login form, **Then** the system rejects the attempt with a single generic message that does not reveal which field was wrong.
3. **Given** a logged-in user, **When** they log out, **Then** the session ends and later requests to protected endpoints are rejected.
4. **Given** a user who is not logged in, **When** they request a protected endpoint, **Then** the system responds with an unauthenticated error and returns no data.

---

### User Story 3 - Role-based access control (Phase: 1 - MVP)
The platform needs to restrict what each role can see and change so that sensitive data stays with authorized people.

**Why this priority**: Member health goals and personal details are sensitive. Access rules must exist before profile and plan endpoints are exposed.

**Independent Test**: Using a member, a coach, and an admin account, each role can reach only the records and actions allowed for that role.

**Acceptance Scenarios**:
1. **Given** a signed-in member, **When** they request another member's profile or plans, **Then** the system responds with a forbidden error and returns no data.
2. **Given** a signed-in coach, **When** they request a member whose `coachId` is not theirs, **Then** the system responds with a forbidden error and returns no data.
3. **Given** a signed-in member, **When** they try to create a plan or set a member's `coachId`, **Then** the system rejects the action as forbidden.
4. **Given** a signed-in admin, **When** they set a member's `coachId` to a coach, **Then** the system saves the link and that coach can then view the member.

---

### User Story 4 - Create a personalized fitness plan (Phase: 1 - MVP)
A coach or staff member wants to create a custom training plan for a member based on their goal, availability, and fitness level.

**Why this priority**: Personalized plans are central to the product value proposition and directly support member outcomes.

**Independent Test**: A coach can create a plan, assign it to a member, and verify the content is viewable by that member.

**Acceptance Scenarios**:
1. **Given** a coach is authenticated, **When** they create a plan with objectives, schedule, and exercises, **Then** the system saves the plan and links it to the chosen member.
2. **Given** a plan is incomplete or invalid, **When** the coach submits it, **Then** the system blocks submission and requests missing information.
3. **Given** a plan has been created, **When** the member opens their dashboard, **Then** they can view the assigned plan and its training details.

---

### User Story 5 - Read and review existing user and plan data (Phase: 1 - MVP)
A member or coach wants to access their profile, goal progress, and relevant plan information.

**Why this priority**: Read access enables confidence, accountability, and day-to-day usage of the platform.

**Independent Test**: An authenticated user can retrieve their profile and plan information without exposing unrelated records.

**Acceptance Scenarios**:
1. **Given** a member is signed in, **When** they open their dashboard, **Then** they can view their profile, goals, and active plan details.
2. **Given** a coach is signed in, **When** they list or open members, **Then** they see only the members whose `coachId` is theirs, and only the plans assigned to those members. *(Revised on 2026-11-09: "search" replaced with a member list so the scenario matches `GET /api/users`.)*
3. **Given** data is unavailable or not found, **When** a user requests it, **Then** the system returns a clear not-found or access error response.

---

### User Story 6 - Update member profile, plan details, and account settings (Phase: 1 for scenarios 1 and 2; Phase 2 for scenarios 3 and 4)
A user needs to revise personal details, update goals, or adjust a training plan as circumstances change.

**Why this priority**: Plans and personal data change over time, and updates are required to maintain trust and effectiveness. Profile updates ship in the MVP; plan editing waits for Phase 2 ("Plan editing and deletion rules").

**Independent Test**: A member or coach can update a profile or plan and see the revised data immediately after save.

**Acceptance Scenarios**:
1. **Given** a member has an existing profile, **When** they update their goals or contact information, **Then** the system stores the new values without deleting prior data incorrectly. *(Phase 1)*
2. **Given** invalid profile data is submitted, **When** the user saves the change, **Then** validation rules reject the update and explain the problem. *(Phase 1)*
3. **Given** a coach edits a plan schedule or exercise details, **When** the save completes, **Then** the member sees the updated training guidance reflected in the assigned plan. *(Phase 2)*
4. **Given** invalid plan data is submitted, **When** the coach saves the change, **Then** validation rules reject the update and explain the problem. *(Phase 2; split out of the original scenario 3 on 2026-11-09 so each scenario belongs to one phase.)*

---

### User Story 7 - Delete records and manage account closure (Phase: 2 - not in MVP)
A user or staff member may need to remove outdated records or close an account when a membership or engagement has ended.

**Why this priority**: Delete flows are essential for privacy, lifecycle management, and operational cleanup, but they are secondary to onboarding and daily use.

**Independent Test**: A user can delete a plan or account only when authorized and receives confirmation of the action.

**Acceptance Scenarios**:
1. **Given** a user is authorized to delete an account or plan, **When** they confirm the action, **Then** the system removes the record or marks it as inactive according to the product rules.
2. **Given** the user attempts to delete a record that is still in use, **When** they submit the action, **Then** the system blocks the deletion and explains the dependency.
3. **Given** the deletion request is unauthorized, **When** it is submitted, **Then** the system rejects the action and logs the attempt for audit review.

---

### Edge Cases

- What happens when a user signs up with an email already in use?
- How does the system handle duplicate or conflicting member goals?
- What happens when a coach attempts to assign a plan to a member without an active profile?
- How does the platform respond when a plan or product is deleted while still referenced by a member or order?
- What happens when a user updates a plan after a member has already begun training?

## Requirements

### Functional Requirements

- **FR-001**: The system MUST allow a new user to create an account with a valid email, password, and required profile details.
- **FR-002**: The system MUST create a unique member profile when sign-up succeeds and store core identity and goal information.
- **FR-003**: The system MUST allow members to read their profile, goals, plan status, and relevant account information.
- **FR-004**: The system MUST allow members and authorized coaches to update profile, contact, and health-goal information.
- **FR-005**: The system MUST allow an authorized user to delete or deactivate a profile or plan when permitted by the system rules.
- **FR-006**: The system MUST allow a coach or staff member to create a fitness plan including title, description, schedule, exercises, and target outcomes.
- **FR-007**: The system MUST allow a member or coach to view assigned plans and associated training details.
- **FR-008**: The system MUST allow a coach or staff member to update existing plan details and reassign plans without losing prior history or auditability.
- **FR-009**: The system MUST allow a coach or staff member to remove or archive a plan when it is outdated or replaced.
- **FR-010**: The system MUST support a product catalog for authentic gym gear and allow discovery of relevant items by category and name.
- **FR-011**: The system MUST allow a member to add items to a cart or wishlist and complete a purchase flow for authorized orders.
- **FR-012**: The system MUST restrict access to sensitive data by role so that only authorized members, coaches, or administrators can view or modify it.
- **FR-013**: The system MUST provide validation, error messages, and confirmation states for critical create, update, and delete actions.
- **FR-014**: The system MUST retain a basic audit trail for account changes, plan changes, and order activity to support trust and issue resolution.
- **FR-015**: The system MUST authenticate users with email and password, start a session on success, and end it on logout. *(Added 2026-11-09)*
- **FR-016**: The system MUST let an admin link a member to a coach, and MUST limit a coach's access to members linked to them. *(Added 2026-11-09)*

### Key Entities

- **Member**: A registered user with a profile, fitness goals, preferred training information, an optional `coachId`, and account status.
- **Coach**: An authenticated professional user with permission to create and manage plans for assigned members.
- **Admin**: An authenticated staff user who can link members to coaches and manage accounts and products. *(Added 2026-11-09)*
- **FitnessPlan**: A structured program containing goals, workout schedule, exercise descriptions, and assignment metadata.
- **Workout**: A scheduled training unit within a plan, including a name, exercises, timing, and instructions.
- **Product**: An item in the online store with name, description, category, pricing, availability, and authenticity metadata.
- **Order**: A purchase record capturing a member, purchased items, total value, fulfillment state, and order status.

## API Endpoints

The following API endpoints represent the proposed contract for the MVP and core workflows. They are grouped by phase, with Phase 1 first.

### Phase 1 - MVP

- **POST /api/auth/signup**: Create a new member account
- **POST /api/auth/login**: Authenticate a member, coach, or admin
- **POST /api/auth/logout**: End an active user session
- **GET /api/users/me**: Retrieve the authenticated user profile, including goals and preferences
- **GET /api/users**: List members the requester may see (a coach sees linked members; an admin sees all) *(Added 2026-11-09)*
- **GET /api/users/:id**: Retrieve a user profile for an authorized coach or admin
- **PATCH /api/users/:id**: Update member or coach profile details, goals, and preferences; admin-only for `coachId`
- **POST /api/plans**: Create a fitness plan
- **GET /api/plans/:id**: Retrieve a plan by ID
- **GET /api/plans?memberId=:memberId**: List plans assigned to a member

### Phase 2 and later

- **DELETE /api/users/:id**: Deactivate or remove a user account
- **PATCH /api/plans/:id**: Update plan content or assignment
- **DELETE /api/plans/:id**: Remove or archive a plan
- **GET /api/products**: List catalog items by category or search term
- **GET /api/products/:id**: Retrieve a product detail page payload
- **POST /api/products**: Create a new product entry for staff/admin use
- **PATCH /api/products/:id**: Update pricing, stock, or description
- **DELETE /api/products/:id**: Remove or deactivate a product
- **POST /api/orders**: Create a purchase order
- **GET /api/orders/:id**: Retrieve order details
- **GET /api/orders?memberId=:memberId**: List member orders

## Success Criteria

### Measurable Outcomes

- **SC-001**: New members can complete sign-up and profile setup in under 3 minutes on a standard web flow.
- **SC-002**: Coaches can create and assign a new fitness plan in under 5 minutes for a standard member scenario.
- **SC-003**: Members can access their profile, plan, and progress information without needing support from staff.
- **SC-004**: At least 90% of users who begin onboarding reach a completed account state in the first session.
- **SC-005**: The product catalog and purchase flow support the ability to discover, purchase, and track authentic gym gear with clear confirmation steps.
- **SC-006**: Critical workflows such as sign-up, plan assignment, and purchase completion are consistently successful for standard user journeys.

## Implementation Priority

### Phase 1 - MVP Foundation (P0)
- User authentication and role-based access
- Member profile creation and update
- Basic fitness plan creation and assignment
- Profile and plan read access for members and coaches

### Phase 2 - Core Experience (P1)
- Product catalog and product detail views
- Cart and purchase flow for gear
- Plan editing and deletion rules
- Auditability and validation for essential data updates

### Phase 3 - Expansion and Optimization (P2)
- Advanced dashboards and progress reporting
- Inventory management workflows for staff
- Automated reminders, coaching notes, and engagement tools
- Performance and UX improvements based on real user feedback

## Notes

This specification intentionally focuses on the user-facing value of Apricot Fitness Center while keeping implementation details at a product-contract level. It is designed to be actionable for planning, design, and engineering without prematurely locking the team into a specific framework or code structure.