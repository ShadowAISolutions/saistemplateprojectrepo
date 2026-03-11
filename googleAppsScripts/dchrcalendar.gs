  /*
===================================================================================
GOOGLE SHEETS APPOINTMENT BOOKING SYSTEM
===================================================================================

OVERVIEW:
---------
This is a complete, HIPAA-compliant appointment booking system built with Google Apps Script.
It provides a staff web interface for booking patient appointments, creates Google Drive 
folders for each patient, sends confirmation emails with Patient Portal links, and tracks 
everything in Google Sheets with comprehensive audit logging.

KEY FEATURES:
-------------
Core Booking:
- Interactive calendar UI with color-coded date availability (blue=available, green=partial, red=full)
- Multi-capacity time slots (e.g., 8 people can book the same 9am slot)
- 24-hour advance booking requirement (configurable via MIN_HOURS_ADVANCE)
- Unique Patient ID generation (format: DCHR-0000001-ID, incremental, stored in A1)
- Dynamic row links using HYPERLINK+MATCH formulas (work even if rows are moved/sorted)
- Appointment Type selection (Pre-Employment, Fitness for Duty, Shy Bladder, Shy Lung)
- Race condition protection via LockService for concurrent bookings
- Request cancellation counters to ignore stale async responses

Patient Management:
- Automatic Google Drive folder creation per patient (named: "LastName, FirstName (DCHR-0000001-ID)")
- Duplicate patient detection by First Name + Last Name + DOB with option to reuse existing record
- Rescheduling existing appointments with Last Booked At tracking
- SSN preservation during reschedule (client only receives masked SSN, original preserved server-side)
- Unbooking/cancellation with automatic notification emails
- View booked appointments for selected day with reschedule/unbook options
- View all appointments for the current month grouped by date
- Patient notes system with edit/save functionality and timestamp tracking (500 char limit)
- Visit status tracking (Pending, No-Show, or custom status)

Communication:
- Confirmation emails sent on booking/rescheduling/rebooking with Patient Portal link
- Cancellation emails sent on unbooking
- BCC support for admin notifications (configured in Users tab column C)
- Google Calendar event creation with patient details and links (excludes SSN for minimum necessary)
- Graceful handling of email/calendar failures (booking succeeds, user notified)

Patient Portal (accessible via secure token-based link):
- Secure opaque URL using portal token (no patient name or folder ID exposed)
- Two-section expandable interface: Vaccination Upload and Health Questionnaire
- Vaccination upload with drag-and-drop file support
- File validation: type checking (images, PDF, Word), size limit (10MB), magic byte verification
- Rate limiting: 20 uploads per hour per folder to prevent abuse
- Real-time tracking of uploads in the spreadsheet (Last File Link, Last Upload At)
- Files automatically prefixed with "Vaccination_Proof_"
- Health questionnaire form with symptoms, allergies, medications questions
- Questionnaire rate limiting: 5 attempts per hour to prevent abuse
- Automatic PDF generation of completed questionnaire saved to patient folder
- Duplicate submission prevention (checks if already completed)
- Progress bar showing completion state of both tasks
- Completion banner when all tasks done
- Folder ownership verification before accepting uploads

Certificate System:
- Certificate approval triggered by typing "Approve Certificate" in column AZ (52)
- Authorization check: only users listed in Users tab can generate certificates
- Confirmation dialog before generating certificate
- Duplicate prevention: checks if certificate already exists before generating
- Race condition protection via LockService
- Automatic PDF generation with patient info, visit date, decision, and comments
- Certificate saved to patient's Google Drive folder
- Timestamp recorded in column BA (53), link recorded in column BB (54)
- Full audit logging of certificate generation and unauthorized attempts

Authentication & Security:
- Username/Password authentication (skipped entirely if Users tab is empty)
- Session token management with 15-minute expiration (HIPAA compliant)
- Cryptographically secure token generation using Utilities.getUuid()
- Constant-time password comparison to prevent timing attacks
- Password complexity requirements (8+ chars, upper, lower, number, special)
- Password cannot contain username
- Case-insensitive username, case-sensitive password
- Failed login lockout (5 attempts = 15 minute lockout)
- Client-side auto-logout after 15 minutes of inactivity with 2-minute warning
- Password change functionality in Settings modal
- Session invalidation on password change (forces re-auth on all devices)
- Session creation timestamp tracking for invalidation checks

HIPAA Compliance Features:
- Comprehensive audit logging of all PHI access and modifications
- Protected audit log sheet (editors removed to prevent tampering)
- SSN masking (only last 4 digits displayed in UI, full SSN never sent to client)
- Secure Patient Portal URLs using opaque tokens (no PHI in URL parameters)
- Portal token regeneration capability if link is compromised
- XSS protection (all user input escaped before rendering in HTML/PDFs/emails/calendar)
- HTML injection prevention in certificate and questionnaire PDFs
- Formula injection prevention in spreadsheet hyperlinks
- Server-side validation of all inputs (email, phone, SSN, zip, dates, lengths)
- Ownership verification before data mutations (folder ID validated against patient records)
- Error handling that doesn't expose PHI (generic messages, type-only logging)
- Activity monitoring (logins, logouts, failed attempts, lockouts, password changes)
- URL parameter sanitization (script tags, javascript: removed, page whitelist)
- Clickjacking protection (client-side frame-busting; ALLOWALL required for Google Apps Script)

Input Validation:
- All form fields validated server-side regardless of client validation
- Email format validation with regex
- Phone format validation (minimum 10 digits)
- SSN format validation (XXX-XX-XXXX or masked format)
- State code validation (2 letters)
- Zip code validation (5 digits or 5+4 format)
- Date validity checks (no future DOB)
- Appointment type validation against allowed values
- Gender validation against allowed values
- Note length enforcement (500 char max)
- Input length limits to prevent DoS (names 100 chars, address 200 chars, etc.)
- Patient ID format validation (DCHR-XXXXXXX-ID pattern)
- Row number validation (integer, within bounds, reasonable maximum)

Login Page UI:
- Animated PFC logo with hexagonal frame and sweeping scan effect
- Letters transition between blue and red gradients as scan passes
- Red/blue ambient glow effects in background
- Rainbow gradient divider (red-green-blue)
- Username and password fields with icons
- "Authorized Personnel Only" badge
- Remaining login attempts displayed on failure
- Account lockout message when locked

Secret Test Features (for development):
- Triple-click on "Unavailable" legend dot: Fills form with sequential test data (FirstName1 LastName1, etc.)
- Triple-click on "Available" legend dot: Clears all form fields
- Test email hardcoded to: fhoyos@pfcassociates.org (change in fillTestData function)
- Test mode protection: requires "ENABLE_TEST_MODE" in cell C1 to enable sequential numbering
- Falls back to random number if test mode not enabled

Performance Optimizations:
- CacheService caching to reduce spreadsheet API calls:
  - Available slots cached for 30 seconds (CACHE_SLOTS_DURATION)
  - Authentication required check cached for 5 minutes (CACHE_AUTH_DURATION)
  - BCC emails list cached for 5 minutes (CACHE_BCC_DURATION)
  - Cache automatically invalidated after bookings/cancellations
- Batched audit logging:
  - Audit events queued in memory (up to 10 events or 60 seconds)
  - Written to spreadsheet in single batch operation
  - Reduces individual appendRow() calls by ~90%
  - Fallback to direct write if queue fails
- Batched spreadsheet writes:
  - Patient data updates use single setValues() instead of multiple setValue() calls
  - Appointment slot counts updated in single operation
  - Unbook operations batch date/time/note clearing
- Login redirect improvements:
  - Multiple redirect methods tried (top.location, window.open, location.href)
  - 3-second fallback timer shows manual link if redirect stalls
  - Avoids document.write() which breaks google.script.run communication
- Page initialization:
  - initializePage() function handles both DOMContentLoaded and document.write scenarios
  - Fallback timer ensures initialization even if DOM events fail
  - pageInitialized flag prevents duplicate initialization

DEPLOYMENT:
-----------
1. Create a Google Sheet with three tabs:
   - "Appointments" - Slot definitions and booking references
   - "DCHR_All_Categories" - Patient details (data starts at row 5)
   - "Users" - Login credentials (optional, leave empty to skip auth)

2. Set up the Appointments tab with columns:
   A: Date, B: Start Time, C: End Time, D: Capacity, E: (spacer), F: Booked (start at 0), G: Remaining (formula: =D2-F2)

3. Set up DCHR_All_Categories tab:
   - Column A: Portal Token, Column B: Case Number
   - Cell C1: Patient ID counter (start at 0)
   - Cell D1: Test data counter (start at 0)
   - Row 5+: Patient data rows

4. Set up Users tab (optional):
   - Row 1: Headers (Username, Password, Email)
   - Row 2+: User credentials (Email in column C is used for BCC on all booking emails)

5. Update PARENT_FOLDER_ID constant with your Google Drive folder ID

6. Extensions → Apps Script → Paste this code

7. Run authorizeScript() first to grant permissions

8. Deploy → New deployment → Web app → Execute as: Me → Anyone can access

9. Set up the onEdit trigger: Run → Run function → createOnEditTrigger (one time only)

10. Use the web app URL as your public booking link

11. (Optional) For custom domain setup:
    - Update CUSTOM_DOMAIN_URL constant with your custom domain URL
    - Create an HTML wrapper page on your domain (see CUSTOM DOMAIN SETUP section below)
    - Use your custom domain URL as the public booking link instead of the Google Apps Script URL

CUSTOM DOMAIN SETUP:
--------------------
If you want to serve the booking system from your own domain (e.g., www.yourdomain.com/scheduling)
instead of the Google Apps Script URL, follow these steps:

Why use a custom domain?
- Cleaner, branded URL for users
- Users stay on your domain throughout the session
- Hides the Google Apps Script URL from end users

Requirements:
- A web server where you can host an HTML file
- The ability to update the CUSTOM_DOMAIN_URL constant in this script

Step 1: Update the CUSTOM_DOMAIN_URL constant in this script:
   const CUSTOM_DOMAIN_URL = 'https://www.yourdomain.com/scheduling';

Step 2: Create an HTML wrapper page on your web server with this content:

   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Appointment Scheduling</title>
     <style>
       * { margin: 0; padding: 0; box-sizing: border-box; }
       html, body {
         width: 100%;
         height: 100%;
         overflow: hidden;
         background: #0a0e14;
       }
       iframe {
         width: 100%;
         height: 100%;
         border: none;
         display: block;
       }
       .loading {
         position: fixed;
         top: 0; left: 0; right: 0; bottom: 0;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         background: #0a0e14;
         color: rgba(255,255,255,0.8);
         font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         z-index: 10;
         transition: opacity 0.4s ease;
       }
       .loading.hidden {
         opacity: 0;
         pointer-events: none;
       }
       .spinner {
         width: 44px;
         height: 44px;
         border: 3px solid rgba(255,255,255,0.15);
         border-top-color: #3b82f6;
         border-radius: 50%;
         animation: spin 0.8s linear infinite;
         margin-bottom: 20px;
       }
       @keyframes spin { to { transform: rotate(360deg); } }
       .loading-text { font-size: 15px; font-weight: 500; }
     </style>
   </head>
   <body>
     <div class="loading" id="loadingOverlay">
       <div class="spinner"></div>
       <div class="loading-text">Loading scheduling system…</div>
     </div>
     <iframe id="appFrame"></iframe>
     <script>
       // Base Google Apps Script URL - UPDATE THIS WITH YOUR DEPLOYED SCRIPT URL
       var baseUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
       
       // Pass through URL parameters (e.g., ?token=xxx) from parent to iframe
       var params = window.location.search;
       document.getElementById('appFrame').src = baseUrl + params;
       
       document.getElementById('appFrame').addEventListener('load', function() {
         document.getElementById('loadingOverlay').classList.add('hidden');
       });
       
       // Listen for messages from the iframe (for logout URL cleanup)
       window.addEventListener('message', function(event) {
         // Allow messages from Google domains
         var origin = event.origin || '';
         var isGoogle = origin.indexOf('google.com') !== -1 || origin.indexOf('googleusercontent.com') !== -1;
         if (!isGoogle) return;
         
         // Handle logout message - remove token from URL
         if (event.data && event.data.action === 'logout') {
           var url = new URL(window.location.href);
           if (url.searchParams.has('token')) {
             url.searchParams.delete('token');
             window.history.replaceState({}, '', url.toString());
           }
         }
       });
     </script>
   </body>
   </html>

Step 3: Update the 'baseUrl' variable in the HTML with your deployed Google Apps Script URL

How it works:
- The HTML page embeds the Google Apps Script in an iframe
- URL parameters (like ?token=xxx after login) are passed through to the iframe
- After login, the redirect URL uses CUSTOM_DOMAIN_URL so users stay on your domain
- On logout, the iframe sends a postMessage to the parent page
- The parent page receives the message and removes the ?token=xxx from the URL
- This keeps the URL clean and prevents token reuse after logout

Security notes:
- The postMessage listener only accepts messages from Google domains
- The token is removed from the URL on logout to prevent session reuse
- The iframe sandbox inherits Google Apps Script's security model


PATIENT PORTAL CUSTOM DOMAIN (Optional):
----------------------------------------
You can also host the Patient Portal on your custom domain for a branded experience.
The Patient Portal is accessed via links sent in confirmation emails to patients.

Patient Portal URL format (new secure format):
  https://www.yourdomain.com/patientportal?portal=UUID-TOKEN-HERE

Legacy URL format (backward compatible):
  https://www.yourdomain.com/patientportal?folderId=XXXXX&name=Patient%20Name

Step 1: Create an HTML wrapper page (e.g., patientportal.html) on your web server:

   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Patient Portal - Your Organization</title>
     <style>
       * { margin: 0; padding: 0; box-sizing: border-box; }
       html, body {
         width: 100%;
         height: 100%;
         overflow: hidden;
         background: #f5f7fa;
       }
       iframe {
         width: 100%;
         height: 100%;
         border: none;
         display: block;
       }
       .loading {
         position: fixed;
         top: 0; left: 0; right: 0; bottom: 0;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         background: #f5f7fa;
         color: #555;
         font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
         z-index: 10;
         transition: opacity 0.4s ease;
       }
       .loading.hidden {
         opacity: 0;
         pointer-events: none;
       }
       .spinner {
         width: 44px;
         height: 44px;
         border: 3px solid rgba(0,0,0,0.1);
         border-top-color: #1976d2;
         border-radius: 50%;
         animation: spin 0.8s linear infinite;
         margin-bottom: 20px;
       }
       @keyframes spin { to { transform: rotate(360deg); } }
       .loading-text { font-size: 15px; font-weight: 500; }
       .error-container {
         text-align: center;
         max-width: 420px;
         padding: 40px;
       }
       .error-container h2 {
         color: #333;
         font-size: 22px;
         margin-bottom: 12px;
       }
       .error-container p {
         color: #666;
         font-size: 15px;
         line-height: 1.6;
       }
     </style>
   </head>
   <body>
     <div class="loading" id="loadingOverlay">
       <div class="spinner"></div>
       <div class="loading-text">Loading patient portal…</div>
     </div>
     <iframe id="portalFrame"></iframe>
     <script>
       (function() {
         var params = new URLSearchParams(window.location.search);
         var portalToken = params.get('portal');
         var folderId = params.get('folderId');
         var name = params.get('name') || 'Patient';
         
         // UPDATE THIS URL with your deployed Google Apps Script URL
         var scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
         
         // New secure portal token format (preferred)
         if (portalToken && /^[a-f0-9-]{36}$/i.test(portalToken)) {
           document.getElementById('portalFrame').src = scriptUrl
             + '?page=upload&portal=' + encodeURIComponent(portalToken);
         }
         // Legacy folderId format (backward compatibility)
         else if (folderId && /^[a-zA-Z0-9_-]+$/.test(folderId)) {
           document.getElementById('portalFrame').src = scriptUrl
             + '?page=upload&folderId=' + encodeURIComponent(folderId)
             + '&name=' + encodeURIComponent(name);
         }
         // Invalid link
         else {
           document.getElementById('loadingOverlay').innerHTML =
             '<div class="error-container">' +
               '<h2>Invalid Link</h2>' +
               '<p>This link is not valid. Please use the Patient Portal link from the email you received when your appointment was scheduled.</p>' +
             '</div>';
         }
         
         document.getElementById('portalFrame').addEventListener('load', function() {
           document.getElementById('loadingOverlay').classList.add('hidden');
         });
       })();
     </script>
   </body>
   </html>

Step 2: Update the 'scriptUrl' variable with your deployed Google Apps Script URL

Step 3: Update the confirmation email template in bookAppointment() to use your custom Patient Portal URL
        instead of the default Google Apps Script URL. Search for COL_UPLOAD_LINK and update the URL.

How it works:
- The HTML page reads portal token (or legacy folderId/name) from URL
- Validates portal token format (UUID) or folderId format for security
- If valid, embeds the Google Apps Script Patient Portal in an iframe
- If invalid/missing, shows a user-friendly error message
- Different styling from booking page (light background) to visually distinguish patient-facing pages

Security notes:
- Portal tokens are opaque UUIDs - no patient information visible in URL
- Token is validated server-side and mapped to patient record
- Legacy folderId format still supported for backward compatibility with old emails
- Invalid tokens/IDs show an error instead of loading the iframe
- Portal tokens can be regenerated by staff if a link is compromised


SHEET STRUCTURE:
----------------

TAB 1: "Appointments" - Slot definitions and booking references
---------------------------------------------------------------
Columns A-G: Slot definition
  A: Date (e.g., 1/15/2025)
  B: Start Time (e.g., 9:00 AM)
  C: End Time (e.g., 9:30 AM)
  D: Capacity (e.g., 8 = max 8 people can book this slot)
  E: Spacer (empty, for visual separation)
  F: Booked (count of current bookings, starts at 0, updated automatically)
  G: Remaining (capacity - booked, updated automatically)

Column H: Spacer (empty, for visual separation)

Columns I+: Booking references (repeats for each person booked)
  Each booking takes 2 columns (FIELDS_PER_BOOKING = 2):
  - Column 1: HYPERLINK formula linking to DCHR row (displays as "Last, First - DCHR-0000001-ID")
  - Column 2: Spacer (empty)
  
  Example: If 3 people book a slot, columns I, K, M have links; J, L, N are spacers


TAB 2: "DCHR_All_Categories" - Full patient details
---------------------------------------------------
Row 1, Cell A1: Patient ID counter (stores last used number, e.g., 5 means last ID was DCHR-0000005-ID)
Row 1, Cell B1: Test data counter (for generating FirstName1/LastName1, FirstName2/LastName2, etc.)
Row 1, Cell C1: Test mode flag - Set to "ENABLE_TEST_MODE" to allow test data generation (security feature)
Rows 2-4: Reserved for headers or other use
Row 5+ (DCHR_START_ROW = 5): Patient data with columns:

  Column  Const                          Description
  ------  -----------------------------  --------------------------------------------------
  A (1)   COL_PATIENT_ID                 Patient ID (DCHR-0000001-ID format)
  B (2)   COL_BOOKED_AT                  Original booking timestamp + username
  C (3)   COL_LAST_NAME                  Last Name
  D (4)   COL_FIRST_NAME                 First Name
  E (5)   COL_GENDER                     Gender (Male/Female/Other)
  F (6)   COL_SSN                        SSN (format: 123-45-6789)
  G (7)   COL_ADDRESS                    Street Address
  H (8)   COL_CITY                       City
  I (9)   COL_STATE                      State (2-letter code)
  J (10)  COL_ZIP                        Zip Code
  K (11)  COL_PHONE                      Phone Number
  L (12)  COL_EMAIL                      Email Address
  M (13)  COL_DOB                        Date of Birth
  N (14)  COL_APPT_TYPE                  Appointment Type (Pre-Employment/Fitness for Duty/Shy Bladder/Shy Lung)
  O (15)  COL_APPT_DATE                  Appointment Date (MM/dd/yyyy format)
  P (16)  COL_APPT_TIME                  Appointment Time (h:mm a - h:mm a format)
  Q (17)  COL_LAST_BOOKED_AT             Reschedule/cancellation tracking:
                                         - "From [old date/time] on [timestamp] by [username]" for reschedules
                                         - "Cancelled on [timestamp] by [username]" for cancellations
                                         - "Rebooked existing patient on [timestamp] by [username]" for rebookings
  R (18)  COL_FOLDER_LINK                Google Drive folder URL
  S (19)  COL_UPLOAD_LINK                Patient Portal URL (vaccination upload & questionnaire)
  T (20)  COL_LAST_FILE_LINK             URL of most recently uploaded vaccination file
  U (21)  COL_LAST_UPLOAD_AT             Timestamp of most recent vaccination upload
  V (22)  COL_LAST_QUESTIONNAIRE_LINK    URL of completed questionnaire PDF
  W (23)  COL_LAST_QUESTIONNAIRE_AT      Timestamp of questionnaire completion
  X-AE    (columns 24-31)                Available for custom use
  AF (32) COL_VISIT_STATUS               Visit status (empty=Pending, "No-Show", or custom status)
  AG-AI   (columns 33-35)                Available for custom use
  AJ (36) COL_NOTE                       Free-text notes for patient (max 500 chars)
  AK (37) COL_NOTE_TIMESTAMP             Note timestamp with action and username:
                                         - "Saved on [timestamp] by [username]" for new notes
                                         - "Edited on [timestamp] by [username]" for updated notes
  AL-AW   (columns 38-49)                Available for custom use
  AX (50) COL_CERTIFICATE_COMMENTS       Comments for certificate
  AY (51) COL_CERTIFICATE_DECISION       Medical Director's decision for certificate
  AZ (52) COL_APPROVE_CERTIFICATE        Type "Approve Certificate" to trigger PDF generation
  BA (53) COL_CERTIFICATE_APPROVED_AT    Auto-filled timestamp when certificate generated
  BB (54) COL_CERTIFICATE_LINK           Auto-filled URL to generated PDF certificate
  ...
  BL (64) COL_PORTAL_TOKEN               Secure UUID token for Patient Portal URL (auto-generated)


TAB 3: "Users" - Login credentials (optional)
---------------------------------------------
If this tab is empty or has no valid users, authentication is completely skipped.

Row 1: Headers
  A: Username
  B: Password
  C: Email (for BCC on booking/cancellation emails)

Row 2+: User credentials
  A: Username (case-insensitive for login)
  B: Password (case-sensitive for login, must meet complexity requirements)
  C: Email (optional, receives BCC copy of all booking-related emails)

Password Complexity Requirements:
  - Minimum 8 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*()_+-=[]{}|;':",.<>/?)


TAB 4: "AuditLog" - HIPAA Compliance Audit Trail (auto-created)
---------------------------------------------------------------
This tab is automatically created when the first auditable event occurs.
It is protected to prevent tampering with audit records.

Row 1: Headers
  A: Timestamp (yyyy-MM-dd HH:mm:ss format)
  B: Action (event type)
  C: Username (who performed the action)
  D: Patient ID (affected patient, if applicable)
  E: Details (additional context)
  F: IP/Session Info (Google user email if available)

Logged Actions:
  - LOGIN_SUCCESS: User successfully authenticated
  - LOGIN_FAILED: Invalid credentials attempted
  - LOGIN_BLOCKED: Login attempt while account locked
  - LOGOUT: User logged out (manual or auto)
  - ACCOUNT_LOCKED: Account locked after failed attempts
  - PASSWORD_CHANGE: User changed their password
  - CREATE_BOOKING: New patient appointment created
  - RESCHEDULE: Existing appointment rescheduled
  - REBOOK_EXISTING: Existing patient rebooked
  - CANCEL_BOOKING: Appointment cancelled/unbooked
  - VIEW_PATIENT: Patient details accessed
  - VIEW_DAILY_BOOKINGS: Daily booking list viewed
  - VIEW_MONTHLY_BOOKINGS: Monthly booking list viewed
  - GENERATE_CERTIFICATE: Medical certificate PDF created


CONFIGURATION CONSTANTS:
------------------------
BOOKING_START_COL = 9        Column I, where booking links start in Appointments tab
FIELDS_PER_BOOKING = 2       Columns per booking (link + spacer)
DCHR_START_ROW = 5           First row of patient data in DCHR_All_Categories
PARENT_FOLDER_ID = '...'     Google Drive folder ID for patient folders
MIN_HOURS_ADVANCE = 24       Minimum hours before appointment for booking
CUSTOM_DOMAIN_URL = '...'    Custom domain URL (optional, for branded URLs instead of script.google.com)
                             Set to empty string '' to use default Google Apps Script URL
                             Example: 'https://www.yourdomain.com/scheduling'

Security & HIPAA Constants:
SESSION_EXPIRATION = 900     Session token lifetime in seconds (15 minutes for HIPAA)
MAX_LOGIN_ATTEMPTS = 5       Failed login attempts before account lockout
LOCKOUT_DURATION = 900       Account lockout duration in seconds (15 minutes)
AUDIT_LOG_SHEET = 'AuditLog' Name of the audit log sheet (auto-created)
INACTIVITY_TIMEOUT = 15 min  Client-side auto-logout after inactivity (in JavaScript)
WARNING_BEFORE_LOGOUT = 2 min Warning shown before auto-logout (in JavaScript)

File Upload Constants:
MAX_FILE_SIZE = 10MB         Maximum file size for vaccination uploads
ALLOWED_MIME_TYPES:          Allowed file types for uploads
  - image/jpeg, image/png, image/gif, image/webp, image/bmp
  - application/pdf
  - application/msword (doc)
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document (docx)

Input Validation Constants:
MAX_NOTE_LENGTH = 500        Maximum characters for patient notes
Valid appointment types:     Pre-Employment, Fitness for Duty, Shy Bladder, Shy Lung
Valid genders:               Male, Female, Other

Test Mode:
ENABLE_TEST_MODE flag        Set cell C1 in DCHR_All_Categories to "ENABLE_TEST_MODE"
                             to enable test data generation functions

Patient Data Column Constants:
  COL_PATIENT_ID = 1               COL_APPT_TYPE = 14
  COL_BOOKED_AT = 2                COL_APPT_DATE = 15
  COL_LAST_NAME = 3                COL_APPT_TIME = 16
  COL_FIRST_NAME = 4               COL_LAST_BOOKED_AT = 17
  COL_GENDER = 5                   COL_FOLDER_LINK = 18
  COL_SSN = 6                      COL_UPLOAD_LINK = 19
  COL_ADDRESS = 7                  COL_LAST_FILE_LINK = 20
  COL_CITY = 8                     COL_LAST_UPLOAD_AT = 21
  COL_STATE = 9                    COL_LAST_QUESTIONNAIRE_LINK = 22
  COL_ZIP = 10                     COL_LAST_QUESTIONNAIRE_AT = 23
  COL_PHONE = 11                   COL_VISIT_STATUS = 32
  COL_EMAIL = 12                   COL_NOTE = 36
  COL_DOB = 13                     COL_NOTE_TIMESTAMP = 37
                                   COL_PORTAL_TOKEN = 64

Certificate Column Constants:
  COL_CERTIFICATE_COMMENTS = 50    (Column AX)
  COL_CERTIFICATE_DECISION = 51    (Column AY)
  COL_APPROVE_CERTIFICATE = 52     (Column AZ)
  COL_CERTIFICATE_APPROVED_AT = 53 (Column BA)
  COL_CERTIFICATE_LINK = 54        (Column BB)


WEB APP PAGES:
--------------
1. Login Page (?token not present or invalid, and Users tab has data)
   - Animated PFC logo with scan effect
   - Username/password form with icons
   - Validates against Users tab
   - Creates session token on success
   - Redirects to booking page with token

2. Main Booking Page (default, or ?token=XXX)
   - Three-panel layout: Calendar | Time Slots | Booking Form
   - Calendar shows color-coded availability
   - Time slots show capacity (e.g., "3 / 8")
   - Form captures all patient details including Appointment Type
   - Reschedule banner appears when rescheduling
   - Duplicate patient modal when matching patient found
   - Booked appointments list below form with:
     - Patient name, email, time, appointment type
     - Vaccination upload status (✓Vacc / ✗Vacc)
     - Questionnaire status (✓Quest / ✗Quest)
     - Visit status (○ Pending / ✓ [status] / ✗ No-Show)
     - Editable notes field
     - Reschedule/Unbook buttons
   - Monthly appointments list below calendar
   - Settings modal for password change (if authenticated)
   - Logout button (if authenticated)

3. Patient Portal Page (?page=upload&portal=TOKEN)
   - Accessed via secure token-based link in confirmation email
   - Token is opaque UUID - no patient info visible in URL
   - Legacy support for ?page=upload&folderId=XXX&name=XXX (backward compatibility)
   - Progress section with completion bar
   - Expandable checklist items:
   - Vaccination Upload:
     - Shows patient name and existing file count
     - Drag-and-drop or click to upload vaccination proof
     - Displays last upload timestamp
     - Files prefixed with "Vaccination_Proof_" and saved to patient's Drive folder
   - Health Questionnaire:
     - Form with symptoms, allergies, medications, comments
     - Radio button selections with Yes/No options
     - Generates PDF of responses saved to patient's Drive folder
     - Shows completion status and timestamp
   - Completion banner when all tasks done


SERVER-SIDE FUNCTIONS:
----------------------
Entry Points:
  doGet(e)                    - Main router for all page requests

Authentication:
  isAuthenticationRequired()  - Checks if Users tab has valid credentials
  validateCredentials()       - Validates login, creates session token, handles lockout
  generateSessionToken()      - Creates random 32-char token
  storeSessionToken()         - Saves token to cache with expiration
  getSessionUsername()        - Retrieves username from token
  logoutSession()             - Removes token from cache
  performLogout()             - Logs out and returns login page HTML
  changePassword()            - Updates password in Users tab (with complexity check)
  validatePasswordComplexity() - Enforces HIPAA password requirements

Security & Lockout:
  isAccountLocked()           - Checks if account is locked due to failed attempts
  getFailedAttempts()         - Gets current failed login attempt count
  recordFailedAttempt()       - Increments failed attempts, triggers lockout if needed
  clearFailedAttempts()       - Resets failed attempt counter on successful login
  invalidateAllUserSessions() - Invalidates all sessions for a user (called on password change)
  isSessionInvalidated()      - Checks if sessions were invalidated after a timestamp

Input Validation:
  sanitizeParam()             - Sanitizes URL parameters (removes scripts, limits length)
  sanitizeForCalendar()       - Sanitizes data for calendar event descriptions
  escapeEmailHtml()           - Escapes HTML entities for email content
  escapeForHtml()             - Escapes HTML entities for page content
  Server-side validation in bookAppointment() for all form fields

HIPAA Audit Logging:
  logAuditEvent()             - Records audit trail entry for compliance
                                Parameters: action, username, patientId, details
                                Auto-creates AuditLog sheet if not exists

Data Retrieval:
  getAvailableSlots()         - Returns all future slots with availability
  getBookingsForDate()        - Returns bookings for a specific date (includes notes, upload status, visit status)
  getBookingsForMonth()       - Returns all bookings for a month (includes notes, upload status, visit status)
  getPatientDetails()         - Returns full patient record by ID
  findDchrRowByPatientId()    - Finds row number for a patient ID
  checkDuplicatePatient()     - Checks for existing patient by name+DOB
  getLastUploadTimestamp()    - Gets last upload time for a patient folder
  getBccEmailsFromUsers()     - Gets email addresses from Users tab column C
  getQuestionnaireStatus()    - Checks if questionnaire has been completed for a patient

Booking Operations:
  bookAppointment()           - Main booking function (new, reschedule, or reuse existing)
  unbookAppointment()         - Cancels appointment and sends notification
  removeBookingFromSlot()     - Removes booking link from Appointments tab

Utilities:
  generatePatientId()         - Creates next DCHR-XXXXXXX-ID
  getNextTestNumber()         - Increments test data counter
  getNextDchrRow()            - Finds next available row in DCHR tab
  combineDateTime()           - Merges date and time into single Date object
  authorizeScript()           - Triggers permission prompts for all services

Portal Token Management:
  lookupPatientByPortalToken() - Converts portal token to patient info (folderId, name, etc.)
  regeneratePortalToken()      - Generates new token for patient (invalidates old link)
  migrateExistingPatientsToPortalTokens() - One-time migration for existing patients

Certificate System:
  createOnEditTrigger()       - Sets up installable onEdit trigger
  onEditHandler()             - Watches for "Approve Certificate" in column AZ (52)
  generateCertificate()       - Creates PDF and saves to patient folder
  generateCertificateHtml()   - Returns HTML template for certificate

File Upload & Questionnaire:
  uploadFile()                - Saves uploaded vaccination file to patient's Drive folder
  updateLastFileLink()        - Updates DCHR with file URL and timestamp
  saveQuestionnaire()         - Generates questionnaire PDF and saves to patient folder
  generateQuestionnaireHtml() - Returns HTML template for questionnaire PDF

Patient Notes:
  savePatientNote()           - Saves or updates note for a patient with timestamp

HTML Generators:
  getLoginPageHtml()          - Returns login page HTML with animated logo
  getBookingPageHtml()        - Returns main booking interface HTML
  getUploadPageHtml()         - Returns Patient Portal page HTML


IMPORTANT BEHAVIORS:
--------------------
Booking Operations:
- Booking a new patient: Creates folder, generates ID, adds to DCHR, sends email, logs audit
- Rescheduling: Removes from old slot, adds to new slot, updates DCHR, sends email, logs audit
- Rebooking existing patient: Uses existing folder/ID, updates DCHR fields, sends email, logs audit
- Unbooking: Verifies ownership, removes from slot, clears fields, sends email, logs audit
- Duplicate detection: Matches on First Name + Last Name + DOB (case-insensitive names)
- Calendar navigation: Limited to MONTHS_BACK (1) and MONTHS_AHEAD (2) from current month

Patient Data:
- Vaccination uploads: Files prefixed with "Vaccination_Proof_", saved to patient folder
- Questionnaire: Generates PDF, saves to folder, tracks completion, prevents duplicates
- Visit status: Displayed with visual indicators (red for No-Show)
- Notes: 500 character limit, tracks save/edit timestamps with username
- SSN masking: Only last 4 digits shown in UI during reschedule

Security & Sessions:
- Session tokens: Stored in CacheService, expire after 15 minutes (HIPAA)
- Custom domain support: Login redirects use CUSTOM_DOMAIN_URL if configured
- Logout URL cleanup: postMessage used to remove token from parent frame URL on logout
- Session invalidation: All sessions invalidated on password change (forces re-auth everywhere)
- Session data: Includes creation timestamp for invalidation checks
- Auto-logout: Client-side logout after 15 minutes inactivity with 2-minute warning
- Login lockout: 5 failed attempts triggers 15-minute account lockout
- Password requirements: 8+ chars, upper, lower, number, special character
- Request cancellation: Uses incrementing request IDs to ignore stale async responses
- Clickjacking protection: Client-side frame-busting (ALLOWALL required by Google Apps Script infrastructure)

HIPAA Compliance:
- Audit logging: All PHI access/modifications logged with who/what/when
  - Covers: logins, patient views, bookings, uploads, notes, certificates
  - Logs unauthorized access attempts
- Input sanitization: All user input escaped before rendering in HTML/PDFs/emails/calendar
- Server-side validation: All inputs validated server-side regardless of client validation
  - Email, phone, SSN, zip code format validation
  - Date validity, appointment type, gender validation
  - Note length enforcement (500 char max)
- Ownership verification: Patient/appointment ownership verified before mutations
  - Folder ID validated against patient records before file upload
  - Certificate generation requires user authorization
- Error handling: Try-catch on external services, errors logged without exposing PHI
  - Error messages sanitized to prevent PHI leakage
- Minimum necessary: SSN masked (last 4 only), full SSN never sent to client
- Race condition protection: LockService used for concurrent booking operations
- File upload security:
  - File type validation (images, PDF, Word docs only)
  - File size limit (10MB max)
  - Folder ownership verification
- URL parameter security:
  - All parameters sanitized (script tags, javascript: removed)
  - Page parameter validated against whitelist
  - Folder ID format validation (alphanumeric only)
- Test mode protection: Test data functions require explicit flag in spreadsheet


SECURITY MEASURES IMPLEMENTED:
------------------------------
| Threat                    | Mitigation                                                          |
|---------------------------|---------------------------------------------------------------------|
| XSS (Cross-Site Script)   | HTML escaping on all user input before DOM insertion                |
|                           | - Patient names escaped in booking page, emails, calendar events    |
|                           | - Notes fully escaped with all HTML entities (&, <, >, ", ')        |
|                           | - URL parameters (patientName, folderId) sanitized in doGet()       |
|                           | - Username escaped before insertion into JavaScript                 |
| HTML Injection in PDFs    | Input sanitization in certificate/questionnaire PDFs                |
| Email Injection           | Patient names/data escaped before insertion into email HTML         |
| Calendar Event Injection  | Patient data sanitized, HTML tags and javascript: removed           |
| Clickjacking              | Client-side frame-busting (Google Apps Script requires ALLOWALL)    |
| Unauthorized access       | Server-side ownership verification before mutations                 |
|                           | - Folder ID validated against patient records before file upload    |
|                           | - Certificate generation requires authorized user in Users tab      |
| Session hijacking         | Short session timeout (15 min), secure token generation             |
|                           | - All sessions invalidated on password change                       |
|                           | - Session creation timestamp tracked for invalidation checks        |
| Brute force login         | Account lockout after 5 failed attempts (15 min lockout)            |
| Weak passwords            | Complexity requirements enforced (8+ chars, upper, lower, num, special) |
| Idle session exploit      | Client-side auto-logout after 15 minutes of inactivity              |
| Missing audit trail       | Comprehensive logging of all PHI access/modifications               |
|                           | - Logged: logins, logouts, bookings, reschedules, cancellations     |
|                           | - Logged: patient views, file uploads, questionnaire submissions    |
|                           | - Logged: note updates, certificate generation, duplicate detection |
|                           | - Logged: session invalidations, unauthorized access attempts       |
| Data over-exposure        | SSN masked (last 4 only), full SSN never sent to client             |
|                           | - Minimum necessary data in API responses                           |
| Silent failures           | Try-catch with meaningful error responses                           |
|                           | - Error messages sanitized to prevent PHI leakage in logs           |
| Duplicate submissions     | State validation before mutations                                   |
|                           | - Questionnaire completion checked before allowing resubmission     |
| Race conditions           | LockService used for concurrent booking protection                  |
| URL Parameter Injection   | All URL parameters sanitized and validated against allowed values   |
|                           | - Folder ID format validated (alphanumeric, dash, underscore only)  |
|                           | - Page parameter validated against whitelist                        |
| File Upload Abuse         | File type validation (images, PDF, Word docs only)                  |
|                           | - File size limit enforced (10MB max)                               |
|                           | - Folder ownership verified before accepting uploads                |
| Input Validation Bypass   | Server-side validation of all form inputs                           |
|                           | - Email, phone, SSN, zip code format validation                     |
|                           | - Date validity checks, future DOB prevention                       |
|                           | - Appointment type and gender against allowed values                |
|                           | - Note length enforced server-side (500 char max)                   |
| Test Data Exposure        | Test data functions require explicit ENABLE_TEST_MODE flag          |

HIPAA COMPLIANCE NOTES:
-----------------------
This application implements technical safeguards required by HIPAA Security Rule:

§164.312(a)(1) - Access Control
  ✓ Unique user identification (username/password)
  ✓ Automatic logoff (15-minute session timeout + inactivity logout)
  ✓ Account lockout after failed login attempts
  ✓ Role-based access for certificate generation (Users tab authorization)
  ✓ Patient Portal folder access validated against patient records

§164.312(b) - Audit Controls
  ✓ Comprehensive audit logging of all PHI access
  ✓ Logs include: who, what, when, and action details
  ✓ Audit log sheet protected from modification (editors removed)
  ✓ Logged events include:
    - LOGIN_SUCCESS, LOGIN_FAILED, LOGIN_BLOCKED, LOGOUT
    - ACCOUNT_LOCKED, PASSWORD_CHANGE, SESSION_INVALIDATED
    - CREATE_BOOKING, RESCHEDULE, REBOOK_EXISTING, CANCEL_BOOKING
    - VIEW_PATIENT, VIEW_DAILY_BOOKINGS, VIEW_MONTHLY_BOOKINGS
    - FILE_UPLOAD, QUESTIONNAIRE_SUBMIT, UPDATE_NOTE
    - GENERATE_CERTIFICATE, DUPLICATE_CHECK_MATCH
    - UNAUTHORIZED_CERTIFICATE_ATTEMPT

§164.312(c)(1) - Integrity
  ✓ Input validation prevents data corruption
  ✓ Server-side validation of all data (never trust client)
  ✓ Race condition protection via LockService
  ✓ State validation before mutations (capacity checks, ownership verification)

§164.312(d) - Person or Entity Authentication
  ✓ Password authentication with complexity requirements
  ✓ Session tokens for authenticated requests
  ✓ Session invalidation on password change (forces re-auth on all devices)
  ✓ Certificate generation requires authorized user verification

§164.312(e)(1) - Transmission Security
  ✓ Google Apps Script uses HTTPS for all communications
  ✓ Data encrypted in transit by Google
  ✓ Clickjacking protection (client-side frame-busting; see note below)

§164.308(a)(5)(ii)(C) - Log-in Monitoring
  ✓ Failed login attempts tracked and logged
  ✓ Account lockout after 5 failed attempts
  ✓ Lockout events logged for security review

§164.308(a)(5)(ii)(D) - Password Management
  ✓ Password complexity requirements enforced
  ✓ Password changes logged
  ✓ Sessions invalidated on password change

ADDITIONAL REQUIREMENTS (Administrative):
- Ensure Google Workspace Business Associate Agreement (BAA) is in place
- Conduct regular access reviews of who can access the spreadsheet
- Document staff HIPAA training
- Perform annual security risk assessments
- Maintain incident response procedures
- Review audit logs regularly for suspicious activity
- Test account lockout and session timeout functionality periodically


KNOWN LIMITATIONS / FUTURE SECURITY IMPROVEMENTS:
-------------------------------------------------
The following items document architectural limitations and recommended enhancements.
They should be prioritized based on risk assessment.

0. CLICKJACKING PROTECTION (Architectural Limitation - Mitigated)
   Status: MITIGATED with client-side frame-busting
   Limitation: Google Apps Script web apps REQUIRE XFrameOptionsMode.ALLOWALL to function.
               Using SAMEORIGIN or DEFAULT causes "refused to connect" errors because
               Google's infrastructure embeds the app in iframes on script.google.com.
   Mitigation: Client-side frame-busting script added to login, booking, and upload pages
               that detects unauthorized framing and breaks out. Allows Google's legitimate
               embedding (script.google.com, docs.google.com, drive.google.com).
   Residual Risk: Client-side protection can be bypassed if JavaScript is disabled.
                  This is an accepted limitation of the Google Apps Script platform.

1. PASSWORD HASHING (High Priority)
   Current: Passwords stored in plain text in Users spreadsheet tab
   Recommended: Hash passwords using Utilities.computeDigest() with SHA-256 + salt
   Risk: If spreadsheet is compromised, all passwords are exposed
   Implementation Notes:
   - Store salt in separate column or prepend to hash
   - Update validateCredentials() to hash input before comparison
   - Add migration function to hash existing plain text passwords
   - Update changePassword() to store hashed values

2. PATIENT PORTAL AUTHENTICATION (Partially Addressed)
   Status: IMPROVED with opaque portal tokens
   Current: Portal URLs use secure UUID tokens instead of folder IDs
   - Patient name and folder ID no longer exposed in URL
   - Tokens can be regenerated if link is compromised
   - Server-side validation of tokens before any operations
   Remaining Recommendations:
   a) Token expiration: Add COL_PORTAL_TOKEN_EXPIRY, expire after appointment + 7 days
   b) Additional verification: Require DOB entry before accessing portal
   Risk: Reduced - tokens are opaque but link sharing still possible
   Implementation Notes for expiration:
   - Check token expiry in lookupPatientByPortalToken()
   - Auto-regenerate expired tokens on new bookings

3. CSRF PROTECTION (Medium Priority)
   Current: No CSRF tokens for state-changing operations
   Recommended: Generate per-session CSRF token, validate on all mutations
   Risk: Malicious site could trick logged-in user into performing actions
   Implementation Notes:
   - Generate CSRF token on login, store in session cache
   - Include token in hidden form field or custom header
   - Validate token server-side before bookAppointment, unbookAppointment, etc.
   - Regenerate token after sensitive operations

4. RATE LIMITING (Medium Priority)
   Current: Limited rate limiting (file uploads and questionnaire submissions only)
   Recommended: Expand rate limiting using CacheService to all endpoints
   Risk: Brute force attacks, denial of service, resource exhaustion
   Implementation Notes:
   - Track requests per IP/session in CacheService
   - Limit login attempts (already done), bookings per session
   - Suggested limits: 10 bookings/hour per session
   - Return 429-equivalent error when exceeded

5. DATA RETENTION & AUTOMATED CLEANUP (Medium Priority)
   Current: Data retained indefinitely
   Recommended: Implement retention policy per HIPAA requirements
   Risk: Non-compliance with data retention regulations, storage bloat
   Implementation Notes:
   - Add scheduled trigger to archive/delete records older than retention period
   - Typical medical record retention: 6-10 years depending on jurisdiction
   - Archive to separate sheet/storage before deletion
   - Log all deletions in audit log
   - Exclude records involved in active legal holds

6. ENCRYPTION AT REST (Low Priority - Google Handles)
   Current: Relying on Google's default encryption
   Note: Google Workspace encrypts data at rest by default
   Consideration: For highly sensitive fields (SSN), consider application-level
   encryption using Utilities.base64Encode() with a separate key management strategy
   Trade-off: Complicates searching and reporting on encrypted fields

7. SESSION BINDING (Low Priority)
   Current: Session token only validated by existence in cache
   Recommended: Bind session to additional factors (user agent, IP prefix)
   Risk: Token theft allows session hijacking
   Implementation Notes:
   - Store user agent hash with session token
   - Optionally store IP prefix (first 3 octets for IPv4)
   - Validate on each request, invalidate on mismatch


===================================================================================
*/

// Column where booking data starts in Appointments tab (Column I = 9)
const BOOKING_START_COL = 9;

// Number of columns per booking in Appointments tab (Link, Spacer)
const FIELDS_PER_BOOKING = 2;

// Row where patient data starts in DCHR_All_Categories tab (rows 1-4 are reserved)
const DCHR_START_ROW = 5;

// Google Drive folder ID where all patient folders will be created
// This is extracted from the folder URL: https://drive.google.com/drive/folders/THIS_PART
const PARENT_FOLDER_ID = '1phC3VZ-JamIki-Np48lf1NQlagJbSSsB';

// Custom domain URL (set to your domain if using a custom domain wrapper, otherwise leave empty)
// If empty, will use the default Google Apps Script URL
const CUSTOM_DOMAIN_URL = 'https://www.pfcassociates.org/dchrcalendar';

// Email address patients see as the sender (must be configured as "Send mail as" alias in the script owner's Gmail)
const SEND_FROM_EMAIL = 'notifications@pfcassociates.org';
const SEND_FROM_NAME = 'Notifications For DCHR Applicants';

// Minimum hours in advance required for booking
const MIN_HOURS_ADVANCE = 24;

// Portal token and case number columns (first two columns)
const COL_PORTAL_TOKEN = 1;   // Column A
const COL_CASE_NUMBER = 2;    // Column B

// Patient data columns
const COL_PATIENT_ID = 3;     // Column C
const COL_BOOKED_AT = 4;      // Column D
const COL_LAST_NAME = 5;      // Column E
const COL_FIRST_NAME = 6;     // Column F
const COL_GENDER = 7;         // Column G
const COL_SSN = 8;            // Column H
const COL_ADDRESS = 9;        // Column I
const COL_CITY = 10;          // Column J
const COL_STATE = 11;         // Column K
const COL_ZIP = 12;           // Column L
const COL_PHONE = 13;         // Column M
const COL_EMAIL = 14;         // Column N
const COL_DOB = 15;           // Column O
const COL_APPT_TYPE = 16;     // Column P
const COL_APPT_DATE = 17;     // Column Q
const COL_APPT_TIME = 18;     // Column R
const COL_LAST_BOOKED_AT = 19; // Column S
const COL_FOLDER_LINK = 40;   // Column AN
const COL_UPLOAD_LINK = 21;   // Column U
const COL_LAST_FILE_LINK = 22; // Column V
const COL_LAST_UPLOAD_AT = 23; // Column W

// Questionnaire columns
const COL_LAST_QUESTIONNAIRE_LINK = 24; // Column X
const COL_LAST_QUESTIONNAIRE_AT = 25;   // Column Y

const COL_PRIVACY_SIGNED_AT = 26;  // Column Z - Privacy Notice acknowledgement timestamp
const COL_PRIVACY_SIGNATURE = 27;  // Column AA - Privacy Notice signature
const COL_PRIVACY_PDF_LINK = 28;   // Column AB - Privacy Notice PDF link

// Visit status column
const COL_VISIT_STATUS = 34;  // Column AH

// Note columns
const COL_NOTE = 38;          // Column AL
const COL_NOTE_TIMESTAMP = 39; // Column AM

// Certificate data columns
const COL_ASSIGNED_MEDICAL_DIRECTOR = 52; // Column AZ
const COL_CERTIFICATE_COMMENTS = 53;  // Column BA
const COL_CERTIFICATE_DECISION = 54;  // Column BB

// Certificate approval columns
const COL_APPROVE_CERTIFICATE = 55;   // Column BC
const COL_CERTIFICATE_APPROVED_AT = 56; // Column BD
const COL_CERTIFICATE_LINK = 57;      // Column BE
const COL_COMBINED_PDF_LINK = 63;     // Column BK

// Session token expiration (in seconds) - reduced to 15 minutes for HIPAA compliance
const SESSION_EXPIRATION = 900;

// Audit log sheet name
const AUDIT_LOG_SHEET = 'AuditLog';

// =============================================================================
// PERFORMANCE OPTIMIZATION: Cache durations (in seconds)
// =============================================================================
const CACHE_SLOTS_DURATION = 30;        // Available slots cache (30 seconds)
const CACHE_AUTH_DURATION = 300;        // Auth required check cache (5 minutes)
const CACHE_BCC_DURATION = 300;         // BCC emails cache (5 minutes)
const CACHE_USERS_DURATION = 300;       // Users data cache (5 minutes)

/**
 * Global HTML escaping helper function to prevent XSS/injection
 * Use this when inserting user-provided data into HTML contexts (emails, PDFs, etc.)
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for HTML insertion
 */
function escapeHtmlGlobal(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Looks up patient information by portal token
 * Returns null if token not found or invalid
 * @param {string} portalToken - The portal token from URL
 * @returns {Object|null} - {folderId, patientName, patientId, row} or null
 */
function lookupPatientByPortalToken(portalToken) {
  // Validate token format (UUID format)
  if (!portalToken || typeof portalToken !== 'string' || !/^[a-f0-9-]{36}$/i.test(portalToken)) {
    return null;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    return null;
  }
  
  // Get data including portal token and patient info columns
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_PORTAL_TOKEN - 1] === portalToken) {
      const folderLink = data[i][COL_FOLDER_LINK - 1];
      const firstName = data[i][COL_FIRST_NAME - 1];
      const lastName = data[i][COL_LAST_NAME - 1];
      const patientId = data[i][COL_PATIENT_ID - 1];
      
      // Extract folderId from folder URL
      let folderId = null;
      if (folderLink) {
        const match = folderLink.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (match) {
          folderId = match[1];
        }
      }
      
      return {
        folderId: folderId,
        patientName: firstName + ' ' + lastName,
        patientId: patientId,
        row: DCHR_START_ROW + i
      };
    }
  }
  
  return null;
}

/**
 * Regenerates the portal token for a patient (for staff use when link is compromised)
 * @param {string} patientId - The patient ID
 * @param {string} token - Session token for authentication
 * @returns {Object} - {success, newToken, newPortalUrl, message}
 */
function regeneratePortalToken(patientId, token) {
  // Verify session
  const sessionCheck = verifySessionForAudit(token, true);
  if (!sessionCheck.valid) {
    return { success: false, message: sessionCheck.error };
  }
  const username = sessionCheck.username;
  
  // Validate patient ID format
  if (!patientId || !/^DCHR-\d{7}-ID$/.test(patientId)) {
    return { success: false, message: 'Invalid patient ID format.' };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  
  const dchrRow = findDchrRowByPatientId(patientId);
  if (dchrRow === -1) {
    return { success: false, message: 'Patient not found.' };
  }
  
  // Generate new token
  const newToken = Utilities.getUuid();
  
  // Update token in sheet
  dchrSheet.getRange(dchrRow, COL_PORTAL_TOKEN).setValue(newToken);
  
  // Generate new portal URL
  const newPortalUrl = 'https://www.pfcassociates.org/dchrpatientportal.html?portal=' + newToken;
  
  // Update the stored upload link
  dchrSheet.getRange(dchrRow, COL_UPLOAD_LINK).setValue(newPortalUrl);
  
  // Audit log
  logAuditEvent('REGENERATE_PORTAL_TOKEN', username, patientId, 'Portal token regenerated - old link invalidated');
  
  return { 
    success: true, 
    newToken: newToken,
    newPortalUrl: newPortalUrl,
    message: 'Portal token regenerated. Old link is now invalid.'
  };
}

/**
 * Migration script: Generate portal tokens for all existing patients
 * Run this once after deploying the portal token feature
 */
function migrateExistingPatientsToPortalTokens() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    Logger.log('No patients to migrate.');
    return { migrated: 0, skipped: 0 };
  }
  
  // Get all patient data
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  
  let migrated = 0;
  let skipped = 0;
  
  for (let i = 0; i < data.length; i++) {
    const existingToken = data[i][COL_PORTAL_TOKEN - 1];
    const folderLink = data[i][COL_FOLDER_LINK - 1];
    const firstName = data[i][COL_FIRST_NAME - 1];
    const lastName = data[i][COL_LAST_NAME - 1];
    
    // Skip if already has a token or no folder link
    if (existingToken || !folderLink) {
      skipped++;
      continue;
    }
    
    // Generate new token
    const newToken = Utilities.getUuid();
    const actualRow = DCHR_START_ROW + i;
    
    // Update token
    dchrSheet.getRange(actualRow, COL_PORTAL_TOKEN).setValue(newToken);
    
    // Update portal URL (remove name from URL for privacy)
    const newPortalUrl = 'https://www.pfcassociates.org/dchrpatientportal.html?portal=' + newToken;
    dchrSheet.getRange(actualRow, COL_UPLOAD_LINK).setValue(newPortalUrl);
    
    migrated++;
    
    // Batch in groups of 50 to avoid timeout
    if (migrated % 50 === 0) {
      SpreadsheetApp.flush();
      Logger.log('Migrated ' + migrated + ' patients so far...');
    }
  }
  
  Logger.log('Migration complete. Migrated: ' + migrated + ', Skipped: ' + skipped);
  logAuditEvent('PORTAL_TOKEN_MIGRATION', 'System', 'N/A', 'Migrated ' + migrated + ' patients, skipped ' + skipped);
  
  return { migrated: migrated, skipped: skipped };
}

/**
 * Logs an audit event for HIPAA compliance
 * @param {string} action - The action performed (VIEW, CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.)
 * @param {string} username - The user who performed the action
 * @param {string} patientId - The patient ID affected (if applicable)
 * @param {string} details - Additional details about the action
 */
/**
 * PERFORMANCE: Queue audit events and write in batches to reduce spreadsheet calls
 * Events are stored in cache and flushed periodically or when queue is full
 */
const AUDIT_QUEUE_KEY = 'audit_log_queue';
const AUDIT_QUEUE_MAX_SIZE = 10;  // Flush after this many events
const AUDIT_QUEUE_MAX_AGE = 60;   // Flush after this many seconds

function logAuditEvent(action, username, patientId, details) {
  try {
    const cache = CacheService.getScriptCache();
    const tz = Session.getScriptTimeZone();
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, tz, 'yyyy-MM-dd HH:mm:ss');
    const sessionInfo = Session.getActiveUser().getEmail() || 'Anonymous';
    
    // Create the audit event
    const event = [
      formattedTimestamp,
      action,
      username || 'Unknown',
      patientId || 'N/A',
      details || '',
      sessionInfo
    ];
    
    // Get existing queue
    let queue = [];
    let queueAge = 0;
    const cachedQueue = cache.get(AUDIT_QUEUE_KEY);
    if (cachedQueue) {
      try {
        const parsed = JSON.parse(cachedQueue);
        queue = parsed.events || [];
        queueAge = timestamp.getTime() - (parsed.createdAt || timestamp.getTime());
      } catch (e) {
        queue = [];
      }
    }
    
    // Add new event
    queue.push(event);
    
    // Check if we should flush (queue full or old enough)
    const shouldFlush = queue.length >= AUDIT_QUEUE_MAX_SIZE || queueAge > (AUDIT_QUEUE_MAX_AGE * 1000);
    
    if (shouldFlush) {
      // Flush to spreadsheet
      flushAuditQueue(queue);
      cache.remove(AUDIT_QUEUE_KEY);
    } else {
      // Store updated queue
      const queueData = {
        events: queue,
        createdAt: cachedQueue ? JSON.parse(cachedQueue).createdAt : timestamp.getTime()
      };
      cache.put(AUDIT_QUEUE_KEY, JSON.stringify(queueData), AUDIT_QUEUE_MAX_AGE + 30);
    }
  } catch (error) {
    // Don't let audit logging failures break the application
    // Try direct write as fallback
    try {
      logAuditEventDirect(action, username, patientId, details);
    } catch (e) {
      Logger.log('Audit log error occurred. Error type: ' + (error ? error.name : 'unknown'));
    }
  }
}

/**
 * Flush queued audit events to spreadsheet in a single batch operation
 */
function flushAuditQueue(events) {
  if (!events || events.length === 0) return;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let auditSheet = ss.getSheetByName(AUDIT_LOG_SHEET);
  
  // Create audit log sheet if it doesn't exist
  if (!auditSheet) {
    auditSheet = ss.insertSheet(AUDIT_LOG_SHEET);
    auditSheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp', 'Action', 'Username', 'Patient ID', 'Details', 'IP/Session Info'
    ]]);
    auditSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    auditSheet.setFrozenRows(1);
    // Protect the audit log sheet - remove all editors except owner
    const protection = auditSheet.protect().setDescription('Audit Log - Protected for HIPAA Compliance');
    try {
      const editors = protection.getEditors();
      if (editors.length > 0) {
        protection.removeEditors(editors);
      }
      protection.setDomainEdit(false);
    } catch (e) {
      protection.setWarningOnly(true);
      Logger.log('Could not set strict audit log protection. Error type: ' + (e ? e.name : 'unknown'));
    }
  }
  
  // PERFORMANCE: Batch append all events at once
  const lastRow = auditSheet.getLastRow();
  auditSheet.getRange(lastRow + 1, 1, events.length, 6).setValues(events);
}

/**
 * Direct audit log write (fallback when queuing fails)
 */
function logAuditEventDirect(action, username, patientId, details) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let auditSheet = ss.getSheetByName(AUDIT_LOG_SHEET);
  
  if (!auditSheet) {
    auditSheet = ss.insertSheet(AUDIT_LOG_SHEET);
    auditSheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp', 'Action', 'Username', 'Patient ID', 'Details', 'IP/Session Info'
    ]]);
    auditSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    auditSheet.setFrozenRows(1);
  }
  
  const timestamp = new Date();
  const tz = Session.getScriptTimeZone();
  const formattedTimestamp = Utilities.formatDate(timestamp, tz, 'yyyy-MM-dd HH:mm:ss');
  const sessionInfo = Session.getActiveUser().getEmail() || 'Anonymous';
  
  auditSheet.appendRow([
    formattedTimestamp,
    action,
    username || 'Unknown',
    patientId || 'N/A',
    details || '',
    sessionInfo
  ]);
}

/**
 * Force flush any pending audit events (call this at end of critical operations)
 */
function forceFlushAuditQueue() {
  try {
    const cache = CacheService.getScriptCache();
    const cachedQueue = cache.get(AUDIT_QUEUE_KEY);
    if (cachedQueue) {
      const parsed = JSON.parse(cachedQueue);
      if (parsed.events && parsed.events.length > 0) {
        flushAuditQueue(parsed.events);
        cache.remove(AUDIT_QUEUE_KEY);
      }
    }
  } catch (e) {
    Logger.log('Force flush audit queue error: ' + (e ? e.name : 'unknown'));
  }
}

// Test data email (used by secret triple-click fill feature)
const TEST_DATA_EMAIL = 'fhoyos@pfcassociates.org';

/**
 * Validates file magic bytes match the claimed MIME type
 * Provides defense in depth against MIME type spoofing
 * @param {number[]} fileBytes - Decoded file bytes
 * @param {string} mimeType - Claimed MIME type
 * @returns {boolean} - True if magic bytes match or validation not applicable
 */
function validateFileMagicBytes(fileBytes, mimeType) {
  if (!fileBytes || fileBytes.length < 4) {
    return false;
  }
  
  // Convert first bytes to hex for comparison
  const getHex = (bytes, count) => {
    const result = [];
    for (let i = 0; i < Math.min(count, bytes.length); i++) {
      result.push(((bytes[i] & 0xFF) < 16 ? '0' : '') + (bytes[i] & 0xFF).toString(16).toLowerCase());
    }
    return result.join('');
  };
  
  const header = getHex(fileBytes, 8);
  
  // Magic byte signatures
  const signatures = {
    'image/jpeg': ['ffd8ff'],
    'image/png': ['89504e47'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'], // RIFF header (need to also check for WEBP at offset 8)
    'image/bmp': ['424d'],
    'application/pdf': ['25504446'], // %PDF
    'application/msword': ['d0cf11e0'], // OLE compound document
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['504b0304'] // ZIP (docx is zipped XML)
  };
  
  const expectedSignatures = signatures[mimeType];
  if (!expectedSignatures) {
    // Unknown MIME type - allow but log
    Logger.log('validateFileMagicBytes: No signature defined for MIME type: ' + mimeType);
    return true;
  }
  
  for (const sig of expectedSignatures) {
    if (header.startsWith(sig)) {
      // Additional check for WEBP (RIFF container needs WEBP at offset 8)
      if (mimeType === 'image/webp') {
        const webpCheck = getHex(fileBytes.slice(8, 12), 4);
        if (webpCheck !== '57454250') { // 'WEBP'
          return false;
        }
      }
      return true;
    }
  }
  
  return false;
}

// ================================================================================
// TRIGGER SETUP - Run this once to set up the onEdit trigger
// ================================================================================

function createOnEditTrigger() {
  // Remove any existing onEdit triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEditHandler') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create a new installable trigger
  ScriptApp.newTrigger('onEditHandler')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  
  Logger.log('onEdit trigger created successfully!');
}

// ================================================================================
// ON EDIT HANDLER - Watches for "Approve Certificate" in column AZ
// ================================================================================

function extractFileIdFromUrl(url) {
  if (!url) return null;
  const match = url.toString().match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function trashFileByUrl(url) {
  const fileId = extractFileIdFromUrl(url);
  if (fileId) {
    try {
      DriveApp.getFileById(fileId).setTrashed(true);
    } catch (e) {
      Logger.log('Could not trash file: ' + (e ? e.message : 'unknown'));
    }
  }
}



function getSignatureData(medicalDirectorName) {
  if (!medicalDirectorName) return { signatureBase64: null, officialName: null };
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dropdownsSheet = ss.getSheetByName('Dropdowns');
  if (!dropdownsSheet) {
    Logger.log('Dropdowns tab not found');
    return { signatureBase64: null, officialName: null };
  }
  
  var lastRow = dropdownsSheet.getLastRow();
  if (lastRow < 1) return { signatureBase64: null, officialName: null };
  
  var names = dropdownsSheet.getRange(1, 3, lastRow, 1).getValues();
  var targetRow = -1;
  
  for (var i = 0; i < names.length; i++) {
    if (names[i][0] && names[i][0].toString().trim().toLowerCase() === medicalDirectorName.toString().trim().toLowerCase()) {
      targetRow = i + 1;
      break;
    }
  }
  
  if (targetRow === -1) {
    Logger.log('Medical director name not found in Dropdowns tab: ' + medicalDirectorName);
    return { signatureBase64: null, officialName: null };
  }
  
  Logger.log('Found medical director at row ' + targetRow);
  
  // Get official name from column D
  var officialName = dropdownsSheet.getRange(targetRow, 4).getValue();
  officialName = officialName ? officialName.toString().trim() : null;
  Logger.log('Official name: ' + (officialName || 'not found'));
  
  // Get signature image from column E
  var signatureBase64 = null;
  
  try {
    var cell = dropdownsSheet.getRange(targetRow, 5);
    
    // Method 1: Try CellImage (in-cell image)
    var cellValue = cell.getValue();
    Logger.log('Cell value type: ' + typeof cellValue);
    Logger.log('Cell value toString: ' + (cellValue ? cellValue.toString().substring(0, 100) : 'null'));
    
    if (cellValue && typeof cellValue === 'object' && cellValue.getContentUrl) {
      var contentUrl = cellValue.getContentUrl();
      Logger.log('CellImage contentUrl found: ' + contentUrl.substring(0, 80));
      var imgResp = UrlFetchApp.fetch(contentUrl);
      signatureBase64 = Utilities.base64Encode(imgResp.getBlob().getBytes());
      return { signatureBase64: signatureBase64, officialName: officialName };
    }
    
    // Method 2: Try over-grid images
    var images = dropdownsSheet.getImages();
    Logger.log('Found ' + images.length + ' over-grid images');
    for (var j = 0; j < images.length; j++) {
      var img = images[j];
      var anchor = img.getAnchorCell();
      if (anchor.getRow() === targetRow && anchor.getColumn() === 5) {
        Logger.log('Matched over-grid image at row ' + targetRow);
        signatureBase64 = Utilities.base64Encode(img.getBlob().getBytes());
        return { signatureBase64: signatureBase64, officialName: officialName };
      }
    }
    
    // Method 3: Try IMAGE() formula
    var formula = cell.getFormula();
    Logger.log('Cell formula: ' + (formula || 'none'));
    if (formula && formula.toUpperCase().indexOf('IMAGE') > -1) {
      var urlMatch = formula.match(/IMAGE\s*\(\s*"([^"]+)"/i);
      if (urlMatch) {
        Logger.log('IMAGE formula URL: ' + urlMatch[1]);
        var imgResp2 = UrlFetchApp.fetch(urlMatch[1]);
        signatureBase64 = Utilities.base64Encode(imgResp2.getBlob().getBytes());
        return { signatureBase64: signatureBase64, officialName: officialName };
      }
    }
    
    // Method 4: Try Sheets API for in-cell image
    var token = ScriptApp.getOAuthToken();
    var ssId = ss.getId();
    var apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + ssId + 
                 '?ranges=Dropdowns!E' + targetRow + 
                 '&fields=sheets.data.rowData.values.userEnteredValue';
    var apiResp = UrlFetchApp.fetch(apiUrl, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    Logger.log('Sheets API response code: ' + apiResp.getResponseCode());
    var apiData = JSON.parse(apiResp.getContentText());
    Logger.log('Sheets API data: ' + JSON.stringify(apiData).substring(0, 500));
    
    try {
      var cellData = apiData.sheets[0].data[0].rowData[0].values[0];
      if (cellData && cellData.userEnteredValue && cellData.userEnteredValue.image) {
        var imgUrl = cellData.userEnteredValue.image.sourceUrl;
        Logger.log('Found image sourceUrl via API: ' + imgUrl);
        var imgResp3 = UrlFetchApp.fetch(imgUrl, {
          headers: { Authorization: 'Bearer ' + token },
          muteHttpExceptions: true
        });
        if (imgResp3.getResponseCode() === 200) {
          signatureBase64 = Utilities.base64Encode(imgResp3.getBlob().getBytes());
          return { signatureBase64: signatureBase64, officialName: officialName };
        }
      }
    } catch (parseErr) {
      Logger.log('API parse error: ' + parseErr.message);
    }
    
    Logger.log('All methods failed to extract signature image for row ' + targetRow);
    return { signatureBase64: signatureBase64, officialName: officialName };
    
  } catch (e) {
    Logger.log('getSignatureData error: ' + e.message);
    Logger.log('getSignatureData stack: ' + e.stack);
    return { signatureBase64: null, officialName: officialName };
  }
}

function exportPdfToImage(fileId, token) {
  // Method 1: Try Drive API thumbnail
  try {
    var resp = UrlFetchApp.fetch(
      'https://www.googleapis.com/drive/v3/files/' + fileId + '?fields=thumbnailLink',
      { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true }
    );
    var thumbLink = JSON.parse(resp.getContentText()).thumbnailLink;
    if (thumbLink) {
      var hiRes = thumbLink.replace(/=s\d+/, '=s2400');
      var imgResp = UrlFetchApp.fetch(hiRes);
      Logger.log('Thumbnail method succeeded for file: ' + fileId);
      return imgResp.getBlob();
    }
  } catch (e) {
    Logger.log('Thumbnail method failed for ' + fileId + ': ' + e.message);
  }
  
  // Method 2: Try export to PNG
  try {
    var resp2 = UrlFetchApp.fetch(
      'https://www.googleapis.com/drive/v3/files/' + fileId + '/export?mimeType=image/png',
      { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true }
    );
    if (resp2.getResponseCode() === 200) {
      Logger.log('Export to PNG succeeded for file: ' + fileId);
      return resp2.getBlob();
    }
  } catch (e2) {
    Logger.log('Export method failed for ' + fileId + ': ' + e2.message);
  }
  
  Logger.log('All image conversion methods failed for file: ' + fileId);
  return null;
}

function createMergedPdf(privacyFileId, certPdfBlob, folder, fileName) {
  Logger.log('createMergedPdf called - privacyFileId: ' + privacyFileId + ', fileName: ' + fileName);
  
  var token = ScriptApp.getOAuthToken();
  
  // Get privacy PDF as high-res image
  var privacyImageBlob = exportPdfToImage(privacyFileId, token);
  Logger.log('Got privacy image blob: ' + (privacyImageBlob ? 'yes' : 'no'));
  
  // Save cert PDF temporarily to get thumbnail
  var tempCertFile = DriveApp.createFile(certPdfBlob.setName('tempCert.pdf'));
  var tempCertId = tempCertFile.getId();
  Utilities.sleep(2000);
  
  var certImageBlob = exportPdfToImage(tempCertId, token);
  Logger.log('Got certificate image blob: ' + (certImageBlob ? 'yes' : 'no'));
  
  try {
    var privacyBase64 = privacyImageBlob ? Utilities.base64Encode(privacyImageBlob.getBytes()) : '';
    var certBase64 = certImageBlob ? Utilities.base64Encode(certImageBlob.getBytes()) : '';
    
    Logger.log('Privacy base64 length: ' + privacyBase64.length);
    Logger.log('Cert base64 length: ' + certBase64.length);
    
    var combinedHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      '@page { size: letter; margin: 0; } ' +
      '* { margin: 0; padding: 0; } ' +
      'body { margin: 0; padding: 0; } ' +
      '.page { width: 8.5in; height: 11in; page-break-after: always; overflow: hidden; position: relative; } ' +
      '.page:last-child { page-break-after: auto; } ' +
      '.page img { width: 8.5in; height: 11in; display: block; object-fit: fill; } ' +
      '</style></head><body>' +
      '<div class="page"><img src="data:image/png;base64,' + privacyBase64 + '" /></div>' +
      '<div class="page"><img src="data:image/png;base64,' + certBase64 + '" /></div>' +
      '</body></html>';
    
    Logger.log('Combined HTML length: ' + combinedHtml.length);
    
    var mergedPdfBlob = Utilities.newBlob(combinedHtml, 'text/html').getAs('application/pdf');
    mergedPdfBlob.setName(fileName);
    var mergedFile = folder.createFile(mergedPdfBlob);
    var mergedUrl = mergedFile.getUrl();
    
    Logger.log('Merged PDF created: ' + mergedUrl);
    
    // Cleanup
    tempCertFile.setTrashed(true);
    
    return mergedUrl;
    
  } catch (e) {
    Logger.log('createMergedPdf error: ' + e.message);
    Logger.log('createMergedPdf stack: ' + e.stack);
    try { tempCertFile.setTrashed(true); } catch (e2) {}
    throw e;
  }
}

function onEditHandler(e) {
  if (!e) return;
  
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Only process edits in DCHR_All_Categories sheet
  if (sheet.getName() !== 'DCHR_All_Categories') return;
  
  // If certificate link (BE) is cleared, delete files and clear related columns
  if (range.getColumn() === COL_CERTIFICATE_LINK) {
    const val = range.getValue();
    if (!val || val === '') {
      const r = range.getRow();
      // Delete certificate PDF from Drive
      if (e.oldValue) trashFileByUrl(e.oldValue);
      // Delete combined PDF from Drive and clear its cell
      const combinedUrl = sheet.getRange(r, COL_COMBINED_PDF_LINK).getValue();
      if (combinedUrl) {
        trashFileByUrl(combinedUrl);
        sheet.getRange(r, COL_COMBINED_PDF_LINK).setValue('');
      }
      // Clear timestamp
      sheet.getRange(r, COL_CERTIFICATE_APPROVED_AT).setValue('');
    }
    return;
  }

  // Only process edits in approve certificate column - check this FIRST before authorization
  if (range.getColumn() !== COL_APPROVE_CERTIFICATE) return;
  
  // Verify user is authorized to generate certificates
  // Only users listed in the Users tab can generate certificates
  const userEmail = Session.getActiveUser().getEmail();
  const ss_auth = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss_auth.getSheetByName('Users');
  
  // Default to unauthorized - must explicitly prove authorization
  let isAuthorized = false;
  
  if (!userEmail) {
    // Can't determine user identity - deny access for security
    // This can happen with certain script execution contexts
    Logger.log('Certificate generation denied: unable to verify user identity');
    logAuditEvent('UNAUTHORIZED_CERTIFICATE_ATTEMPT', 'Unknown', null, 'Certificate generation denied - unable to verify user identity');
    const ui = SpreadsheetApp.getUi();
    ui.alert('Authorization Required', 'Unable to verify your identity. Please ensure you are logged in to Google and try again.', ui.ButtonSet.OK);
    range.clearContent();
    return;
  }
  
  if (usersSheet) {
    const lastRow = usersSheet.getLastRow();
    if (lastRow > 1) {
      const userEmails = usersSheet.getRange(2, 5, lastRow - 1, 1).getValues();
      isAuthorized = userEmails.some(row => 
        row[0] && row[0].toString().toLowerCase() === userEmail.toLowerCase()
      );
    }
  }
  
  if (!isAuthorized) {
    // Log unauthorized attempt
    logAuditEvent('UNAUTHORIZED_CERTIFICATE_ATTEMPT', userEmail, null, 'Unauthorized certificate generation attempt');
    const ui = SpreadsheetApp.getUi();
    ui.alert('Unauthorized', 'You are not authorized to generate certificates.', ui.ButtonSet.OK);
    range.clearContent();
    return;
  }
  
  // Only process edits in data rows (row 5+)
  const row = range.getRow();
  if (!Number.isInteger(row) || row < DCHR_START_ROW) return;
  
  // Check if the value is "Approve Certificate"
  const value = range.getValue();
  if (value !== 'Approve Certificate') return;
  
  // row already declared above during validation
  
  // Validate row is within data bounds
  const lastRow = sheet.getLastRow();
  if (row > lastRow) {
    return; // Row is beyond data range
  }
  
  // Check if certificate was already generated
  const existingTimestamp = sheet.getRange(row, COL_CERTIFICATE_APPROVED_AT).getValue();
  if (existingTimestamp) {
    const patientIdForLog = sheet.getRange(row, COL_PATIENT_ID).getValue();
    logAuditEvent('CERTIFICATE_DUPLICATE_ATTEMPT', userEmail, patientIdForLog, 'Certificate already exists, generated on ' + existingTimestamp);
    const ui = SpreadsheetApp.getUi();
    ui.alert('Certificate Already Exists', 
      'A certificate was already generated on ' + existingTimestamp + '. To generate a new one, first clear the timestamp in column BA.', 
      ui.ButtonSet.OK);
    range.clearContent();
    return;
  }
  const rowData = sheet.getRange(row, 1, 1, COL_FOLDER_LINK).getValues()[0];
  const firstName = rowData[COL_FIRST_NAME - 1] || 'Unknown';
  const lastName = rowData[COL_LAST_NAME - 1] || 'Unknown';
  const patientId = rowData[COL_PATIENT_ID - 1] || 'Unknown ID';
  
  // Read required fields directly from the sheet (these columns are beyond the rowData range)
  const medDirectorCheck = sheet.getRange(row, COL_ASSIGNED_MEDICAL_DIRECTOR).getValue();
  const decisionCheck = sheet.getRange(row, COL_CERTIFICATE_DECISION).getValue();
  if (!medDirectorCheck || medDirectorCheck.toString().trim() === '') {
    const ui2 = SpreadsheetApp.getUi();
    ui2.alert('Missing Required Field', 'Column AZ (Assigned Medical Director) must be filled in before approving a certificate.', ui2.ButtonSet.OK);
    range.clearContent();
    return;
  }
  if (!decisionCheck || decisionCheck.toString().trim() === '') {
    const ui2 = SpreadsheetApp.getUi();
    ui2.alert('Missing Required Field', 'Column BB (Certificate Decision) must be filled in before approving a certificate.', ui2.ButtonSet.OK);
    range.clearContent();
    return;
  }

  // Show confirmation dialog
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Confirm Certificate Approval',
    'Are you sure you want to generate a certificate for:\n\n' +
    'Name: ' + firstName + ' ' + lastName + '\n' +
    'Patient ID: ' + patientId + '\n\n' +
    'This action will create a PDF certificate in the patient\'s folder.',
    ui.ButtonSet.YES_NO
  );
  
  // Clear the cell regardless of the response
  range.clearContent();
  
  // If user clicked YES, generate the certificate
  if (response === ui.Button.YES) {
    try {
      generateCertificate(sheet, row);
      ui.alert('Success', 'Certificate has been generated successfully for ' + firstName + ' ' + lastName + '.', ui.ButtonSet.OK);
    } catch (error) {
      // Log full error for debugging but show generic message to user
      Logger.log('Certificate generation error type: ' + (error ? error.name : 'unknown'));
      ui.alert('Error', 'Failed to generate certificate. Please try again or contact support.', ui.ButtonSet.OK);
    }
  } else {
    // User clicked NO or closed the dialog
    ui.alert('Cancelled', 'Certificate generation was cancelled.', ui.ButtonSet.OK);
  }
}

// ================================================================================
// CERTIFICATE GENERATION
// ================================================================================

function generateCertificate(sheet, row) {
  // Basic parameter validation (full validation after lock)
  if (!row || typeof row !== 'number' || !Number.isInteger(row) || row < DCHR_START_ROW) {
    throw new Error('Invalid row reference for certificate generation.');
  }
  
  // Use lock to prevent race condition if multiple users trigger simultaneously
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    throw new Error('System busy. Please try again.');
  }
  
  try {
    // Re-validate row bounds after acquiring lock (TOCTOU protection)
    const lastRow = sheet.getLastRow();
    if (row > lastRow) {
      lock.releaseLock();
      throw new Error('Invalid row reference for certificate generation.');
    }
    
    // Re-check for existing certificate after acquiring lock
    const existingTimestamp = sheet.getRange(row, COL_CERTIFICATE_APPROVED_AT).getValue();
    if (existingTimestamp) {
      lock.releaseLock();
      throw new Error('Certificate was already generated by another user.');
    }
    
    const tz = Session.getScriptTimeZone();
  
  // Get patient data from the row (need to get up to certificate decision column)
  const rowData = sheet.getRange(row, 1, 1, COL_CERTIFICATE_DECISION).getValues()[0];
  
  const firstName = rowData[COL_FIRST_NAME - 1];
  const lastName = rowData[COL_LAST_NAME - 1];
  const dob = rowData[COL_DOB - 1];
  const gender = rowData[COL_GENDER - 1];
  const appointmentDate = rowData[COL_APPT_DATE - 1];
  const folderUrl = rowData[COL_FOLDER_LINK - 1];
  const assignedMedicalDirector = rowData[COL_ASSIGNED_MEDICAL_DIRECTOR - 1] || '';
  const certificateComments = rowData[COL_CERTIFICATE_COMMENTS - 1] || '';
  const certificateDecision = rowData[COL_CERTIFICATE_DECISION - 1] || '';
  const privacyPdfUrl = rowData[COL_PRIVACY_PDF_LINK - 1] || '';
  
  // Validate required data
  if (!firstName || !lastName || !folderUrl) {
    throw new Error('Missing required patient data (First Name, Last Name, or Folder Link)');
  }
  
  // Extract folder ID from URL
  const folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (!folderIdMatch) {
    throw new Error('Invalid folder URL format');
  }
  const folderId = folderIdMatch[1];
  
  // Format dates
  const timestamp = new Date();
  const todayFormatted = Utilities.formatDate(timestamp, tz, 'MMMM d, yyyy');
  
  let dobFormatted = '';
  if (dob) {
    const dobDate = dob instanceof Date ? dob : new Date(dob);
    if (!isNaN(dobDate.getTime())) {
      dobFormatted = Utilities.formatDate(dobDate, tz, 'MM/dd/yyyy');
    }
  }
  
  let visitDateFormatted = '';
  if (appointmentDate) {
    const visitDate = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate);
    if (!isNaN(visitDate.getTime())) {
      visitDateFormatted = Utilities.formatDate(visitDate, tz, 'MM/dd/yyyy');
    } else {
      visitDateFormatted = appointmentDate.toString();
    }
  }
  
  // Generate full name for logging and file naming
  const fullName = firstName + ' ' + lastName;
  
  // Fetch company logo
  let logoBase64 = '';
  try {
    const logoFile = DriveApp.getFileById('1P9LUl-GevBr9M63HtqaOzxJIGdC5p8FN');
    logoBase64 = Utilities.base64Encode(logoFile.getBlob().getBytes());
    Logger.log('Logo loaded, base64 length: ' + logoBase64.length);
  } catch (logoErr) {
    Logger.log('Could not load logo: ' + (logoErr ? logoErr.message : 'unknown'));
  }

  // Look up signature and official name from Dropdowns tab
  const sigData = getSignatureData(assignedMedicalDirector);
  const signatureBase64 = sigData.signatureBase64;
  const officialName = sigData.officialName || assignedMedicalDirector;
  Logger.log('Signature image found: ' + (signatureBase64 ? 'yes (' + signatureBase64.length + ' chars)' : 'no'));
  Logger.log('Official name: ' + officialName);
  
  // Create certificate HTML
  const certificateHtml = generateCertificateHtml(firstName, lastName, dobFormatted, gender, visitDateFormatted, certificateDecision, certificateComments, todayFormatted, assignedMedicalDirector, signatureBase64, logoBase64, officialName);
  
  // Sanitize names for filename (remove special characters)
  const safeFileLastName = lastName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  const safeFileFirstName = firstName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  
  // Convert HTML to PDF
  const blob = Utilities.newBlob(certificateHtml, 'text/html', 'certificate.html');
  const pdfBlob = blob.getAs('application/pdf');
  // Get case number for filename
  const caseNumber = rowData[COL_CASE_NUMBER - 1] || '';
  const safeCaseNumber = caseNumber.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const dateForFile = Utilities.formatDate(timestamp, tz, 'yyyyMMdd');
  pdfBlob.setName('Certificate_' + safeFileLastName + '_' + safeFileFirstName + '_' + safeCaseNumber + '_' + dateForFile + '.pdf');
  
  // Save PDF to patient's folder
  let pdfUrl;
  const folder = DriveApp.getFolderById(folderId);
  try {
    const pdfFile = folder.createFile(pdfBlob);
    pdfUrl = pdfFile.getUrl();
  } catch (driveError) {
    // Log error type only - message may contain folder name with patient PHI
    Logger.log('Failed to save certificate PDF. Error type: ' + (driveError ? driveError.name : 'unknown'));
    throw new Error('Could not save certificate to patient folder. Please try again.');
  }
  
  // Update columns BD (timestamp) and BE (PDF link)
  sheet.getRange(row, COL_CERTIFICATE_APPROVED_AT).setValue(timestamp);
  sheet.getRange(row, COL_CERTIFICATE_LINK).setValue(pdfUrl);
  
  // Create merged PDF (Privacy Notice + Certificate) in column BK
  Logger.log('Privacy PDF URL value: "' + privacyPdfUrl + '"');
  if (privacyPdfUrl) {
    try {
      const privacyFileId = extractFileIdFromUrl(privacyPdfUrl);
      Logger.log('Extracted privacy file ID: ' + privacyFileId);
      if (privacyFileId) {
        const mergedFileName = 'Combined_' + safeFileLastName + '_' + safeFileFirstName + '_' + safeCaseNumber + '_' + dateForFile + '.pdf';
        // Get the certificate PDF blob from Drive (it was just saved above)
        const certFileId = extractFileIdFromUrl(pdfUrl);
        Utilities.sleep(3000); // Wait for Drive to fully process the certificate PDF
        const certPdfBlob = DriveApp.getFileById(certFileId).getBlob();
        const combinedFolder = DriveApp.getFolderById('16RjptLq35okWZR-V3S6mkIjWmcHzYh8H');
        const mergedUrl = createMergedPdf(privacyFileId, certPdfBlob, combinedFolder, mergedFileName);
        Logger.log('Merged PDF URL: ' + mergedUrl);
        sheet.getRange(row, COL_COMBINED_PDF_LINK).setValue(mergedUrl);
        Logger.log('Merged PDF link written to column BK');
      } else {
        Logger.log('Could not extract file ID from privacy URL');
      }
    } catch (mergeErr) {
      Logger.log('Merged PDF creation failed: ' + (mergeErr ? mergeErr.message : 'unknown'));
      Logger.log('Merge error stack: ' + (mergeErr ? mergeErr.stack : 'no stack'));
    }
  } else {
    Logger.log('No privacy PDF URL found - skipping merged PDF');
  }
  
  // Log for HIPAA compliance
  const patientId = rowData[COL_PATIENT_ID - 1];
  logAuditEvent('GENERATE_CERTIFICATE', Session.getActiveUser().getEmail(), patientId, 'Certificate generated: ' + pdfUrl);
  
  Logger.log('Certificate generated for patient ' + patientId + ': ' + pdfUrl);
  
  lock.releaseLock();
  
  } catch (error) {
    try { lock.releaseLock(); } catch (e) {}
    throw error;
  }
}

function generateCertificateHtml(firstName, lastName, dob, gender, visitDate, decision, comments, todayDate, medicalDirector, signatureBase64, logoBase64, officialName) {
  // Escape HTML to prevent injection
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeDob = escapeHtml(dob);
  const safeGender = escapeHtml(gender);
  const safeVisitDate = escapeHtml(visitDate);
  const safeDecision = escapeHtml(decision);
  const safeComments = escapeHtml(comments);
  const safeTodayDate = escapeHtml(todayDate);
  const safeMedicalDirector = escapeHtml(medicalDirector);
  const safeOfficialName = escapeHtml(officialName || medicalDirector);
  const fullName = safeFirstName + ' ' + safeLastName;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter portrait;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      width: 8.5in;
      height: 11in;
      padding: 0.5in;
      background: #fff;
    }
    
    .document {
      width: 100%;
      height: 100%;
      border: 2px solid #333;
      padding: 30px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 25px;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
    }
    
    .org-name {
      font-size: 28px;
      font-weight: bold;
      color: #1a5f7a;
      margin-bottom: 5px;
    }
    
    .org-address {
      font-size: 14px;
      color: #555;
      margin-bottom: 10px;
    }
    
    .doc-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 10px;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1a5f7a;
      text-transform: uppercase;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 10px;
    }
    
    .info-label {
      font-size: 12px;
      color: #666;
      font-weight: bold;
      width: 120px;
      flex-shrink: 0;
    }
    
    .info-value {
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #ccc;
      flex: 1;
      padding-bottom: 2px;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    .decision-section {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    
    .decision-label {
      font-size: 14px;
      font-weight: bold;
      color: #1a5f7a;
      margin-bottom: 8px;
    }
    
    .decision-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      padding: 10px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-height: 40px;
    }
    
    .comments-section {
      margin-bottom: 20px;
    }
    
    .comments-label {
      font-size: 14px;
      font-weight: bold;
      color: #1a5f7a;
      margin-bottom: 8px;
    }
    
    .comments-box {
      font-size: 13px;
      color: #333;
      padding: 12px;
      background: #fafafa;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-height: 100px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .signature-block {
      text-align: center;
    }
    
    .signature-line {
      width: 200px;
      border-top: 1px solid #333;
      margin-bottom: 5px;
    }
    
    .signature-label {
      font-size: 11px;
      color: #666;
    }
    
    .date-block {
      text-align: right;
    }
    
    .date-label {
      font-size: 11px;
      color: #666;
    }
    
    .date-value {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="document" style="position: relative;">
    <img src="data:image/png;base64,${logoBase64}" style="position: absolute; top: 20px; left: 20px; width: 90px; height: auto; z-index: 10;" />
    <div class="header">
      <div class="org-name">PFC Associates</div>
      <div class="org-address">920 Varnum St NE, Washington, DC 20017</div>
      <div class="doc-title">Medical Examination Certificate</div>
    </div>
    
    <div class="section">
      <div class="section-title">Patient Information</div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">First Name:</span>
          <span class="info-value">${safeFirstName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Last Name:</span>
          <span class="info-value">${safeLastName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date of Birth:</span>
          <span class="info-value">${safeDob}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Sex:</span>
          <span class="info-value">${safeGender}</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Visit Information</div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Visit Date:</span>
          <span class="info-value">${safeVisitDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Location:</span>
          <span class="info-value">PFC Associates</span>
        </div>
        <div class="info-row full-width">
          <span class="info-label">Address:</span>
          <span class="info-value">920 Varnum St NE, Washington, DC 20017</span>
        </div>
      </div>
    </div>
    
    <div class="decision-section">
      <div class="decision-label">Medical Director's Decision</div>
      <div class="decision-value">${safeDecision}</div>
    </div>
    
    <div class="comments-section">
      <div class="comments-label">Comments</div>
      <div class="comments-box">${safeComments}</div>
    </div>
    
    <div class="footer">
      <div class="signature-block">
        ${signatureBase64 
          ? '<div style="padding-bottom: 4px;"><img src="data:image/png;base64,' + signatureBase64 + '" style="max-width: 200px; max-height: 60px;" /></div>' 
          : '<div class="signature-line" style="padding-top: 4px; font-size: 16px; font-weight: bold; font-style: italic; color: #333;">' + safeMedicalDirector + '</div>'}
        <div style="width: 200px; border-top: 1px solid #333; margin-bottom: 5px;"></div>
        <div class="signature-label">${safeOfficialName}</div>
        <div class="signature-label">Medical Director's Signature</div>
      </div>
      
      <div class="date-block">
        <div class="date-label">Date Issued</div>
        <div class="date-value">${safeTodayDate}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// ================================================================================
// AUTHENTICATION FUNCTIONS
// ================================================================================

function isAuthenticationRequired() {
  // PERFORMANCE: Check cache first to avoid spreadsheet read
  const cache = CacheService.getScriptCache();
  const cacheKey = 'auth_required_check';
  const cached = cache.get(cacheKey);
  
  if (cached !== null) {
    return cached === 'true';
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let usersSheet = ss.getSheetByName('Users');
  
  // If Users tab doesn't exist, no auth required
  if (!usersSheet) {
    cache.put(cacheKey, 'false', CACHE_AUTH_DURATION);
    return false;
  }
  
  const lastRow = usersSheet.getLastRow();
  
  // If only header row or empty, no auth required
  if (lastRow <= 1) {
    cache.put(cacheKey, 'false', CACHE_AUTH_DURATION);
    return false;
  }
  
  // Check if there's at least one user with username and password
  const data = usersSheet.getRange(2, 1, lastRow - 1, 2).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][1]) {
      cache.put(cacheKey, 'true', CACHE_AUTH_DURATION);
      return true;
    }
  }
  
  cache.put(cacheKey, 'false', CACHE_AUTH_DURATION);
  return false;
}

// Maximum failed login attempts before lockout
const MAX_LOGIN_ATTEMPTS = 5;
// Lockout duration in seconds (15 minutes)
const LOCKOUT_DURATION = 900;

/**
 * Sanitizes username for use in cache keys
 * Prevents potential key collisions or injection
 */
function sanitizeUsernameForCache(username) {
  if (!username) return 'unknown';
  // Remove non-alphanumeric chars and limit length
  return username.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
}

function isAccountLocked(username) {
  const cache = CacheService.getScriptCache();
  const lockKey = 'auth_lockout_' + sanitizeUsernameForCache(username);
  return cache.get(lockKey) !== null;
}

function getFailedAttempts(username) {
  const cache = CacheService.getScriptCache();
  const attemptKey = 'auth_attempts_' + sanitizeUsernameForCache(username);
  const attempts = cache.get(attemptKey);
  return attempts ? parseInt(attempts) : 0;
}

function recordFailedAttempt(username) {
  const cache = CacheService.getScriptCache();
  const sanitizedUsername = sanitizeUsernameForCache(username);
  const attemptKey = 'auth_attempts_' + sanitizedUsername;
  const lockKey = 'auth_lockout_' + sanitizedUsername;
  
  const currentAttempts = getFailedAttempts(username) + 1;
  
  if (currentAttempts >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    cache.put(lockKey, 'locked', LOCKOUT_DURATION);
    cache.remove(attemptKey);
    logAuditEvent('ACCOUNT_LOCKED', username, null, 'Account locked after ' + MAX_LOGIN_ATTEMPTS + ' failed attempts');
    return true; // Account is now locked
  } else {
    // Store failed attempt count (expires after lockout duration)
    cache.put(attemptKey, currentAttempts.toString(), LOCKOUT_DURATION);
    return false;
  }
}

function clearFailedAttempts(username) {
  const cache = CacheService.getScriptCache();
  const attemptKey = 'auth_attempts_' + sanitizeUsernameForCache(username);
  cache.remove(attemptKey);
}

/**
 * Gets the current active session token for a user (single session enforcement)
 */
function getUserActiveToken(username) {
  const cache = CacheService.getScriptCache();
  const key = 'active_token_' + sanitizeUsernameForCache(username);
  return cache.get(key);
}

/**
 * Sets the current active session token for a user (single session enforcement)
 */
function setUserActiveToken(username, token) {
  const cache = CacheService.getScriptCache();
  const key = 'active_token_' + sanitizeUsernameForCache(username);
  cache.put(key, token, SESSION_EXPIRATION);
}

/**
 * Clears the active session token for a user
 */
function clearUserActiveToken(username) {
  const cache = CacheService.getScriptCache();
  const key = 'active_token_' + sanitizeUsernameForCache(username);
  cache.remove(key);
}

function validateCredentials(username, password) {
  // Basic input validation
  if (!username || !password) {
    return { success: false, message: 'Username and password are required.' };
  }
  
  // Limit username length to prevent abuse
  if (username.length > 100) {
    return { success: false, message: 'Invalid username.' };
  }
  
  // Limit password length (prevents DoS via very long password hashing in future)
  if (password.length > 200) {
    return { success: false, message: 'Invalid password.' };
  }
  
  // Check if account is locked
  if (isAccountLocked(username)) {
    logAuditEvent('LOGIN_BLOCKED', username, null, 'Login attempt while account locked');
    return { success: false, message: 'Account is temporarily locked due to too many failed attempts. Please try again in 15 minutes.' };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    return { success: false, message: 'Users sheet not found.' };
  }
  
  const lastRow = usersSheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: 'No users configured.' };
  }
  
  const data = usersSheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  for (let i = 0; i < data.length; i++) {
    const storedUsername = data[i][0].toString();
    const storedPassword = data[i][1];
    
    // Username comparison is case-insensitive, password uses constant-time comparison
    if (storedUsername.toLowerCase() === username.toLowerCase() && constantTimeCompare(storedPassword, password)) {
      // Clear failed login attempts on successful login
      clearFailedAttempts(username);
      
      // Single session enforcement: Check for existing active session
      let loggedOutExistingSession = false;
      const existingToken = getUserActiveToken(storedUsername);
      if (existingToken) {
        // Check if the existing token is still valid (session exists in cache)
        const cache = CacheService.getScriptCache();
        const existingSessionData = cache.get('session_' + existingToken);
        if (existingSessionData) {
          // There's an active session - we will invalidate it
          loggedOutExistingSession = true;
          logAuditEvent('SESSION_FORCED_LOGOUT', storedUsername, null, 'Existing session terminated due to new login from another location');
        }
      }
      
      // Invalidate all previous sessions (enforces single session)
      invalidateAllUserSessions(storedUsername);
      
      // Generate session token - use the stored username (preserves original case)
      const token = generateSessionToken();
      const tokenStored = storeSessionToken(token, storedUsername);
      
      if (!tokenStored) {
        Logger.log('validateCredentials: Failed to store session token');
        return { success: false, message: 'Session creation failed. Please try again.' };
      }
      
      // Store this as the active token for single session enforcement
      setUserActiveToken(storedUsername, token);
      
      // Log successful login for HIPAA compliance
      const loginDetails = loggedOutExistingSession 
        ? 'User logged in successfully (terminated existing session)' 
        : 'User logged in successfully';
      logAuditEvent('LOGIN_SUCCESS', storedUsername, null, loginDetails);
      
      // Get the URL to return to the client (use custom domain if configured)
      const baseUrl = CUSTOM_DOMAIN_URL || ScriptApp.getService().getUrl();
      
      return { success: true, token: token, redirectUrl: baseUrl + '?token=' + token, loggedOutExistingSession: loggedOutExistingSession };
    }
  }
  
  // Record failed attempt and check if account should be locked
  const isNowLocked = recordFailedAttempt(username);
  
  // Log failed login attempt for HIPAA compliance
  logAuditEvent('LOGIN_FAILED', username, null, 'Invalid credentials attempted');
  
  if (isNowLocked) {
    return { success: false, message: 'Account is temporarily locked due to too many failed attempts. Please try again in 15 minutes.' };
  }
  
  const remainingAttempts = MAX_LOGIN_ATTEMPTS - getFailedAttempts(username);
  return { success: false, message: 'Invalid username or password. ' + remainingAttempts + ' attempts remaining.' };
}

function generateSessionToken() {
  // Use Utilities.getUuid() for cryptographically stronger randomness
  // Combine two UUIDs and remove hyphens for a 64-char hex token
  const uuid1 = Utilities.getUuid().replace(/-/g, '');
  const uuid2 = Utilities.getUuid().replace(/-/g, '');
  return (uuid1 + uuid2).substring(0, 48);
}

function storeSessionToken(token, username) {
  // Validate token format for defense-in-depth (matches getSessionUsername validation)
  if (!token || typeof token !== 'string' || token.length < 32 || token.length > 64 || !/^[a-zA-Z0-9-]+$/.test(token)) {
    Logger.log('storeSessionToken: Invalid token format rejected');
    return false;
  }
  
  const cache = CacheService.getScriptCache();
  // Store username and creation timestamp for session invalidation checks
  const sessionData = JSON.stringify({
    username: username,
    createdAt: new Date().getTime()
  });
  cache.put('session_' + token, sessionData, SESSION_EXPIRATION);
  return true;
}

function getSessionUsername(token) {
  if (!token) return null;
  
  // Validate token format (alphanumeric, expected length)
  if (typeof token !== 'string' || token.length < 32 || token.length > 64 || !/^[a-zA-Z0-9-]+$/.test(token)) {
    Logger.log('Invalid session token format attempted');
    return null;
  }
  
  const cache = CacheService.getScriptCache();
  const sessionDataStr = cache.get('session_' + token);
  
  if (!sessionDataStr) return null;
  
  // Handle legacy sessions that just stored username string
  let username, createdAt;
  try {
    const sessionData = JSON.parse(sessionDataStr);
    username = sessionData.username;
    createdAt = sessionData.createdAt;
  } catch (e) {
    // Legacy format - just the username
    username = sessionDataStr;
    createdAt = 0; // Treat as very old session
  }
  
  // Check if sessions were invalidated after this session was created
  const invalidationTime = isSessionInvalidated(username);
  if (invalidationTime && createdAt < invalidationTime) {
    // Session was created before password change - invalidate it
    cache.remove('session_' + token);
    logAuditEvent('SESSION_INVALIDATED', username, null, 'Session invalidated due to password change');
    return null;
  }
  
  return username || null;
}

/**
 * Verifies session token and returns username, with optional auth requirement check
 * Use this in functions that need verified username for audit logging
 * @param {string} token - Session token from client
 * @param {boolean} allowUnauthenticated - If true, returns 'Unlogged User' when auth not required
 * @returns {object} - {valid: boolean, username: string, error: string}
 */
function verifySessionForAudit(token, allowUnauthenticated) {
  // Check if authentication is required
  const authRequired = isAuthenticationRequired();
  
  if (!authRequired && allowUnauthenticated) {
    return { valid: true, username: 'Unlogged User' };
  }
  
  if (!token) {
    if (!authRequired && allowUnauthenticated) {
      return { valid: true, username: 'Unlogged User' };
    }
    return { valid: false, username: null, error: 'Session required. Please log in.' };
  }
  
  const username = getSessionUsername(token);
  if (!username) {
    return { valid: false, username: null, error: 'Session expired. Please log in again.' };
  }
  
  return { valid: true, username: username };
}

function logoutSession(token) {
  if (!token) return;
  
  // Validate token format before using as cache key (consistent with getSessionUsername)
  if (typeof token !== 'string' || token.length < 32 || token.length > 64 || !/^[a-zA-Z0-9-]+$/.test(token)) {
    Logger.log('logoutSession: Invalid token format rejected');
    return;
  }
  
  // Get username before removing session to clear active token
  const username = getSessionUsername(token);
  
  const cache = CacheService.getScriptCache();
  cache.remove('session_' + token);
  
  // Clear the active token for this user (single session enforcement)
  if (username) {
    clearUserActiveToken(username);
  }
}

/**
 * Invalidates all sessions for a specific user
 * Called after password change to force re-authentication on all devices
 * Note: Due to CacheService limitations, we store a "sessions invalidated" timestamp
 * and check against it during session validation
 */
function invalidateAllUserSessions(username) {
  const cache = CacheService.getScriptCache();
  const invalidationKey = 'auth_sessions_invalidated_' + sanitizeUsernameForCache(username);
  // Store the current timestamp - any session created before this is invalid
  cache.put(invalidationKey, new Date().getTime().toString(), 86400); // 24 hour expiry
}

/**
 * Checks if a session was created before the user's sessions were invalidated
 */
function isSessionInvalidated(username) {
  const cache = CacheService.getScriptCache();
  const invalidationKey = 'auth_sessions_invalidated_' + sanitizeUsernameForCache(username);
  const invalidationTime = cache.get(invalidationKey);
  return invalidationTime ? parseInt(invalidationTime) : null;
}

function performLogout(token) {
  const username = getSessionUsername(token);
  logAuditEvent('LOGOUT', username, null, 'User logged out');
  
  // Invalidate ALL sessions for this user (logs out all devices/tabs)
  if (username) {
    invalidateAllUserSessions(username);
  }
  
  logoutSession(token);
  return getLoginPageHtml();
}

/**
 * Returns a redirect page that navigates to the booking page with the token.
 * Using a meta refresh and JavaScript redirect instead of document.write()
 * because document.write() breaks google.script.run communication.
 */
function getBookingPageForToken(token) {
  const authRequired = isAuthenticationRequired();
  const sessionUsername = getSessionUsername(token);
  
  if (authRequired && !sessionUsername) {
    return getLoginPageHtml();
  }
  
  // Get the URL for redirect (use custom domain if configured)
  const baseUrl = CUSTOM_DOMAIN_URL || ScriptApp.getService().getUrl();
  const redirectUrl = baseUrl + '?token=' + encodeURIComponent(token);
  
  // Return a simple page that redirects properly
  // This allows Google Apps Script to serve the booking page fresh with proper runtime
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0e14;
      color: white;
    }
    .loading {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <div>Loading dashboard...</div>
  </div>
  <script>
    // Use top-level navigation to break out of iframe context issues
    try {
      if (window.top && window.top.location) {
        window.top.location.href = '${redirectUrl}';
      } else {
        window.location.href = '${redirectUrl}';
      }
    } catch(e) {
      // Cross-origin restriction - try regular navigation
      window.location.href = '${redirectUrl}';
    }
  </script>
</body>
</html>
  `;
}

/**
 * Checks if the current session is still valid
 * Called periodically by client to detect logout from other sessions
 * @param {string} token - Session token
 * @returns {object} - {valid: boolean, reason: string}
 * Reasons: 'no_token', 'session_expired' (natural timeout), 'other_session' (forced logout)
 */
function checkSessionValidity(token) {
  if (!token) {
    return { valid: false, reason: 'no_token' };
  }
  
  // Validate token format
  if (typeof token !== 'string' || token.length < 32 || token.length > 64 || !/^[a-zA-Z0-9-]+$/.test(token)) {
    return { valid: false, reason: 'session_expired' };
  }
  
  const cache = CacheService.getScriptCache();
  const sessionDataStr = cache.get('session_' + token);
  
  // Session doesn't exist in cache - natural timeout
  if (!sessionDataStr) {
    return { valid: false, reason: 'session_expired' };
  }
  
  // Parse session data to check for forced invalidation
  let username, createdAt;
  try {
    const sessionData = JSON.parse(sessionDataStr);
    username = sessionData.username;
    createdAt = sessionData.createdAt;
  } catch (e) {
    // Legacy format - just the username
    username = sessionDataStr;
    createdAt = 0;
  }
  
  // Check if sessions were invalidated after this session was created (another login or password change)
  const invalidationTime = isSessionInvalidated(username);
  if (invalidationTime && createdAt < invalidationTime) {
    return { valid: false, reason: 'other_session' };
  }
  
  return { valid: true };
}

function unbookAppointment(patientId, appointmentRow, unbookedByUsername) {
  // Validate inputs
  if (!patientId || typeof patientId !== 'string' || !patientId.match(/^DCHR-\d{7}-ID$/)) {
    return { success: false, message: 'Invalid patient ID format.' };
  }
  
  const MAX_REASONABLE_ROW = 100000;
  if (!appointmentRow || typeof appointmentRow !== 'number' || appointmentRow < 2 || !Number.isInteger(appointmentRow) || appointmentRow > MAX_REASONABLE_ROW) {
    return { success: false, message: 'Invalid appointment reference.' };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const appointmentsSheet = ss.getSheetByName('Appointments');
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const tz = Session.getScriptTimeZone();
  
  // Validate appointmentRow against actual sheet bounds (must be after sheet is retrieved)
  const appointmentsLastRow = appointmentsSheet.getLastRow();
  if (appointmentRow > appointmentsLastRow) {
    return { success: false, message: 'Invalid appointment reference.' };
  }
  
  // Verify session and get authenticated username for audit
  // Note: unbookedByUsername parameter is now treated as token
  const sessionCheck = verifySessionForAudit(unbookedByUsername, true);
  if (!sessionCheck.valid) {
    return { success: false, message: sessionCheck.error };
  }
  const verifiedUsername = sessionCheck.username;
  
  // Use LockService to prevent race conditions on concurrent unbooking
  const lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) {
      return { success: false, message: 'System is busy. Please try again in a moment.' };
    }
  } catch (e) {
    return { success: false, message: 'Could not acquire lock. Please try again.' };
  }
  
  try {
  // Validate that this patient is actually booked in this slot
  const rowData = appointmentsSheet.getRange(appointmentRow, 1, 1, 100).getValues()[0];
  const booked = rowData[5] || 0;
  let patientFoundInSlot = false;
  
  for (let j = 0; j < booked; j++) {
    const colIndex = BOOKING_START_COL - 1 + (j * FIELDS_PER_BOOKING);
    const cellValue = rowData[colIndex];
    if (cellValue && cellValue.toString().includes(patientId)) {
      patientFoundInSlot = true;
      break;
    }
  }
  
  if (!patientFoundInSlot) {
    lock.releaseLock();
    return { success: false, message: 'Patient is not booked in this appointment slot.' };
  }
  
  // Get appointment details before removing
  const appointmentData = appointmentsSheet.getRange(appointmentRow, 1, 1, 3).getValues()[0];
  const appointmentDate = appointmentData[0];
  const appointmentStartTime = appointmentData[1];
  const appointmentEndTime = appointmentData[2];
  
  // Format appointment details for email
  // Format dates - these come from spreadsheet data, not user input, but escape for safety
  const formattedDate = escapeHtmlGlobal(Utilities.formatDate(new Date(appointmentDate), tz, 'EEEE, MMMM d, yyyy'));
  const formattedStart = escapeHtmlGlobal(Utilities.formatDate(new Date(appointmentStartTime), tz, 'h:mm a'));
  const formattedEnd = escapeHtmlGlobal(Utilities.formatDate(new Date(appointmentEndTime), tz, 'h:mm a'));
  
  // Find the patient row and get their details before clearing
  const dchrRow = findDchrRowByPatientId(patientId);
  
  if (dchrRow === -1) {
    lock.releaseLock();
    return { success: false, message: 'Could not find patient record.' };
  }
  
  // Get patient details for the email
  const patientData = dchrSheet.getRange(dchrRow, 1, 1, COL_UPLOAD_LINK).getValues()[0];
  const firstName = patientData[COL_FIRST_NAME - 1] || '';
  const lastName = patientData[COL_LAST_NAME - 1] || '';
  const email = patientData[COL_EMAIL - 1] || '';
  const fullName = firstName + ' ' + lastName;
  const safeFullName = escapeHtmlGlobal(fullName);
  
  // Remove the booking from the appointment slot
  const removed = removeBookingFromSlot(appointmentRow, patientId);
  
  if (!removed) {
    lock.releaseLock();
    return { success: false, message: 'Could not find the booking to remove.' };
  }
  
  // PERFORMANCE: Batch update - clear date/time and set cancellation note in one call
  const unbookedTimestamp = Utilities.formatDate(new Date(), tz, 'MM/dd/yyyy h:mm:ss a');
  const usernameSuffixVerified = ' by ' + verifiedUsername;
  const cancellationNote = 'Cancelled on ' + unbookedTimestamp + usernameSuffixVerified;
  
  // Update columns O, P, Q (date, time, last booked at) in a single operation
  dchrSheet.getRange(dchrRow, COL_APPT_DATE, 1, 3).setValues([['', '', cancellationNote]]);
  
  // Log for HIPAA compliance
  logAuditEvent('CANCEL_BOOKING', verifiedUsername, patientId, 'Cancelled appointment: ' + formattedDate + ' ' + formattedStart + ' - ' + formattedEnd);
  
  // Send cancellation email if patient has an email
  if (email) {
    const subject = 'Appointment Cancelled';
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Dear ${safeFullName},</p>
        
        <p>Your appointment has been <strong>cancelled</strong>.</p>
        
        <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #c62828;">Cancelled Appointment Details</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStart} - ${formattedEnd}</p>
        </div>
        
        <p>If you need to reschedule, please contact us or book a new appointment.</p>
        
        <p>Thank you!</p>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          This is an automated message. Please do not reply to this email.<br>
          For questions, please contact your Departmental Liaison.
        </p>
      </div>
    `;
    
    // Get CC and BCC emails from Users tab (skip for internal test email)
    const emailRecipients = getEmailRecipientsFromUsers();
    
    const gmailOptions = {
      htmlBody: htmlBody,
      from: SEND_FROM_EMAIL,
      name: SEND_FROM_NAME
    };
    
    const skipCcBcc = email && email.toLowerCase() === 'fhoyos@pfcassociates.org';
    
    // Add CC if there are any emails configured
    if (!skipCcBcc && emailRecipients.cc.length > 0) {
      gmailOptions.cc = emailRecipients.cc.join(',');
    }
    
    // Add BCC if there are any emails configured
    if (!skipCcBcc && emailRecipients.bcc.length > 0) {
      gmailOptions.bcc = emailRecipients.bcc.join(',');
    }
    
    // Send email - don't fail cancellation if email fails (consistent with bookAppointment)
    try {
      GmailApp.sendEmail(email, subject, '', gmailOptions);
    } catch (emailError) {
      // Log without exposing error details (may contain email address)
      Logger.log('Failed to send cancellation email. Error type: ' + (emailError ? emailError.name : 'unknown'));
      // Continue - email failure shouldn't undo successful cancellation
      // PERFORMANCE: Invalidate slots cache so other users see updated availability
      invalidateSlotsCache();
      lock.releaseLock();
      return { success: true, message: 'Appointment has been cancelled. (Note: Notification email could not be sent)' };
    }
  }
  
  // PERFORMANCE: Invalidate slots cache so other users see updated availability
  invalidateSlotsCache();
  
  lock.releaseLock();
  return { success: true, message: 'Appointment has been cancelled and notification sent.' };
  
  } catch (error) {
    // Ensure lock is released on error
    try { lock.releaseLock(); } catch (e) {}
    // Log error type only - message may contain PHI
    Logger.log('unbookAppointment error type: ' + (error ? error.name : 'unknown'));
    return { success: false, message: 'An error occurred while cancelling. Please try again.' };
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - True if strings are equal
 */
function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  // Use XOR comparison that always checks all characters
  let result = a.length === b.length ? 0 : 1;
  const len = Math.max(a.length, b.length);
  
  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  
  return result === 0;
}

/**
 * Validates password meets HIPAA-recommended complexity requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
function validatePasswordComplexity(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

function changePassword(username, currentPassword, newPassword, token) {
  // Validate username is provided
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return { success: false, message: 'Invalid request.' };
  }
  
  // Verify session token matches the username attempting password change
  const sessionUsername = getSessionUsername(token);
  if (!sessionUsername || sessionUsername.toLowerCase() !== username.toLowerCase()) {
    // Use session username if available, otherwise sanitize client-provided username for audit
    const auditUsername = sessionUsername || ('Unknown (claimed: ' + username.substring(0, 30).replace(/[^a-zA-Z0-9@._-]/g, '_') + ')');
    logAuditEvent('PASSWORD_CHANGE_DENIED', auditUsername, null, 'Session mismatch or invalid token');
    return { success: false, message: 'Session expired. Please log in again.' };
  }
  
  // Basic input validation
  if (!currentPassword || !newPassword) {
    return { success: false, message: 'Both current and new passwords are required.' };
  }
  
  // Prevent password from containing username
  if (newPassword.toLowerCase().includes(username.toLowerCase())) {
    return { success: false, message: 'Password cannot contain your username.' };
  }
  
  // Validate password complexity
  const complexityCheck = validatePasswordComplexity(newPassword);
  if (!complexityCheck.valid) {
    return { success: false, message: complexityCheck.message };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    return { success: false, message: 'Users sheet not found.' };
  }
  
  const lastRow = usersSheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: 'No users configured.' };
  }
  
  const data = usersSheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  for (let i = 0; i < data.length; i++) {
    const storedUsername = data[i][0].toString();
    const storedPassword = data[i][1];
    
    // Case-insensitive username match
    if (storedUsername.toLowerCase() === username.toLowerCase()) {
      // Verify current password (case-sensitive, constant-time comparison)
      if (!constantTimeCompare(storedPassword, currentPassword)) {
        return { success: false, message: 'Current password is incorrect.' };
      }
      
      // Update password in the sheet (row i + 2 because data starts at row 2)
      usersSheet.getRange(i + 2, 2).setValue(newPassword);
      
      // Invalidate all existing sessions for this user for security
      // This forces re-login on all devices after password change
      invalidateAllUserSessions(username);
      
      // Log password change for HIPAA compliance
      logAuditEvent('PASSWORD_CHANGE', username, null, 'Password changed - all sessions invalidated');
      
      return { success: true, message: 'Password changed successfully. You will need to log in again.' };
    }
  }
  
  return { success: false, message: 'User not found.' };
}

function getEmailRecipientsFromUsers() {
  // PERFORMANCE: Check cache first to avoid spreadsheet read
  const cache = CacheService.getScriptCache();
  const cacheKey = 'email_recipients_list';
  const cached = cache.get(cacheKey);
  
  if (cached !== null) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Cache corrupted, continue to fetch fresh
    }
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const usersSheet = ss.getSheetByName('Users');
  
  const emptyResult = { cc: [], bcc: [] };
  
  if (!usersSheet) {
    cache.put(cacheKey, JSON.stringify(emptyResult), CACHE_BCC_DURATION);
    return emptyResult;
  }
  
  const lastRow = usersSheet.getLastRow();
  if (lastRow <= 1) {
    cache.put(cacheKey, JSON.stringify(emptyResult), CACHE_BCC_DURATION);
    return emptyResult;
  }
  
  // Get columns C (CC) and D (BCC) for all user rows
  const data = usersSheet.getRange(2, 3, lastRow - 1, 2).getValues();
  
  const ccEmails = [];
  const bccEmails = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  for (let i = 0; i < data.length; i++) {
    // Column C - CC emails
    const ccEmail = data[i][0];
    if (ccEmail && ccEmail.toString().trim() !== '') {
      const ccEmailStr = ccEmail.toString().trim();
      if (emailRegex.test(ccEmailStr) && ccEmailStr.length <= 254) {
        ccEmails.push(ccEmailStr);
      } else {
        Logger.log('Invalid CC email format detected in Users tab row ' + (i + 2));
      }
    }
    
    // Column D - BCC emails
    const bccEmail = data[i][1];
    if (bccEmail && bccEmail.toString().trim() !== '') {
      const bccEmailStr = bccEmail.toString().trim();
      if (emailRegex.test(bccEmailStr) && bccEmailStr.length <= 254) {
        bccEmails.push(bccEmailStr);
      } else {
        Logger.log('Invalid BCC email format detected in Users tab row ' + (i + 2));
      }
    }
  }
  
  const result = { cc: ccEmails, bcc: bccEmails };
  
  // Cache the result
  cache.put(cacheKey, JSON.stringify(result), CACHE_BCC_DURATION);
  return result;
}

// Backward compatibility wrapper
function getBccEmailsFromUsers() {
  const recipients = getEmailRecipientsFromUsers();
  return recipients.bcc;
}

// ================================================================================
// MAIN ENTRY POINT - Handles login, booking page, and upload page
// ================================================================================

function doGet(e) {
  // Sanitize URL parameters
  const sanitizeParam = (param) => {
    if (!param) return null;
    // Remove potential script injection, limit length
    return param.toString()
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .substring(0, 500);
  };
  
  const page = sanitizeParam(e.parameter.page);
  const token = sanitizeParam(e.parameter.token);
  const action = sanitizeParam(e.parameter.action);
  
  // Validate page parameter against allowed values
  // Only 'upload' is a valid explicit page; empty/null means main booking page
  if (page && page !== 'upload') {
    return HtmlService.createHtmlOutput('<h1>Invalid page parameter</h1>')
      .setTitle('Error')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // UPLOAD PAGE: Accessed via ?page=upload&portal=TOKEN (new secure format)
  // Also supports legacy ?page=upload&folderId=XXX&name=XXX for backward compatibility
  // This is the link sent in confirmation emails for patients to upload documents
  if (page === 'upload') {
    const portalToken = sanitizeParam(e.parameter.portal);
    let folderId = null;
    let patientName = 'Patient';
    
    // Try portal token first (new secure method)
    if (portalToken) {
      const patientInfo = lookupPatientByPortalToken(portalToken);
      if (!patientInfo || !patientInfo.folderId) {
        return HtmlService.createHtmlOutput('<h1>Invalid or expired link</h1><p>This Patient Portal link is not valid. Please use the link from your most recent appointment confirmation email.</p>')
          .setTitle('Error')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
      folderId = patientInfo.folderId;
      patientName = patientInfo.patientName || 'Patient';
    } else {
      // Legacy support: folderId parameter (will be deprecated)
      folderId = sanitizeParam(e.parameter.folderId);
      patientName = sanitizeParam(e.parameter.name) || 'Patient';
      
      // Validate folderId format (Google Drive folder IDs are alphanumeric with - and _)
      const folderIdRegex = /^[a-zA-Z0-9_-]+$/;
      if (!folderId || !folderIdRegex.test(folderId)) {
        return HtmlService.createHtmlOutput('<h1>Invalid folder ID</h1>')
          .setTitle('Error')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
    }
    
    // Check how many files already exist in patient's folder
    // This is used to show "You have submitted X file(s)" message
    let existingFileCount = 0;
    let lastVaccinationFileName = '';
    try {
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFiles();
      let latestVaccFile = null;
      let latestVaccDate = null;
      while (files.hasNext()) {
        const file = files.next();
        existingFileCount++;
        const name = file.getName();
        if (name.startsWith('Vaccination_Proof_')) {
          const created = file.getDateCreated();
          if (!latestVaccDate || created > latestVaccDate) {
            latestVaccDate = created;
            latestVaccFile = name;
          }
        }
      }
      if (latestVaccFile) {
        lastVaccinationFileName = latestVaccFile;
      }
    } catch (err) {
      // Folder might not exist or be inaccessible
    }
    
    // Get last upload timestamp from spreadsheet
    const lastUploadInfo = getLastUploadTimestamp(folderId);
    
    // Get questionnaire status
    const questionnaireStatus = getQuestionnaireStatus(folderId);
    
    // Get privacy notice status
    const privacyStatus = getPrivacyNoticeStatus(folderId);
    
    // Get appointment info
    const appointmentInfo = getPatientAppointmentInfo(folderId);
    
    return HtmlService.createHtmlOutput(getUploadPageHtml(folderId, patientName, existingFileCount, lastUploadInfo, questionnaireStatus, privacyStatus, appointmentInfo, portalToken, lastVaccinationFileName))
      .setTitle('Upload Proof of Vaccination')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Check if authentication is required
  const authRequired = isAuthenticationRequired();
  
  // Handle logout action (fallback for direct URL access)
  if (action === 'logout' && token) {
    logoutSession(token);
  }
  
  // Get username from session (returns null if invalid/no token)
  const sessionUsername = getSessionUsername(token);
  
  // If auth is required and no valid session, show login page
  if (authRequired && !sessionUsername) {
    return HtmlService.createHtmlOutput(getLoginPageHtml())
      .setTitle('Login - PFC DCHR Appointment Scheduling')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // BOOKING PAGE: Main calendar interface for booking appointments
  // Either auth not required, or user has valid token
  const displayUsername = authRequired ? sessionUsername : null;
  const currentToken = authRequired ? token : null;
  
  return HtmlService.createHtmlOutput(getBookingPageHtml(displayUsername, currentToken))
    .setTitle('PFC - DCHR Appointment Scheduling')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ================================================================================
// LOGIN PAGE HTML
// ================================================================================

function getLoginPageHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_self">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      background: #0a0e14;
      overflow-x: hidden;
      overflow-y: auto;
      pointer-events: auto !important;
    }
    
    /* Left side - Hero panel */
    .hero-panel {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px;
      overflow: hidden;
      min-height: 0;
    }
    
    /* Dark gradient background with emergency services feel */
    .hero-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(135deg, #0a1628 0%, #1a2744 40%, #0d1f3c 100%);
      z-index: 0;
    }
    
    /* Subtle grid pattern overlay */
    .hero-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 1;
    }
    
    /* Red/blue accent lights - Police/Fire theme */
    .accent-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      z-index: 1;
    }
    
    .glow-red {
      width: 400px;
      height: 400px;
      background: #c41e3a;
      top: -100px;
      left: -100px;
      animation: pulseGlow 4s ease-in-out infinite;
    }
    
    .glow-blue {
      width: 350px;
      height: 350px;
      background: #1e5fc4;
      bottom: -80px;
      right: -80px;
      animation: pulseGlow 4s ease-in-out infinite 2s;
    }
    
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
    
    .hero-content {
      position: relative;
      z-index: 10;
      text-align: center;
      color: white;
      max-width: 500px;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.8);
      margin-top: 20px;
      backdrop-filter: blur(10px);
    }
    
    .badge-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: blink 2s infinite;
    }
    
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.4; }
    }
    
    .hero-logo {
      width: 200px;
      height: auto;
      margin-bottom: 25px;
      filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
    }
    
    .hero-logo-svg {
      width: 520px;
      max-width: 95%;
      height: auto;
      margin-bottom: 20px;
      flex-shrink: 0;
    }
    
    .hero-title {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #a8c0d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
    }
    
    .hero-divider {
      width: 120px;
      height: 3px;
      background: linear-gradient(90deg, #ef4444 0%, #22c55e 50%, #3b82f6 100%);
      border-radius: 2px;
      margin: 0 auto;
    }
    
    .hero-subtitle {
      font-size: 16px;
      font-weight: 400;
      color: rgba(255,255,255,0.7);
      line-height: 1.7;
      margin-bottom: 50px;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: white;
      display: block;
      line-height: 1;
      margin-bottom: 6px;
    }
    
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.5);
    }
    
    .hero-services {
      margin-top: 50px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .service-tag {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.75);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .service-tag svg {
      width: 16px;
      height: 16px;
      opacity: 0.7;
    }
    
    /* Right side - Login form */
    .login-panel {
      width: 480px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px 60px;
      background: #ffffff;
      position: relative;
    }
    
    .login-panel::before {
      content: '';
      position: absolute;
      top: 30px;
      bottom: 30px;
      left: 0;
      width: 4px;
      background: linear-gradient(180deg, #c41e3a 0%, #1e5fc4 100%);
      border-radius: 0 4px 4px 0;
    }
    
    .login-header {
      margin-bottom: 36px;
    }
    
    .login-logo {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .login-logo img {
      max-width: 180px;
      height: auto;
    }
    
    .login-eyebrow {
      font-size: 11px;
      font-weight: 700;
      color: #c41e3a;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .login-eyebrow::before {
      content: '';
      width: 20px;
      height: 2px;
      background: #c41e3a;
    }
    
    .login-title {
      font-size: 26px;
      font-weight: 700;
      color: #0a1628;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      line-height: 1.2;
    }
    
    .login-subtitle {
      font-size: 14px;
      color: #64748b;
      font-weight: 400;
      line-height: 1.5;
    }
    
    .form-group {
      margin-bottom: 20px;
      position: relative;
    }
    
    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #9ca3af;
      pointer-events: none;
    }
    
    .input-wrapper .form-input {
      padding-left: 44px;
    }
    
    .form-input {
      width: 100%;
      padding: 16px 18px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      transition: all 0.2s ease;
      background: #f9fafb;
    }
    
    .form-input:hover {
      border-color: #d1d5db;
      background: #fff;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #1e5fc4;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(30,95,196,0.1);
    }
    
    .form-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .form-input:not(:disabled) {
      pointer-events: auto !important;
      cursor: text;
    }
    
    .form-input::placeholder {
      color: #9ca3af;
    }
    
    .error-message {
      background: #fef2f2;
      color: #dc2626;
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 13px;
      font-weight: 500;
      display: none;
      border-left: 4px solid #dc2626;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .error-message.visible {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .error-message::before {
      content: '!';
      width: 20px;
      height: 20px;
      background: #dc2626;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .login-btn {
      width: 100%;
      padding: 18px 24px;
      background: linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.3px;
      margin-top: 8px;
    }
    
    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(10,22,40,0.3);
    }
    
    .login-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .login-btn:disabled {
      opacity: 0.8;
      cursor: not-allowed;
      transform: none;
    }
    
    .login-btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.7s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .login-footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-address {
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .footer-address strong {
      color: #374151;
      font-weight: 600;
    }
    
    .footer-secure {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #22c55e;
      font-weight: 600;
    }
    
    .footer-secure svg {
      width: 14px;
      height: 14px;
    }
    
    /* Mobile responsive - width */
    @media (max-width: 960px) {
      body {
        flex-direction: column;
      }
      
      .hero-panel {
        padding: 50px 30px;
        min-height: auto;
      }
      
      .hero-logo {
        width: 140px;
        margin-bottom: 20px;
      }
      
      .hero-title {
        font-size: 28px;
      }
      
      .hero-stats, .hero-services {
        display: none;
      }
      
      .login-panel {
        width: 100%;
        padding: 40px 30px;
        flex: 1;
      }
      
      .login-panel::before {
        display: none;
      }
      
      .accent-glow {
        opacity: 0.2;
      }
    }
    
    /* Vertical responsiveness - medium height */
    @media (max-height: 800px) {
      .hero-panel {
        padding: 30px 40px;
      }
      
      .hero-logo-svg {
        width: 480px;
        margin-bottom: 10px;
      }
      
      .hero-divider {
        margin: 10px auto;
      }
      
      .hero-badge {
        margin-top: 10px;
        padding: 6px 12px;
        font-size: 11px;
      }
      
      .hero-stats {
        margin-top: 30px;
        gap: 30px;
      }
      
      .stat-value {
        font-size: 26px;
      }
      
      .hero-services {
        margin-top: 30px;
      }
      
      .login-panel {
        padding: 40px 50px;
      }
      
      .login-header {
        margin-bottom: 24px;
      }
      
      .login-logo {
        margin-bottom: 16px;
      }
      
      .login-logo img {
        max-width: 150px;
      }
      
      .form-group {
        margin-bottom: 16px;
      }
      
      .form-input {
        padding: 14px 18px;
      }
      
      .input-wrapper .form-input {
        padding-left: 44px;
      }
      
      .login-btn {
        padding: 16px 24px;
      }
      
      .login-footer {
        margin-top: 30px;
        padding-top: 20px;
      }
    }
    
    /* Vertical responsiveness - short height */
    @media (max-height: 650px) {
      .hero-panel {
        padding: 20px 30px;
      }
      
      .hero-logo-svg {
        width: 420px;
        margin-bottom: 8px;
      }
      
      .hero-divider {
        width: 80px;
        height: 2px;
      }
      
      .hero-badge {
        margin-top: 8px;
        padding: 5px 10px;
        font-size: 10px;
      }
      
      .hero-stats, .hero-services {
        display: none;
      }
      
      .accent-glow {
        opacity: 0.25;
      }
      
      .login-panel {
        padding: 25px 40px;
      }
      
      .login-header {
        margin-bottom: 16px;
      }
      
      .login-logo {
        margin-bottom: 12px;
      }
      
      .login-logo img {
        max-width: 120px;
      }
      
      .login-eyebrow {
        font-size: 10px;
        margin-bottom: 8px;
      }
      
      .login-title {
        font-size: 22px;
        margin-bottom: 4px;
      }
      
      .login-subtitle {
        font-size: 13px;
      }
      
      .form-group {
        margin-bottom: 12px;
      }
      
      .form-label {
        font-size: 11px;
        margin-bottom: 5px;
      }
      
      .form-input {
        padding: 12px 14px;
        font-size: 14px;
      }
      
      .input-wrapper .form-input {
        padding-left: 40px;
      }
      
      .input-icon {
        width: 18px;
        height: 18px;
        left: 12px;
      }
      
      .login-btn {
        padding: 14px 20px;
        font-size: 14px;
        margin-top: 4px;
      }
      
      .login-footer {
        margin-top: 20px;
        padding-top: 16px;
      }
      
      .footer-address {
        font-size: 11px;
        margin-bottom: 8px;
      }
    }
    
    /* Very short screens / landscape phones */
    @media (max-height: 500px) {
      body {
        flex-direction: row;
      }
      
      .hero-panel {
        padding: 15px 20px;
        flex: 0 0 45%;
      }
      
      .hero-logo-svg {
        width: 340px;
        margin-bottom: 5px;
      }
      
      .hero-divider {
        width: 60px;
        margin: 5px auto;
      }
      
      .hero-badge {
        margin-top: 5px;
        padding: 4px 8px;
        font-size: 9px;
      }
      
      .login-panel {
        flex: 0 0 60%;
        width: 60%;
        padding: 20px 30px;
        overflow-y: auto;
      }
      
      .login-panel::before {
        display: block;
        top: 20px;
        bottom: 20px;
      }
      
      .login-header {
        margin-bottom: 12px;
      }
      
      .login-logo {
        margin-bottom: 10px;
      }
      
      .login-logo img {
        max-width: 100px;
      }
      
      .login-eyebrow {
        font-size: 9px;
        margin-bottom: 6px;
      }
      
      .login-title {
        font-size: 18px;
        margin-bottom: 4px;
      }
      
      .login-subtitle {
        font-size: 12px;
        display: none;
      }
      
      .form-group {
        margin-bottom: 10px;
      }
      
      .form-label {
        font-size: 10px;
        margin-bottom: 4px;
      }
      
      .form-input {
        padding: 10px 12px;
        font-size: 14px;
        border-radius: 8px;
      }
      
      .input-wrapper .form-input {
        padding-left: 36px;
      }
      
      .input-icon {
        width: 16px;
        height: 16px;
        left: 10px;
      }
      
      .error-message {
        padding: 10px 12px;
        font-size: 12px;
        margin-bottom: 12px;
      }
      
      .login-btn {
        padding: 12px 16px;
        font-size: 13px;
        margin-top: 2px;
        border-radius: 8px;
      }
      
      .login-footer {
        margin-top: 15px;
        padding-top: 12px;
      }
      
      .footer-address {
        font-size: 10px;
        line-height: 1.4;
        margin-bottom: 6px;
      }
      
      .footer-secure {
        font-size: 10px;
      }
    }
    
    /* Combined: narrow width AND short height (small phones) */
    @media (max-width: 960px) and (max-height: 700px) {
      body {
        flex-direction: column;
      }
      
      .hero-panel {
        padding: 20px;
        flex: 0 0 auto;
      }
      
      .hero-logo-svg {
        width: 380px;
        margin-bottom: 5px;
      }
      
      .hero-divider {
        width: 60px;
        margin: 5px auto;
      }
      
      .hero-badge {
        margin-top: 5px;
      }
      
      .login-panel {
        width: 100%;
        flex: 1;
        padding: 20px 25px;
        overflow-y: auto;
      }
    }
    
    /* Very small phones */
    @media (max-width: 400px) {
      .hero-panel {
        padding: 15px;
      }
      
      .hero-logo-svg {
        width: 320px;
      }
      
      .login-panel {
        padding: 20px;
      }
      
      .login-logo img {
        max-width: 100px;
      }
      
      .login-title {
        font-size: 20px;
      }
      
      .form-input {
        padding: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="hero-panel">
    <div class="accent-glow glow-red"></div>
    <div class="accent-glow glow-blue"></div>
    
    <div class="hero-content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" class="hero-logo-svg">
        <defs>
          <linearGradient id="techBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#06b6d4"/>
            <stop offset="50%" style="stop-color:#2563eb"/>
            <stop offset="100%" style="stop-color:#1e40af"/>
          </linearGradient>
          <linearGradient id="techRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f87171"/>
            <stop offset="50%" style="stop-color:#ef4444"/>
            <stop offset="100%" style="stop-color:#b91c1c"/>
          </linearGradient>
          <linearGradient id="emergencyRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ef4444"/>
            <stop offset="100%" style="stop-color:#dc2626"/>
          </linearGradient>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-opacity:0">
              <animate attributeName="stop-color" values="#ef4444;#ef4444;#3b82f6;#3b82f6" keyTimes="0;0.5;0.5;1" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="offset" values="-0.6;-0.6;1.4;1.4;-0.6" keyTimes="0;0.1;0.45;0.55;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>
            </stop>
            <stop offset="15%" style="stop-opacity:0.4">
              <animate attributeName="stop-color" values="#ef4444;#ef4444;#3b82f6;#3b82f6" keyTimes="0;0.5;0.5;1" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="offset" values="-0.45;-0.45;1.55;1.55;-0.45" keyTimes="0;0.1;0.45;0.55;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>
            </stop>
            <stop offset="30%" style="stop-opacity:0.6">
              <animate attributeName="stop-color" values="#ef4444;#ef4444;#3b82f6;#3b82f6" keyTimes="0;0.5;0.5;1" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="offset" values="-0.3;-0.3;1.7;1.7;-0.3" keyTimes="0;0.1;0.45;0.55;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>
            </stop>
            <stop offset="45%" style="stop-opacity:0.4">
              <animate attributeName="stop-color" values="#ef4444;#ef4444;#3b82f6;#3b82f6" keyTimes="0;0.5;0.5;1" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="offset" values="-0.15;-0.15;1.85;1.85;-0.15" keyTimes="0;0.1;0.45;0.55;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>
            </stop>
            <stop offset="60%" style="stop-opacity:0">
              <animate attributeName="stop-color" values="#ef4444;#ef4444;#3b82f6;#3b82f6" keyTimes="0;0.5;0.5;1" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="offset" values="0;0;2;2;0" keyTimes="0;0.1;0.45;0.55;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>
            </stop>
          </linearGradient>
          <filter id="blueGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="redGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g opacity="0.05">
          <line x1="0" y1="50" x2="500" y2="50" stroke="#fff" stroke-width="0.5"/>
          <line x1="0" y1="100" x2="500" y2="100" stroke="#fff" stroke-width="0.5"/>
          <line x1="0" y1="150" x2="500" y2="150" stroke="#fff" stroke-width="0.5"/>
          <line x1="0" y1="200" x2="500" y2="200" stroke="#fff" stroke-width="0.5"/>
          <line x1="100" y1="0" x2="100" y2="280" stroke="#fff" stroke-width="0.5"/>
          <line x1="200" y1="0" x2="200" y2="280" stroke="#fff" stroke-width="0.5"/>
          <line x1="300" y1="0" x2="300" y2="280" stroke="#fff" stroke-width="0.5"/>
          <line x1="400" y1="0" x2="400" y2="280" stroke="#fff" stroke-width="0.5"/>
        </g>
        <polygon points="250,20 380,55 380,125 250,160 120,125 120,55" fill="none" stroke="url(#techBlue)" stroke-width="2" opacity="0.4"/>
        <polygon points="250,30 365,60 365,120 250,150 135,120 135,60" fill="url(#scanGradient)" stroke="url(#techBlue)" stroke-width="1" opacity="0.6"/>
        <g filter="url(#blueGlow)">
          <!-- P letter -->
          <text x="193" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techBlue)" text-anchor="middle">P
            <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;0.19;0.25;0.81;0.87;1" dur="5s" repeatCount="indefinite"/>
          </text>
          <text x="193" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techRed)" text-anchor="middle">P
            <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.19;0.25;0.81;0.87;1" dur="5s" repeatCount="indefinite"/>
          </text>
          <!-- F letter -->
          <text x="250" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techBlue)" text-anchor="middle">F
            <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;0.22;0.28;0.77;0.83;1" dur="5s" repeatCount="indefinite"/>
          </text>
          <text x="250" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techRed)" text-anchor="middle">F
            <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.22;0.28;0.77;0.83;1" dur="5s" repeatCount="indefinite"/>
          </text>
          <!-- C letter -->
          <text x="307" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techBlue)" text-anchor="middle">C
            <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0;0.25;0.31;0.74;0.80;1" dur="5s" repeatCount="indefinite"/>
          </text>
          <text x="307" y="115" font-family="'Orbitron', 'Rajdhani', 'Audiowide', 'Segoe UI', sans-serif" font-size="70" font-weight="700" fill="url(#techRed)" text-anchor="middle">C
            <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.25;0.31;0.74;0.80;1" dur="5s" repeatCount="indefinite"/>
          </text>
        </g>
        <circle r="4" fill="#3b82f6" filter="url(#blueGlow)">
          <animateMotion dur="15s" repeatCount="indefinite">
            <mpath href="#orbitPath"/>
          </animateMotion>
        </circle>
        <path id="orbitPath" d="M250,20 L380,55 L380,125 L250,160 L120,125 L120,55 Z" fill="none" stroke="none"/>
        <circle r="3" fill="#ef4444" filter="url(#redGlow)">
          <animateMotion dur="15s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
            <mpath href="#orbitPath"/>
          </animateMotion>
        </circle>
        <circle cx="250" cy="20" r="3" fill="#3b82f6">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="380" cy="55" r="3" fill="#ef4444">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.33s"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.33s"/>
        </circle>
        <circle cx="380" cy="125" r="3" fill="#ef4444">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.66s"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="0.66s"/>
        </circle>
        <circle cx="250" cy="160" r="3" fill="#ef4444">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1s"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <circle cx="120" cy="125" r="3" fill="#3b82f6">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1.33s"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1.33s"/>
        </circle>
        <circle cx="120" cy="55" r="3" fill="#3b82f6">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="1.66s"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1.66s"/>
        </circle>
        <rect x="90" y="55" width="3" height="70" fill="url(#emergencyRed)" filter="url(#redGlow)"/>
        <rect x="407" y="55" width="3" height="70" fill="url(#techBlue)" filter="url(#blueGlow)"/>
        <text x="250" y="190" font-family="'Segoe UI', 'SF Pro Display', sans-serif" font-size="16" font-weight="600" letter-spacing="10" fill="#64748b" text-anchor="middle">ASSOCIATES LLC</text>
        <line x1="120" y1="205" x2="200" y2="205" stroke="#ef4444" stroke-width="1" opacity="0.6"/>
        <line x1="200" y1="205" x2="300" y2="205" stroke="#64748b" stroke-width="1" opacity="0.3"/>
        <line x1="300" y1="205" x2="380" y2="205" stroke="#2563eb" stroke-width="1" opacity="0.6"/>
        <g font-family="'Segoe UI', 'SF Pro Display', sans-serif" font-size="20" text-anchor="middle">
          <text x="175" y="240" font-weight="500" fill="#3b82f6">Police</text>
          <text x="230" y="240" font-weight="300" fill="#475569">&amp;</text>
          <text x="285" y="240" font-weight="500" fill="#ef4444">Fire</text>
          <text x="355" y="240" font-weight="400" fill="#94a3b8">Clinic</text>
        </g>
        <path d="M30 30 L30 50 M30 30 L50 30" stroke="url(#techBlue)" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M470 30 L470 50 M470 30 L450 30" stroke="url(#techBlue)" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M30 250 L30 230 M30 250 L50 250" stroke="url(#emergencyRed)" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M470 250 L470 230 M470 250 L450 250" stroke="url(#emergencyRed)" stroke-width="2" fill="none" opacity="0.5"/>
      </svg>
      
      </svg>
      <div class="hero-divider"></div>
      <div class="hero-badge">
        <span class="badge-dot"></span>
        Authorized Personnel Only
      </div>
      
    </div>
  </div>
  
  <div class="login-panel">
    <div class="login-header">
      <div class="login-logo">
        <img src="https://pfcassociates.org/PFC_images/PFC_LOGO_4.png" alt="PFC Associates Logo">
      </div>
      <div class="login-eyebrow">Staff Portal</div>
      <h2 class="login-title">Sign in to continue</h2>
      <p class="login-subtitle">Access the DCHR scheduling dashboard to manage appointments and patient records</p>
    </div>
    
    <div class="error-message" id="errorMessage"></div>
    
    <form id="loginForm">
      <div class="form-group">
        <label class="form-label" for="username">Username</label>
        <div class="input-wrapper">
          <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <input type="text" class="form-input" id="username" required placeholder="Enter your username" autocomplete="username">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <div class="input-wrapper">
          <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <input type="password" class="form-input" id="password" required placeholder="Enter your password" autocomplete="current-password">
        </div>
      </div>
      
      <button type="submit" class="login-btn" id="loginBtn">
        <span class="login-btn-content">
          <span id="btnText">Sign In to Dashboard</span>
        </span>
      </button>
    </form>
    
    <div class="login-footer">
      <div class="footer-address">
        <strong>PFC Associates, LLC</strong><br>
        920 Varnum Street NE, Washington, DC 20017
      </div>
      <div class="footer-secure">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Secure encrypted connection
      </div>
    </div>
  </div>

  <script>
    // Helper function to remove token from parent frame URL (for logout)
    function clearTokenFromParentUrl() {
      try {
        // Use postMessage to communicate with parent frame (cross-origin safe)
        if (window.top !== window.self) {
          window.top.postMessage({ action: 'logout' }, '*');
        }
      } catch(e) {
        // Ignore errors
      }
    }

    // Clickjacking protection - prevent embedding in unauthorized frames
    (function() {
      try {
        var allowedHosts = ['script.google.com', 'docs.google.com', 'drive.google.com'];
        var isGoogleFrame = window.self !== window.top && 
          allowedHosts.some(function(host) {
            try { return window.top.location.hostname.endsWith(host); } 
            catch(e) { return true; }
          });
        if (window.self !== window.top && !isGoogleFrame) {
          window.top.location = window.self.location;
        }
      } catch(e) {}
    })();

    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const loginBtn = document.getElementById('loginBtn');
      const btnText = document.getElementById('btnText');
      const errorMessage = document.getElementById('errorMessage');
      
      loginBtn.disabled = true;
      btnText.innerHTML = '<span class="loading-spinner"></span> Authenticating...';
      document.getElementById('username').disabled = true;
      document.getElementById('password').disabled = true;
      errorMessage.classList.remove('visible');
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result.success) {
            // Check if we logged out an existing session
            if (result.loggedOutExistingSession) {
              btnText.innerHTML = '✓ Access Granted';
              loginBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
              
              // Show notification about terminated session
              let sessionNotice = document.getElementById('sessionTerminatedNotice');
              if (!sessionNotice) {
                sessionNotice = document.createElement('div');
                sessionNotice.id = 'sessionTerminatedNotice';
                sessionNotice.style.cssText = 'background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 13px; display: flex; align-items: center; gap: 10px;';
                sessionNotice.innerHTML = '<span style="font-size: 18px;">⚠️</span><span><strong>Note:</strong> An active session on another device/browser was signed out.</span>';
                document.getElementById('loginForm').insertBefore(sessionNotice, document.getElementById('loginForm').firstChild);
              }
              
              // Delay redirect slightly so user can see the message
              setTimeout(function() {
                proceedWithRedirect(result.redirectUrl);
              }, 2000);
            } else {
              btnText.innerHTML = '✓ Access Granted';
              loginBtn.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
              
              setTimeout(function() {
                proceedWithRedirect(result.redirectUrl);
              }, 500);
            }
            
            function proceedWithRedirect(redirectUrl) {
              // Show a loading state
              btnText.innerHTML = '<span class="loading-spinner"></span> Redirecting...';
              
              // Set a fallback timer - if redirect doesn't happen in 3 seconds, show manual link
              var redirectTimeout = setTimeout(function() {
                showManualRedirect(redirectUrl);
              }, 3000);
              
              // Try multiple redirect methods
              try {
                // Method 1: top-level location (works in most cases)
                if (window.top && window.top.location) {
                  window.top.location.href = redirectUrl;
                  return;
                }
              } catch(e1) {}
              
              try {
                // Method 2: window.open with _top target
                window.open(redirectUrl, '_top');
                return;
              } catch(e2) {}
              
              try {
                // Method 3: regular location change
                window.location.href = redirectUrl;
                return;
              } catch(e3) {}
              
              // All methods failed - show manual link immediately
              clearTimeout(redirectTimeout);
              showManualRedirect(redirectUrl);
            }
            
            function showManualRedirect(url) {
              btnText.innerHTML = 'Click to Continue →';
              loginBtn.style.cursor = 'pointer';
              loginBtn.disabled = false;
              loginBtn.onclick = function(e) {
                e.preventDefault();
                window.open(url, '_top');
              };
              
              // Also show a direct link below the button
              let manualLink = document.getElementById('manualRedirectLink');
              if (!manualLink) {
                manualLink = document.createElement('div');
                manualLink.id = 'manualRedirectLink';
                manualLink.style.cssText = 'margin-top: 15px; text-align: center; font-size: 13px;';
                manualLink.innerHTML = '<a href="' + url + '" target="_top" style="color: #1976d2; text-decoration: underline;">Click here if not redirected automatically</a>';
                loginBtn.parentNode.insertBefore(manualLink, loginBtn.nextSibling);
              }
            }
          } else {
            errorMessage.textContent = result.message;
            errorMessage.classList.add('visible');
            resetForm(true);
          }
        })
        .withFailureHandler(function(error) {
          errorMessage.textContent = 'Connection error. Please try again.';
          errorMessage.classList.add('visible');
          resetForm(true);
        })
        .validateCredentials(username, password);
    });
    
    function resetForm(clearPassword) {
      const loginBtn = document.getElementById('loginBtn');
      const btnText = document.getElementById('btnText');
      loginBtn.disabled = false;
      loginBtn.style.background = '';
      btnText.textContent = 'Sign In to Dashboard';
      document.getElementById('username').disabled = false;
      document.getElementById('password').disabled = false;
      
      if (clearPassword) {
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    }
  </script>
</body>
</html>
`;
}

// ================================================================================
// BOOKING PAGE HTML - Main calendar interface
// ================================================================================

function getBookingPageHtml(username, token) {
  // Escape username to prevent XSS/injection in HTML contexts
  const escapeForHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\\/g, '\\\\');
  };
  
  // Escape username for use in JavaScript string literals (single-quoted)
  const escapeForJs = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/'/g, "\\'")     // Escape single quotes
      .replace(/\n/g, '\\n')    // Escape newlines
      .replace(/\r/g, '\\r')    // Escape carriage returns
      .replace(/</g, '\\x3c')   // Escape < to prevent </script> breaking out
      .replace(/>/g, '\\x3e');  // Escape > for safety
  };
  
  const safeUsername = escapeForHtml(username);
  const safeUsernameJs = escapeForJs(username);
  const safeToken = escapeForJs(token || '');
  
  const userDisplayHtml = `<div class="user-info">
         <span class="user-name">👤 ${safeUsername || 'Unlogged User'}</span>
         <button class="settings-btn" id="settingsBtn" title="Settings">⚙️</button>
         <button class="logout-btn" id="logoutBtn">Logout</button>
       </div>`;
  
  const logoutModalHtml = `<div class="modal-overlay" id="logoutModal">
       <div class="modal-dialog">
         <div class="modal-icon">👋</div>
         <div class="modal-title">${username ? 'Logout' : 'Not Logged In'}</div>
         <div class="modal-message">${username ? 'Are you sure you want to logout?' : 'You are not currently logged in. No logout is required.'}</div>
         <div class="modal-buttons">
           <button class="modal-btn modal-btn-cancel" id="logoutCancelBtn">${username ? 'Cancel' : 'OK'}</button>
           ${username ? '<button class="modal-btn modal-btn-confirm" id="logoutConfirmBtn">Logout</button>' : ''}
         </div>
       </div>
     </div>`;
  
  const unbookModalHtml = `<div class="modal-overlay" id="unbookModal">
       <div class="modal-dialog">
         <div class="modal-icon">🗑️</div>
         <div class="modal-title">Unbook Appointment</div>
         <div class="modal-message">Are you sure you want to unbook this appointment?</div>
         <div class="unbook-patient-info" id="unbookPatientInfo">
           <div class="unbook-patient-name" id="unbookPatientName"></div>
           <div class="unbook-patient-time" id="unbookPatientTime"></div>
           <div class="unbook-patient-email" id="unbookPatientEmail"></div>
           <div class="unbook-patient-id" id="unbookPatientId"></div>
         </div>
         <div class="modal-buttons">
           <button class="modal-btn modal-btn-cancel" id="unbookCancelBtn">Cancel</button>
           <button class="modal-btn modal-btn-confirm" id="unbookConfirmBtn">Unbook</button>
         </div>
       </div>
     </div>`;

  const duplicatePatientModalHtml = `<div class="modal-overlay" id="duplicatePatientModal">
       <div class="modal-dialog">
         <div class="modal-icon">⚠️</div>
         <div class="modal-title">Existing Patient Found</div>
         <div class="modal-message">A patient with the same name and date of birth already exists.</div>
         <div class="unbook-patient-info" id="duplicatePatientInfo">
           <div class="unbook-patient-name" id="duplicatePatientName"></div>
           <div class="unbook-patient-time" id="duplicatePatientId"></div>
           <div class="unbook-patient-email" id="duplicatePatientEmail"></div>
           <div class="unbook-patient-id" id="duplicatePatientExistingAppt"></div>
         </div>
         <div class="modal-message" style="margin-top: 12px; font-size: 13px;">Do you want to use this existing patient record?</div>
         <div class="modal-buttons">
           <button class="modal-btn modal-btn-cancel" id="duplicateCancelBtn">Cancel</button>
           <button class="modal-btn modal-btn-save" id="duplicateConfirmBtn">Use Existing Patient</button>
         </div>
       </div>
     </div>`;

  const settingsModalHtml = `<div class="modal-overlay" id="settingsModal">
       <div class="modal-dialog settings-dialog">
         <div class="modal-icon">⚙️</div>
         <div class="modal-title">${username ? 'Settings' : 'Not Logged In'}</div>
         
         ${username ? `<div class="settings-section">
           <div class="settings-section-title">Change Password</div>
           <div class="settings-form-group">
             <label for="currentPassword">Current Password</label>
             <input type="password" id="currentPassword" placeholder="Enter current password">
           </div>
           <div class="settings-form-group">
             <label for="newPassword">New Password</label>
             <input type="password" id="newPassword" placeholder="Enter new password">
           </div>
           <div class="settings-form-group">
             <label for="confirmNewPassword">Confirm New Password</label>
             <input type="password" id="confirmNewPassword" placeholder="Confirm new password">
           </div>
           <div class="settings-message" id="settingsMessage"></div>
         </div>` : `<div class="modal-message" style="margin: 20px 0;">You are not currently logged in. Settings are only available for logged in users.</div>`}
         
         <div class="modal-buttons">
           <button class="modal-btn modal-btn-cancel" id="settingsCancelBtn">${username ? 'Cancel' : 'OK'}</button>
           ${username ? '<button class="modal-btn modal-btn-save" id="settingsSaveBtn">Save Changes</button>' : ''}
         </div>
       </div>
     </div>`;
  
  const logoutScript = `
      // Logout modal handlers
      if (document.getElementById('logoutBtn')) {
        const logoutModal = document.getElementById('logoutModal');
        const logoutBtn = document.getElementById('logoutBtn');
        const logoutCancelBtn = document.getElementById('logoutCancelBtn');
        const logoutConfirmBtn = document.getElementById('logoutConfirmBtn');
        
        // Show modal when logout button clicked
        logoutBtn.addEventListener('click', function() {
          logoutModal.classList.add('visible');
        });
        
        // Hide modal when cancel clicked
        logoutCancelBtn.addEventListener('click', function() {
          logoutModal.classList.remove('visible');
        });
        
        // Hide modal when clicking outside the dialog
        logoutModal.addEventListener('click', function(e) {
          if (e.target === logoutModal) {
            logoutModal.classList.remove('visible');
          }
        });
        
        // Perform logout when confirm clicked
        if (document.getElementById('logoutConfirmBtn')) {
          logoutConfirmBtn.addEventListener('click', function() {
            logoutCancelBtn.disabled = true;
            logoutConfirmBtn.disabled = true;
            logoutConfirmBtn.textContent = 'Logging out...';
            
            // Stop session validity checks to prevent race condition
            isLoggedOut = true;
            clearInterval(sessionCheckTimer);
            clearTimeout(inactivityTimer);
            clearTimeout(warningTimer);
            
            google.script.run
              .withSuccessHandler(function(loginHtml) {
                clearTokenFromParentUrl();
                document.open();
                document.write(loginHtml);
                document.close();
              })
              .withFailureHandler(function(error) {
                logoutModal.classList.remove('visible');
                logoutCancelBtn.disabled = false;
                logoutConfirmBtn.disabled = false;
                logoutConfirmBtn.textContent = 'Logout';
              })
              .performLogout('${safeToken}');
          });
        }
      }
      
      // Settings modal handlers
      if (document.getElementById('settingsBtn')) {
        const settingsModal = document.getElementById('settingsModal');
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsCancelBtn = document.getElementById('settingsCancelBtn');
        const settingsSaveBtn = document.getElementById('settingsSaveBtn');
        const settingsMessage = document.getElementById('settingsMessage');
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
        const isLoggedIn = ${username ? 'true' : 'false'};
        
        function resetSettingsModal() {
          if (currentPasswordInput) currentPasswordInput.value = '';
          if (newPasswordInput) newPasswordInput.value = '';
          if (confirmNewPasswordInput) confirmNewPasswordInput.value = '';
          if (settingsMessage) {
            settingsMessage.classList.remove('visible', 'error', 'success');
            settingsMessage.textContent = '';
          }
          if (currentPasswordInput) currentPasswordInput.disabled = false;
          if (newPasswordInput) newPasswordInput.disabled = false;
          if (confirmNewPasswordInput) confirmNewPasswordInput.disabled = false;
          if (settingsCancelBtn) settingsCancelBtn.disabled = false;
          if (settingsSaveBtn) {
            settingsSaveBtn.disabled = false;
            settingsSaveBtn.textContent = 'Save Changes';
          }
        }
        
        // Show modal when settings button clicked
        settingsBtn.addEventListener('click', function() {
          resetSettingsModal();
          settingsModal.classList.add('visible');
          if (currentPasswordInput) currentPasswordInput.focus();
        });
        
        // Hide modal when cancel clicked
        settingsCancelBtn.addEventListener('click', function() {
          settingsModal.classList.remove('visible');
        });
        
        // Hide modal when pressing Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && settingsModal.classList.contains('visible')) {
    // Don't allow closing while processing
    if (settingsSaveBtn.disabled) {
      return;
    }
    settingsModal.classList.remove('visible');
    resetSettingsModal();
  }
});
        
        // Save password change
        if (settingsSaveBtn) {
          settingsSaveBtn.addEventListener('click', function() {
          const currentPassword = currentPasswordInput.value;
          const newPassword = newPasswordInput.value;
          const confirmNewPassword = confirmNewPasswordInput.value;
          
          // Validation
          if (!currentPassword) {
            settingsMessage.textContent = 'Please enter your current password.';
            settingsMessage.classList.remove('success');
            settingsMessage.classList.add('visible', 'error');
            currentPasswordInput.focus();
            return;
          }
          
          if (!newPassword) {
            settingsMessage.textContent = 'Please enter a new password.';
            settingsMessage.classList.remove('success');
            settingsMessage.classList.add('visible', 'error');
            newPasswordInput.focus();
            return;
          }
          
          if (newPassword !== confirmNewPassword) {
            settingsMessage.textContent = 'New passwords do not match.';
            settingsMessage.classList.remove('success');
            settingsMessage.classList.add('visible', 'error');
            confirmNewPasswordInput.focus();
            return;
          }
          
          if (newPassword === currentPassword) {
            settingsMessage.textContent = 'New password must be different from current password.';
            settingsMessage.classList.remove('success');
            settingsMessage.classList.add('visible', 'error');
            newPasswordInput.focus();
            return;
          }
          
          // Disable form while saving
          currentPasswordInput.disabled = true;
          newPasswordInput.disabled = true;
          confirmNewPasswordInput.disabled = true;
          settingsCancelBtn.disabled = true;
          settingsSaveBtn.disabled = true;
          settingsSaveBtn.textContent = 'Saving...';
          settingsMessage.classList.remove('visible');
          
          google.script.run
            .withSuccessHandler(function(result) {
              if (result.success) {
                settingsMessage.textContent = 'Password changed successfully!';
                settingsMessage.classList.remove('error');
                settingsMessage.classList.add('visible', 'success');
                
                // Close modal after a short delay
                setTimeout(function() {
                  settingsModal.classList.remove('visible');
                  resetSettingsModal();
                }, 1500);
              } else {
                settingsMessage.textContent = result.message;
                settingsMessage.classList.remove('success');
                settingsMessage.classList.add('visible', 'error');
                currentPasswordInput.disabled = false;
                newPasswordInput.disabled = false;
                confirmNewPasswordInput.disabled = false;
                settingsCancelBtn.disabled = false;
                settingsSaveBtn.disabled = false;
                settingsSaveBtn.textContent = 'Save Changes';
                currentPasswordInput.value = '';
                currentPasswordInput.focus();
              }
            })
            .withFailureHandler(function(error) {
              settingsMessage.textContent = 'An error occurred. Please try again.';
              settingsMessage.classList.remove('success');
              settingsMessage.classList.add('visible', 'error');
              currentPasswordInput.disabled = false;
              newPasswordInput.disabled = false;
              confirmNewPasswordInput.disabled = false;
              settingsCancelBtn.disabled = false;
              settingsSaveBtn.disabled = false;
              settingsSaveBtn.textContent = 'Save Changes';
            })
            .changePassword('${safeUsernameJs}', currentPassword, newPassword, '${safeToken}');
          });
        }
      }
    `;

  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_self">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1260px;
      margin: 0 auto;
      padding: 8px 16px;
      background: #f5f5f5;
      color: #333;
      font-size: 14px;
    }
    
    /* Compact header */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .page-header-left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px 20px;
      flex: 1;
      min-width: 0;
    }
    
    .page-header h1 {
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      white-space: nowrap;
    }
    
    .page-header .subtitle {
      color: #666;
      font-size: 14px;
      white-space: nowrap;
    }
    
    @media (max-width: 1100px) {
      .page-header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      
      .page-header .subtitle {
        white-space: normal;
      }
    }
    
    @media (max-width: 700px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .page-header h1 {
        font-size: 16px;
      }
      
      .page-header .subtitle {
        font-size: 13px;
      }
      
      .user-info {
        width: 100%;
        justify-content: flex-start;
        margin-top: 4px;
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    
    .user-name {
      font-size: 14px;
      color: #555;
      font-weight: 500;
    }
    
    .logout-btn {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: #ff5252;
      border-color: #ff5252;
      color: white;
    }
    
    /* Logout confirmation modal */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      align-items: center;
      justify-content: center;
    }
    
    .modal-overlay.visible {
      display: flex;
    }
    
    .modal-dialog {
      background: white;
      border-radius: 12px;
      padding: 24px 32px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 320px;
      width: 90%;
      animation: modalSlideIn 0.2s ease-out;
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    .modal-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    
    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .modal-message {
      font-size: 14px;
      color: #666;
      margin-bottom: 24px;
    }
    
    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .modal-btn {
      padding: 10px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    
    .modal-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .modal-btn-cancel {
      background: #f5f5f5;
      color: #666;
      border: 1px solid #ddd;
    }
    
    .modal-btn-cancel:hover:not(:disabled) {
      background: #e0e0e0;
    }
    
    .modal-btn-confirm {
      background: #ff5252;
      color: white;
    }
    
    .modal-btn-confirm:hover:not(:disabled) {
      background: #e04545;
    }
    
    .unbook-patient-info {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 10px 12px;
      margin: 12px 0 20px 0;
      font-size: 13px;
      text-align: left;
    }
    
    .unbook-patient-name {
      font-weight: 600;
      color: #333;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .unbook-patient-time {
      font-size: 12px;
      color: #666;
    }
    
    .unbook-patient-email {
      font-size: 11px;
      color: #1976d2;
    }
    
    .unbook-patient-id {
      font-size: 11px;
      color: #999;
    }
    
    .modal-btn-save {
      background: #1976d2;
      color: white;
    }
    
    .modal-btn-save:hover:not(:disabled) {
      background: #1565c0;
    }
    
    /* Auto-logout modal - highest z-index to appear above everything */
    #autoLogoutModal {
      z-index: 99999;
    }
    
    #autoLogoutModal .modal-dialog {
      animation: modalSlideIn 0.3s ease-out;
    }
    
    /* Settings button */
    .settings-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s;
      opacity: 0.7;
    }
    
    .settings-btn:hover {
      opacity: 1;
      background: #f0f0f0;
    }
    
    /* Settings modal specific styles */
    .settings-dialog {
      max-width: 380px;
      text-align: left;
    }
    
    .settings-dialog .modal-icon,
    .settings-dialog .modal-title {
      text-align: center;
    }
    
    .settings-section {
      margin: 20px 0;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    
    .settings-section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .settings-form-group {
      margin-bottom: 12px;
    }
    
    .settings-form-group:last-of-type {
      margin-bottom: 0;
    }
    
    .settings-form-group label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      margin-bottom: 4px;
    }
    
    .settings-form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    
    .settings-form-group input:focus {
      outline: none;
      border-color: #1976d2;
    }
    
    .settings-form-group input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
    
    .settings-message {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 13px;
      display: none;
    }
    
    .settings-message.visible {
      display: block;
    }
    
    .settings-message.error {
      background: #ffebee;
      color: #c62828;
    }
    
    .settings-message.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    /* Main layout using CSS Grid */
    
    /* Main layout using CSS Grid */
    .main-row {
      display: grid;
      grid-template-columns: 5fr 1.3fr 7.7fr;
      grid-template-rows: auto auto;
      gap: 14px;
      align-items: start;
    }
    
    /* Calendar panel - column 1, row 1 */
    .calendar-panel {
      grid-column: 1;
      grid-row: 1;
    }
    
    .calendar-container {
      background: white;
      border-radius: 10px;
      padding: 6px 14px 6px 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }
    
    .calendar-header h2 {
      font-size: 26px;
      font-weight: 600;
    }
    
    .calendar-header-left,
    .calendar-header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 90px;
    }
    
    .calendar-header-left {
      justify-content: flex-start;
    }
    
    .calendar-header-right {
      justify-content: flex-end;
    }
    
    .calendar-nav {
      background: #f0f0f0;
      border: 2px solid #999;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .calendar-nav:hover:not(:disabled) { 
      background: #1976d2; 
      border-color: #1976d2;
      color: white;
    }
    .calendar-nav:disabled { 
      opacity: 0.3; 
      cursor: not-allowed; 
      background: #f5f5f5;
      border-color: #ccc;
    }
    .calendar-nav:disabled:hover {
      background: #f5f5f5;
      border-color: #ccc;
      color: #333;
    }
    
    .today-btn {
      background: #e3f2fd;
      border: 1px solid #1976d2;
      padding: 0 8px;
      height: 24px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .today-btn:hover:not(:disabled) {
      background: #1976d2;
      color: white;
    }
    
    .today-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    
    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      color: #666;
      margin-bottom: 3px;
    }
    
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 3px;
    }
    
    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 17px;
      border: none;
      background: none;
      color: #333;
      position: relative;
      padding: 0;
    }
    
    .calendar-day.other-month { color: #ccc; }
    .calendar-day.today { font-weight: 700; }
    
    .calendar-day.has-slots {
      background: #e3f2fd;
      color: #1976d2;
      cursor: pointer;
      font-weight: 600;
    }
    
    .calendar-day.has-slots:hover:not(:disabled) {
      background: #1976d2;
      color: white;
    }
    
    .calendar-day.selected {
      background: #1976d2;
      color: white;
    }
    
    .calendar-day.past { color: #ccc; }
    
    .calendar-day.partial-slots {
      background: #e8f5e9;
      color: #2e7d32;
      cursor: pointer;
      font-weight: 600;
    }
    
    .calendar-day.partial-slots:hover:not(:disabled) {
      background: #2e7d32;
      color: white;
    }
    
    .calendar-day.partial-slots.selected {
      background: #2e7d32;
      color: white;
    }
    
    .calendar-day.full-slots {
      background: #ffebee;
      color: #c62828;
      cursor: pointer;
      font-weight: 600;
    }
    
    .calendar-day.full-slots:hover:not(:disabled) {
      background: #c62828;
      color: white;
    }
    
    .calendar-day.full-slots.selected {
      background: #c62828;
      color: white;
    }
    
    .calendar-day:disabled {
      cursor: not-allowed;
    }
    
    .slot-count {
      position: absolute;
      bottom: -3px;
      right: -3px;
      font-size: 11px;
      font-weight: 700;
      background: #1976d2;
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
    
    .calendar-day.partial-slots .slot-count {
      background: #2e7d32;
    }
    
    .calendar-day.full-slots .slot-count {
      background: #c62828;
    }
    
    .calendar-day.has-slots:hover:not(:disabled) .slot-count,
    .calendar-day.has-slots.selected .slot-count {
      background: white;
      color: #1976d2;
      border-color: #1976d2;
    }
    
    .calendar-day.partial-slots:hover:not(:disabled) .slot-count,
    .calendar-day.partial-slots.selected .slot-count {
      background: white;
      color: #2e7d32;
      border-color: #2e7d32;
    }
    
    .calendar-day.full-slots:hover:not(:disabled) .slot-count,
    .calendar-day.full-slots.selected .slot-count {
      background: white;
      color: #c62828;
      border-color: #c62828;
    }
    
    /* Calendar footer - moved closer to calendar grid */
    .calendar-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -4px;
      padding-top: 0;
    }
    
    .legend {
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #666;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .legend-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      cursor: default;
    }
    
    .legend-dot.available { background: #e3f2fd; border: 2px solid #1976d2; }
    .legend-dot.partial { background: #e8f5e9; border: 2px solid #2e7d32; }
    .legend-dot.full { background: #ffebee; border: 2px solid #c62828; }
    .legend-dot.unavailable { background: #f5f5f5; border: 1px solid #ddd; }
    
    /* Monthly appointments section - spans columns 1-2, row 2 */
    #monthlyBookedSection {
      grid-column: 1 / 3;
      grid-row: 2;
    }
    
    .booked-section {
      background: white;
      border-radius: 10px;
      padding: 10px 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .booked-header {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .booked-count {
      background: #1976d2;
      color: white;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
    }
    
    .booked-list {
      max-height: 200px;
      overflow-y: auto;
    }
    
    .monthly-booked-list {
      max-height: 540px;
      overflow-y: auto;
    }
    
    /* Booked item - new layout with button to the right of time/ID */
    .booked-item {
      display: flex;
      flex-direction: column;
      padding: 8px 10px;
      background: #f9f9f9;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    
    .booked-name {
      font-weight: 600;
      color: #333;
      font-size: 14px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .upload-status {
      font-size: 8px;
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 500;
      text-align: center;
      display: inline-block;
      margin-top: 2px;
      white-space: nowrap;
      width: calc(50% - 2px);
    }
    
    .upload-status-container {
      display: flex;
      gap: 2px;
      margin-top: 2px;
    }
    
    .upload-status.uploaded {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    .upload-status.not-uploaded {
      background: #ffebee;
      color: #c62828;
    }
    
    .upload-status.pending {
      background: #fff3e0;
      color: #e65100;
    }
    
    .visit-status-row {
      margin-top: 2px;
    }
    
    .visit-status {
      font-size: 8px;
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 500;
      text-align: center;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .visit-status.uploaded {
      background: #e8f5e9;
      color: #2e7d32;
    }
    
    .visit-status.not-uploaded {
      background: #ffebee;
      color: #c62828;
    }
    
    .visit-status.pending {
      background: #fff3e0;
      color: #e65100;
    }
    
    .booked-item.no-show {
      background: #ffebee;
      border-color: #ffcdd2;
    }
    
    .booked-details-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      height: 100px;
    }
    
    .booked-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    
    .booked-email {
      font-size: 11px;
      color: #1976d2;
      height: 14px;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .booked-time {
      font-size: 12px;
      color: #666;
      height: 18px;
      line-height: 18px;
    }
    
    .booked-appt-type {
      font-size: 11px;
      color: #1976d2;
      font-weight: 500;
      height: 16px;
      line-height: 16px;
    }
        
    .booked-date {
      font-size: 12px;
      color: #1976d2;
      font-weight: 500;
    }
    
    .booked-email {
      font-size: 11px;
      color: #1976d2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .booked-id {
      font-size: 11px;
      color: #999;
    }
    
    .booked-note-container {
      margin-top: 2px;
    }
    
    .booked-note-display {
      font-size: 11px;
      color: #555;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 4px 6px;
      height: 58px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.4;
      box-sizing: border-box;
    }
    
    .booked-note-display.empty {
      color: #999;
      font-style: italic;
    }
    
    .booked-note-edit {
      display: none;
    }
    
    .booked-note-edit textarea {
      width: 100%;
      font-size: 11px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 4px 6px;
      height: 58px;
      resize: none;
      font-family: inherit;
      line-height: 1.4;
      box-sizing: border-box;
      margin: 0;
      background: #fff;
    }
    
    .booked-note-edit textarea:focus {
      outline: none;
      border-color: #1976d2;
    }
    
    .booked-note-edit textarea:focus {
      outline: none;
      border-color: #1565c0;
    }
       
    .note-btn {
      background: #1976d2;
      color: white;
      border: none;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }
    
    .note-btn:hover {
      background: #1565c0;
    }
    
    .note-btn.cancel-btn {
      background: #757575;
    }
    
    .note-btn.cancel-btn:hover {
      background: #616161;
    }
    
    .note-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .note-actions {
      display: flex;
      flex-direction: row;
      gap: 3px;
      margin-top: 3px;
      width: 100%;
      height: 18px;
    }
    
    .note-actions .note-btn {
      flex: 1;
    }
    
    .booking-actions {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex-shrink: 0;
      align-self: flex-start;
      width: 70px;
    }
    
    .reschedule-btn, .unbook-btn {
      color: white;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      width: 70px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .reschedule-btn {
      background: #ff9800;
    }
    
    .reschedule-btn:hover {
      background: #f57c00;
    }
    
    .unbook-btn {
      background: #f44336;
    }
    
    .unbook-btn:hover {
      background: #d32f2f;
    }
    
    .reschedule-btn:disabled, .unbook-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .no-bookings {
      color: #999;
      font-size: 13px;
      text-align: center;
      padding: 15px;
    }
    
    .booked-placeholder {
      color: #999;
      font-size: 13px;
      text-align: center;
      padding: 15px;
    }
    
    .booked-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 30px 15px;
      color: #666;
      perspective: 400px;
    }
    
    .loading-spinner-small {
      width: 32px;
      height: 32px;
      animation: rotateY3D 2s ease-in-out infinite;
      transform-style: preserve-3d;
    }
    
    .loading-spinner-small img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .booked-loading-text {
      font-size: 13px;
      font-weight: 500;
    }
    
    /* Date group header for monthly view */
    .date-group-header {
      background: #e3f2fd;
      color: #1976d2;
      font-weight: 600;
      font-size: 13px;
      padding: 6px 10px;
      border-radius: 4px;
      margin-bottom: 6px;
      margin-top: 10px;
    }
    
    .date-group-header:first-child {
      margin-top: 0;
    }
    
    /* Two appointments per row */
    .booked-row {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    
    .booked-row:last-child {
      margin-bottom: 0;
    }
    
    .booked-row .booked-item {
      flex: 1;
      min-width: 0;
    }
    
    .booked-row .booked-item.empty-placeholder {
      visibility: hidden;
    }
    
    /* Times panel - column 2, row 1 */
    .times-panel {
      grid-column: 2;
      grid-row: 1;
    }
    
    .slots-container {
      background: white;
      border-radius: 10px;
      padding: 4px 5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      height: 100%;
    }
    
    .slots-header {
      font-weight: 600;
      margin-bottom: 4px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 18px;
      text-align: center;
    }
    
    .slots-placeholder-text {
      color: #999;
      font-size: 14px;
      text-align: center;
      padding: 15px 2px;
    }
    
    .slots-grid {
      display: flex;
      flex-direction: column;
      gap: 1px;
      max-height: 370px;
      overflow-y: auto;
    }
    
    .slot-btn {
      padding: 2px 4px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      background: white;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s;
      text-align: center;
    }
    
    .slot-btn:hover:not(:disabled) {
      border-color: #1976d2;
      background: #f5f9ff;
    }
    
    .slot-btn.selected {
      border-color: #1976d2;
      background: #1976d2;
      color: white;
    }
    
    .slot-btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: #f5f5f5;
    }
    
    .slot-btn.full {
      background: #ffebee;
      border-color: #ffcdd2;
    }
    
    .slot-btn.full:disabled {
      opacity: 1;
    }
    
    .slot-time {
      font-weight: 600;
      font-size: 18px;
      display: block;
      line-height: 1.2;
    }
    
    .slot-availability {
      font-size: 14px;
      color: #666;
      display: block;
      line-height: 1.2;
    }
    
    .slot-btn.selected .slot-availability {
      color: rgba(255,255,255,0.8);
    }
    
    .slot-availability.low {
      color: #e65100;
    }
    
    .slot-availability.full {
      color: #c62828;
      font-weight: 600;
    }
    
    .slot-btn.selected .slot-availability.low {
      color: #ffcc80;
    }
    
    /* Form panel - column 3, spans both rows */
    .form-panel {
      grid-column: 3;
      grid-row: 1 / 3;
    }
    
    .form-container {
      background: white;
      border-radius: 10px;
      padding: 12px 18px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .form-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      min-height: 36px;
    }
    
    .form-title {
      font-size: 17px;
      font-weight: 600;
      color: #333;
    }
    
    .selected-slot-display {
      background: #e8f5e9;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 8px;
      font-weight: 500;
      color: #2e7d32;
      font-size: 14px;
    }
    
    .selected-slot-display.empty {
      background: #fff3e0;
      color: #e65100;
    }
    
    .selected-slot-display.fully-booked {
      background: #ffebee;
      color: #c62828;
    }
    
    /* Rescheduling banner */
    .reschedule-banner {
      background: #fff3e0;
      border: 1px solid #ffb74d;
      border-radius: 6px;
      padding: 6px 10px;
      display: none;
      align-items: center;
      gap: 12px;
    }
    
    .reschedule-banner.visible {
      display: flex;
    }
    
    .reschedule-banner-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    
    .reschedule-banner-text {
      font-size: 12px;
      color: #e65100;
      font-weight: 600;
    }
    
    .reschedule-banner-id {
      font-size: 11px;
      color: #f57c00;
    }
    
    .cancel-reschedule-btn {
      background: #ff5722;
      color: white;
      border: none;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      flex-shrink: 0;
    }
    
    .cancel-reschedule-btn:hover {
      background: #e64a19;
    }
    
    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .form-row .form-group.xs {
      flex: 0 0 55px;
    }
    
    .form-row .form-group.small {
      flex: 0 0 80px;
    }
    
    .form-row .form-group.medium {
      flex: 0 0 115px;
    }
    
    label {
      display: block;
      margin-bottom: 2px;
      font-weight: 500;
      font-size: 14px;
      color: #555;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 9px 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    
    .ssn-wrapper, .phone-wrapper {
      position: relative;
    }
    .ssn-wrapper input, .phone-wrapper input {
      background: transparent;
      position: relative;
      z-index: 2;
    }
    .ssn-phantom, .phone-phantom {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 9px 10px;
      font-size: 14px;
      font-family: inherit;
      pointer-events: none;
      z-index: 1;
      color: transparent;
      display: none;
    }
    .ssn-phantom .phantom-spacer, .phone-phantom .phantom-spacer {
      visibility: hidden;
    }
    .ssn-phantom .phantom-dash, .phone-phantom .phantom-dash {
      color: #ccc;
      visibility: visible;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #1976d2;
    }
    
    input:disabled, textarea:disabled, select:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
    
    input.reschedule-mode,
    select.reschedule-mode {
      background: #fff3e0;
      border-color: #ffb74d;
      cursor: default;
      color: #333;
    }
    
    input.reschedule-mode:focus,
    select.reschedule-mode:focus {
      outline: none;
      border-color: #ffb74d;
    }
    
    .validation-hint {
      font-size: 13px;
      color: #666;
      margin-top: 8px;
      margin-bottom: 4px;
      text-align: center;
    }
    
    .submit-notice {
      background: #e3f2fd;
      border: 1px solid #90caf9;
      border-radius: 6px;
      padding: 5px 12px;
      margin-bottom: 6px;
      font-size: 13px;
      color: #1565c0;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    
    .submit-notice-icon {
      font-size: 14px;
      flex-shrink: 0;
    }
    
    button[type="submit"] {
      width: 100%;
      padding: 12px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    button[type="submit"]:hover:not(:disabled) { background: #1565c0; }
    button[type="submit"]:disabled { 
      background: #ccc; 
      cursor: not-allowed; 
    }
    
    button[type="submit"].reschedule-mode:not(:disabled) {
      background: #ff9800;
    }
    
    button[type="submit"].reschedule-mode:hover:not(:disabled) {
      background: #f57c00;
    }
    
    button[type="submit"].reschedule-mode:disabled {
      background: #ccc;
    }
    
    .message {
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      margin-top: 15px;
    }
    
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
    
    .book-another-link {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .book-another-link:hover {
      background: #1565c0;
    }
    
    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #555;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      perspective: 500px;
    }
    
    .loading-spinner-large {
      width: 60px;
      height: 60px;
      animation: rotateY3D 2s ease-in-out infinite;
      transform-style: preserve-3d;
    }
    
    .loading-spinner-large img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .loading-text {
      font-size: 16px;
      font-weight: 500;
    }
    
    @keyframes rotateY3D {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    
    /* Disabled state for entire form */
    .form-disabled {
      pointer-events: none;
      opacity: 0.7;
    }
    
    /* Mobile responsive */
    @media (max-width: 900px) {
      .main-row {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      
      .calendar-panel,
      .times-panel,
      .form-panel,
      #monthlyBookedSection {
        width: 100%;
      }
      
      .slots-grid {
        flex-direction: row;
        flex-wrap: wrap;
        max-height: none;
      }
      
      .slot-btn {
        flex: 1 1 calc(33% - 4px);
        min-width: 80px;
      }
      
      .form-row {
        flex-wrap: wrap;
      }
      
      .form-row .form-group {
        flex: 1 1 45%;
        min-width: 100px;
      }
      
      .form-row .form-group.xs,
      .form-row .form-group.small,
      .form-row .form-group.medium {
        flex: 1 1 30%;
        min-width: 70px;
      }
      
      .booked-row {
        flex-direction: column;
      }
      
      .booked-row .booked-item.empty-placeholder {
        display: none;
      }
      
      .page-header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  ${logoutModalHtml}
  ${unbookModalHtml}
  ${duplicatePatientModalHtml}
  ${settingsModalHtml}
  
  <!-- Auto-logout modal -->
  <div class="modal-overlay" id="autoLogoutModal">
    <div class="modal-dialog">
      <div class="modal-icon">🔒</div>
      <div class="modal-title" id="autoLogoutTitle">Session Expired</div>
      <div class="modal-message" id="autoLogoutMessage">You have been logged out due to inactivity for security purposes.</div>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-confirm" id="autoLogoutOkBtn" style="background: #1976d2;">OK</button>
      </div>
    </div>
  </div>
  
  <!-- Compact header -->
  <div class="page-header">
    <div class="page-header-left">
      <h1><img src="https://pfcassociates.org/PFC_images/PFC_LOGO_4.png" alt="PFC Logo" style="height: 32px; vertical-align: middle; margin-right: 8px;">PFC - DCHR Appointment Scheduling</h1>
      <span class="subtitle">Appointments must be booked at least 24 hours in advance.</span>
    </div>
    ${userDisplayHtml}
  </div>
  
  <div id="loading" class="loading">
    <div class="loading-spinner-large">
      <img src="https://www.shadowaisolutions.com/SAIS%20Logo.png" alt="Loading">
    </div>
    <div class="loading-text">Loading available slots...</div>
  </div>
  
  <div id="mainContent" style="display: none;">
    <div class="main-row">
      <!-- Calendar panel -->
      <div class="calendar-panel">
        <div class="calendar-container" id="calendarContainer">
          <div class="calendar-header">
            <div class="calendar-header-left">
              <button class="calendar-nav" id="prevMonth">←</button>
            </div>
            <h2 id="currentMonth"></h2>
            <div class="calendar-header-right">
              <button class="today-btn" id="todayBtn">Today</button>
              <button class="calendar-nav" id="nextMonth">→</button>
            </div>
          </div>
          <div class="calendar-weekdays">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div class="calendar-grid" id="calendarGrid"></div>
          <div class="calendar-footer">
            <button class="calendar-nav" id="prevMonthBottom">←</button>
            <div class="legend">
              <div class="legend-item"><div class="legend-dot available" id="clearTrigger"></div> Available</div>
              <div class="legend-item"><div class="legend-dot partial"></div> Partial</div>
              <div class="legend-item"><div class="legend-dot full"></div> Full</div>
              <div class="legend-item"><div class="legend-dot unavailable" id="fillTrigger"></div> Unavailable</div>
            </div>
            <button class="calendar-nav" id="nextMonthBottom">→</button>
          </div>
        </div>
      </div>
      
      <!-- Time Slots panel -->
      <div class="times-panel">
        <div class="slots-container" id="slotsContainer">
          <div class="slots-header" id="slotsHeader">Select Time</div>
          <div id="slotsContent">
            <div class="slots-placeholder-text">← Pick a date</div>
          </div>
        </div>
      </div>
      
      <!-- Form panel -->
      <div class="form-panel">
        <div class="form-container" id="formContainer">
          <div class="form-title-row">
            <div class="form-title">Patient Details</div>
            
            <!-- Rescheduling banner -->
            <div class="reschedule-banner" id="rescheduleBanner">
              <div class="reschedule-banner-info">
                <div class="reschedule-banner-text">🔄 Rescheduling Mode</div>
                <div class="reschedule-banner-id" id="rescheduleBannerPatientId"></div>
              </div>
              <button class="cancel-reschedule-btn" id="cancelRescheduleBtn">Cancel</button>
            </div>
          </div>
          
          <div class="selected-slot-display empty" id="selectedSlotDisplay">
            ⏳ Please select a date and time
          </div>
          
          <form id="bookingForm">
            <!-- Hidden field for rescheduling patient ID -->
            <input type="hidden" id="reschedulingPatientId" value="">
            
            <!-- Row 1: Last Name, First Name, Gender, DOB -->
            <div class="form-row">
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" required placeholder="Smith">
              </div>
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" required placeholder="John">
              </div>
              <div class="form-group medium">
                <label for="gender">Gender</label>
                <select id="gender" required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group medium">
                <label for="dob">Date of Birth</label>
                <input type="date" id="dob" required>
              </div>
            </div>
            
            <!-- Row 2: SSN, Phone, Email, Appointment Type -->
            <div class="form-row">
              <div class="form-group medium">
                <label for="ssn">SSN</label>
                <div class="ssn-wrapper">
                  <div class="ssn-phantom" id="ssnPhantom"><span class="phantom-spacer">000</span><span class="phantom-dash">-</span><span class="phantom-spacer">00</span><span class="phantom-dash">-</span><span class="phantom-spacer">0000</span></div>
                  <input type="text" id="ssn" required placeholder="123-45-6789" maxlength="11">
                </div>
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <div class="phone-wrapper">
                  <div class="phone-phantom" id="phonePhantom"><span class="phantom-spacer">(000</span><span class="phantom-dash">) </span><span class="phantom-spacer">000</span><span class="phantom-dash">-</span><span class="phantom-spacer">0000</span></div>
                  <input type="tel" id="phone" required placeholder="(555) 123-4567" maxlength="14">
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required placeholder="john@example.com">
              </div>
              <div class="form-group medium">
                <label for="appointmentType">Appt Type</label>
                <select id="appointmentType" required>
                  <option value="">Select</option>
                  <option value="Pre-Employment">Pre-Employment</option>
                  <option value="Fitness for Duty">Fitness for Duty</option>
                  <option value="Shy Bladder">Shy Bladder</option>
                  <option value="Shy Lung">Shy Lung</option>
                </select>
              </div>
              <div class="form-group">
                <label for="caseNumber">Case Number</label>
                <input type="text" id="caseNumber" required placeholder="Case #">
              </div>
            </div>
            
            <!-- Row 3: Address, City, State, Zip -->
            <div class="form-row">
              <div class="form-group" style="flex: 2;">
                <label for="address">Address</label>
                <input type="text" id="address" placeholder="123 Main Street">
              </div>
              <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" placeholder="Los Angeles">
              </div>
              <div class="form-group xs">
                <label for="state">State</label>
                <input type="text" id="state" placeholder="CA" maxlength="2">
              </div>
              <div class="form-group small">
                <label for="zipCode">Zip</label>
                <input type="text" id="zipCode" placeholder="90001" maxlength="10">
              </div>
            </div>
            
            <div class="validation-hint" id="validationHint">Select a time slot and fill in required fields</div>
            
            <div class="submit-notice" id="submitNotice">
              <span class="submit-notice-icon">📧</span>
              <span>Upon submitting, a booking confirmation will be sent to the patient's email along with a link to access the Patient Portal (vaccination upload & health questionnaire).</span>
            </div>
            
            <button type="submit" id="submitBtn" disabled>Confirm Booking Appointment</button>
          </form>
        </div>
        
        <!-- Booked appointments for selected day (under form) -->
        <div class="booked-section" id="bookedSection" style="margin-top: 10px;">
          <div class="booked-header">
            📋 Booked for Selected Day <span class="booked-count" id="bookedCount" style="display: none;">0</span>
          </div>
          <div id="bookedContent">
            <div class="booked-placeholder">← Select a date to view bookings</div>
          </div>
        </div>
      </div>
      
      <!-- Monthly appointments - spans calendar + times columns -->
      <div class="booked-section" id="monthlyBookedSection">
        <div class="booked-header">
          📆 All Appointments This Month <span class="booked-count" id="monthlyBookedCount" style="display: none;">0</span>
        </div>
        <div id="monthlyBookedContent">
          <div class="booked-loading"><div class="loading-spinner-small"><img src="https://www.shadowaisolutions.com/SAIS%20Logo.png" alt="Loading"></div><div class="booked-loading-text">Loading monthly appointments...</div></div>
        </div>
      </div>
    </div>
  </div>
  
  <div id="message"></div>

  <script>
    // Helper function to remove token from parent frame URL (for logout)
    function clearTokenFromParentUrl() {
      try {
        // Use postMessage to communicate with parent frame (cross-origin safe)
        if (window.top !== window.self) {
          window.top.postMessage({ action: 'logout' }, '*');
        }
      } catch(e) {
        // Ignore errors
      }
    }

    // Clickjacking protection - prevent embedding in unauthorized frames
    (function() {
      try {
        var allowedHosts = ['script.google.com', 'docs.google.com', 'drive.google.com'];
        var isGoogleFrame = window.self !== window.top && 
          allowedHosts.some(function(host) {
            try { return window.top.location.hostname.endsWith(host); } 
            catch(e) { return true; }
          });
        if (window.self !== window.top && !isGoogleFrame) {
          window.top.location = window.self.location;
        }
      } catch(e) {}
    })();

    // HTML escape helper for client-side use
    function escapeHtml(str) {
      if (!str) return '';
      return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    
    // State variables
    let allSlots = [];
    let slotsByDate = {};
    let currentDate = new Date();
    let selectedDate = null;
    let selectedDateKey = null;
    let selectedSlot = null;
    let isProcessing = false;
    let isRescheduling = false;
    let reschedulingPatientId = null;
    let reschedulingOldRow = null;
    
    // Request cancellation counters - increment to invalidate pending requests
    let dateBookingsRequestId = 0;
    let monthlyBookingsRequestId = 0;
    
    // Secret trigger variables - for fill test data
    let fillClickCount = 0;
    let fillClickTimer = null;
    
    // Secret trigger variables - for clear form data
    let clearClickCount = 0;
    let clearClickTimer = null;
    
    const MONTHS_AHEAD = 2;
    const MONTHS_BACK = 1;
    
    // Flag to prevent duplicate event listener registration
    let navigationListenersAdded = false;
    
    // Store the month/year when a booking is made
    let lastBookedMonth = null;
    let lastBookedYear = null;
    
    // HIPAA Compliance: Auto-logout after inactivity
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
    const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000; // Warn 2 minutes before
    const SESSION_CHECK_INTERVAL = 30 * 1000; // Check session validity every 30 seconds
    let inactivityTimer;
    let warningTimer;
    let sessionCheckTimer;
    let warningShown = false;
    let isLoggedOut = false; // Prevent multiple logout modals
    
    function resetInactivityTimer() {
      if (isLoggedOut) return; // Don't reset if already logged out
      
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      
      if (warningShown) {
        // Hide warning if user becomes active
        const warningBanner = document.getElementById('inactivityWarning');
        if (warningBanner) warningBanner.style.display = 'none';
        warningShown = false;
      }
      
      // Set warning timer
      warningTimer = setTimeout(function() {
        showInactivityWarning();
      }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);
      
      // Set logout timer
      inactivityTimer = setTimeout(function() {
        performAutoLogout('inactivity');
      }, INACTIVITY_TIMEOUT);
    }
    
    function showInactivityWarning() {
      if (isLoggedOut) return;
      warningShown = true;
      let warningBanner = document.getElementById('inactivityWarning');
      if (!warningBanner) {
        warningBanner = document.createElement('div');
        warningBanner.id = 'inactivityWarning';
        warningBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff9800;color:#000;padding:15px;text-align:center;z-index:99998;font-weight:600;';
        warningBanner.innerHTML = '⚠️ You will be logged out in 2 minutes due to inactivity. Move your mouse or press any key to stay logged in.';
        document.body.prepend(warningBanner);
      }
      warningBanner.style.display = 'block';
    }
    
    function performAutoLogout(reason) {
      if (isLoggedOut) return; // Prevent multiple calls
      isLoggedOut = true;
      
      // Stop all timers
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(sessionCheckTimer);
      
      // Hide the warning banner if showing
      const warningBanner = document.getElementById('inactivityWarning');
      if (warningBanner) warningBanner.style.display = 'none';
      
      // Disable the entire page to prevent further interaction
      document.body.style.pointerEvents = 'none';
      
      // Update modal message based on reason
      const titleEl = document.getElementById('autoLogoutTitle');
      const messageEl = document.getElementById('autoLogoutMessage');
      
      if (reason === 'other_session') {
        titleEl.textContent = 'Signed Out';
        messageEl.textContent = 'You have been signed out because someone logged into your account from another device or browser. Only one active session is allowed at a time.';
      } else if (reason === 'session_expired') {
        titleEl.textContent = 'Session Expired';
        messageEl.textContent = 'Your session has expired. Please log in again.';
      } else {
        titleEl.textContent = 'Session Expired';
        messageEl.textContent = 'You have been logged out due to inactivity for security purposes.';
      }
      
      // Show the auto-logout modal
      const autoLogoutModal = document.getElementById('autoLogoutModal');
      autoLogoutModal.style.pointerEvents = 'auto';
      autoLogoutModal.classList.add('visible');
      
      // Set up the OK button handler
      const okBtn = document.getElementById('autoLogoutOkBtn');
      okBtn.onclick = function() {
        okBtn.disabled = true;
        okBtn.textContent = 'Redirecting...';
        
        const token = '${safeToken}';
        // For other_session logout, session is already invalid, just get login page
        if (reason === 'other_session' || reason === 'session_expired') {
          google.script.run
            .withSuccessHandler(function(loginHtml) {
              clearTokenFromParentUrl();
              document.open();
              document.write(loginHtml);
              document.close();
            })
            .withFailureHandler(function() {
              clearTokenFromParentUrl();
              window.location.reload();
            })
            .getLoginPageHtml();
        } else if (token) {
          google.script.run
            .withSuccessHandler(function(loginHtml) {
              clearTokenFromParentUrl();
              document.open();
              document.write(loginHtml);
              document.close();
            })
            .withFailureHandler(function() {
              clearTokenFromParentUrl();
              window.location.reload();
            })
            .performLogout(token);
        } else {
          window.location.reload();
        }
      };
    }
    
    // Periodically check if session is still valid (detects logout from other sessions)
    function checkSessionValidity() {
      if (isLoggedOut) return;
      
      const token = '${safeToken}';
      if (!token) return;
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result.valid) {
            performAutoLogout(result.reason);
          }
        })
        .withFailureHandler(function() {
          // Network error - don't logout, will retry on next interval
        })
        .checkSessionValidity(token);
    }
    
    // Start session validity checks (only if authenticated)
    const hasToken = '${safeToken}' !== '';
    if (hasToken) {
      sessionCheckTimer = setInterval(checkSessionValidity, SESSION_CHECK_INTERVAL);
      // Also check immediately after a short delay (in case session was just invalidated)
      setTimeout(checkSessionValidity, 2000);
    }
    
    // Track user activity
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function(event) {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Start the inactivity timer
    resetInactivityTimer();
    
    // Reset initialization flag when page loads (needed because window persists across document.write)
    window.pageInitialized = false;
    
    // Initialization function - extracted so it can be called from DOMContentLoaded OR after document.write
    function initializePage() {
      // Prevent double initialization within the same page load
      if (window.pageInitialized) return;
      window.pageInitialized = true;
      
      google.script.run
        .withSuccessHandler(initializeCalendar)
        .withFailureHandler(showError)
        .getAvailableSlots();
      
      document.getElementById('firstName').addEventListener('input', validateForm);
      document.getElementById('lastName').addEventListener('input', validateForm);
      document.getElementById('gender').addEventListener('change', validateForm);
      document.getElementById('ssn').addEventListener('input', function(e) {
        var input = e.target;
        var raw = input.value.replace(/[^0-9]/g, '');
        if (raw.length > 9) raw = raw.substring(0, 9);
        var formatted = '';
        if (raw.length > 5) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-' + raw.substring(5);
        } else if (raw.length >= 5) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-';
        } else if (raw.length > 3) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3);
        } else if (raw.length === 3) {
          formatted = raw + '-';
        } else {
          formatted = raw;
        }
        input.value = formatted;
        updateSsnPhantom();
        validateForm();
      });
      document.getElementById('ssn').addEventListener('paste', function(e) {
        e.preventDefault();
        var pasted = (e.clipboardData || window.clipboardData).getData('text');
        var raw = pasted.replace(/[^0-9]/g, '').substring(0, 9);
        var formatted = '';
        if (raw.length > 5) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-' + raw.substring(5);
        } else if (raw.length >= 5) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-';
        } else if (raw.length > 3) {
          formatted = raw.substring(0, 3) + '-' + raw.substring(3);
        } else if (raw.length === 3) {
          formatted = raw + '-';
        } else {
          formatted = raw;
        }
        this.value = formatted;
        updateSsnPhantom();
        validateForm();
      });
      document.getElementById('ssn').addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
          var input = e.target;
          var pos = input.selectionStart;
          // If cursor is right after a dash, skip over it and delete the digit before it
          if (pos > 0 && input.value.charAt(pos - 1) === '-') {
            e.preventDefault();
            var raw = input.value.replace(/[^0-9]/g, '');
            // Figure out which digit to remove based on cursor position
            // Position 4 (after first dash) means remove 3rd digit, position 7 (after second dash) means remove 5th digit
            var digitIndex = pos <= 4 ? 2 : 4;
            raw = raw.substring(0, digitIndex) + raw.substring(digitIndex + 1);
            var formatted = '';
            if (raw.length > 5) {
              formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-' + raw.substring(5);
            } else if (raw.length >= 5) {
              formatted = raw.substring(0, 3) + '-' + raw.substring(3, 5) + '-';
            } else if (raw.length > 3) {
              formatted = raw.substring(0, 3) + '-' + raw.substring(3);
            } else if (raw.length === 3) {
              formatted = raw + '-';
            } else {
              formatted = raw;
            }
            input.value = formatted;
            // Place cursor where the deleted digit was
            var newPos = digitIndex <= 2 ? digitIndex : digitIndex + 1;
            input.setSelectionRange(newPos, newPos);
            updateSsnPhantom();
            validateForm();
          }
        }
      });
      document.getElementById('ssn').addEventListener('focus', function() {
        updateSsnPhantom();
      });
      document.getElementById('ssn').addEventListener('blur', function() {
        document.getElementById('ssnPhantom').style.display = 'none';
      });
      function updateSsnPhantom() {
        var phantom = document.getElementById('ssnPhantom');
        var raw = document.getElementById('ssn').value.replace(/[^0-9]/g, '');
        if (raw.length > 0 && raw.length < 9) {
          phantom.style.display = 'block';
        } else {
          phantom.style.display = 'none';
        }
      }
      document.getElementById('appointmentType').addEventListener('change', validateForm);
      document.getElementById('caseNumber').addEventListener('input', validateForm);
      document.getElementById('dob').addEventListener('input', validateForm);
      document.getElementById('address').addEventListener('input', validateForm);
      document.getElementById('city').addEventListener('input', validateForm);
      document.getElementById('state').addEventListener('input', validateForm);
      document.getElementById('zipCode').addEventListener('input', validateForm);
      function formatPhoneNumber(raw) {
        if (raw.length > 6) {
          return '(' + raw.substring(0, 3) + ') ' + raw.substring(3, 6) + '-' + raw.substring(6);
        } else if (raw.length === 6) {
          return '(' + raw.substring(0, 3) + ') ' + raw.substring(3) + '-';
        } else if (raw.length > 3) {
          return '(' + raw.substring(0, 3) + ') ' + raw.substring(3);
        } else if (raw.length === 3) {
          return '(' + raw + ') ';
        } else if (raw.length > 0) {
          return '(' + raw;
        } else {
          return raw;
        }
      }
      function countDigitsBefore(str, pos) {
        var count = 0;
        for (var i = 0; i < pos && i < str.length; i++) {
          if (/[0-9]/.test(str.charAt(i))) count++;
        }
        return count;
      }
      function findNthDigitPosition(str, n) {
        var count = 0;
        for (var i = 0; i < str.length; i++) {
          if (/[0-9]/.test(str.charAt(i))) {
            if (count === n) return i;
            count++;
          }
        }
        return str.length;
      }
      document.getElementById('phone').addEventListener('input', function(e) {
        var input = e.target;
        var raw = input.value.replace(/[^0-9]/g, '');
        if (raw.length > 10) raw = raw.substring(0, 10);
        input.value = formatPhoneNumber(raw);
        updatePhonePhantom();
        validateForm();
      });
      document.getElementById('phone').addEventListener('paste', function(e) {
        e.preventDefault();
        var pasted = (e.clipboardData || window.clipboardData).getData('text');
        var raw = pasted.replace(/[^0-9]/g, '').substring(0, 10);
        this.value = formatPhoneNumber(raw);
        updatePhonePhantom();
        validateForm();
      });
      document.getElementById('phone').addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
          var input = e.target;
          var pos = input.selectionStart;
          if (pos === 0) return;
          var ch = input.value.charAt(pos - 1);
          if (/[^0-9]/.test(ch)) {
            e.preventDefault();
            var raw = input.value.replace(/[^0-9]/g, '');
            var digitsBefore = countDigitsBefore(input.value, pos);
            if (digitsBefore === 0) {
              input.value = '';
              updatePhonePhantom();
              validateForm();
              return;
            }
            var removeIndex = digitsBefore - 1;
            raw = raw.substring(0, removeIndex) + raw.substring(removeIndex + 1);
            var formatted = formatPhoneNumber(raw);
            input.value = formatted;
            var newPos = findNthDigitPosition(formatted, removeIndex);
            input.setSelectionRange(newPos, newPos);
            updatePhonePhantom();
            validateForm();
          }
        }
      });
      document.getElementById('phone').addEventListener('focus', function() {
        updatePhonePhantom();
      });
      document.getElementById('phone').addEventListener('blur', function() {
        document.getElementById('phonePhantom').style.display = 'none';
      });
      function updatePhonePhantom() {
        var phantom = document.getElementById('phonePhantom');
        var raw = document.getElementById('phone').value.replace(/[^0-9]/g, '');
        if (raw.length > 0 && raw.length < 10) {
          phantom.style.display = 'block';
        } else {
          phantom.style.display = 'none';
        }
      }
      document.getElementById('email').addEventListener('input', validateForm);
      
      // Cancel reschedule button
      document.getElementById('cancelRescheduleBtn').addEventListener('click', cancelReschedule);
      
      // Secret fill test data trigger - click unavailable dot 3 times
      document.getElementById('fillTrigger').addEventListener('click', function(e) {
        e.preventDefault();
        fillClickCount++;
        
        if (fillClickTimer) {
          clearTimeout(fillClickTimer);
        }
        
        fillClickTimer = setTimeout(function() {
          fillClickCount = 0;
        }, 2000);
        
        if (fillClickCount >= 3) {
          fillClickCount = 0;
          fillTestData();
        }
      });
      
      // Secret clear form trigger - click available dot 3 times
      document.getElementById('clearTrigger').addEventListener('click', function(e) {
        e.preventDefault();
        clearClickCount++;
        
        if (clearClickTimer) {
          clearTimeout(clearClickTimer);
        }
        
        clearClickTimer = setTimeout(function() {
          clearClickCount = 0;
        }, 2000);
        
        if (clearClickCount >= 3) {
          clearClickCount = 0;
          clearFormData();
        }
      });
      
      ${logoutScript}
    }
    
    // Handle both normal page load AND document.write scenarios
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializePage);
    } else {
      // DOM already loaded (e.g., after document.write from login page)
      // Use setTimeout to ensure DOM is fully settled after document.write
      setTimeout(initializePage, 0);
    }
    
    // Fallback: Also try after a short delay in case the above methods fail
    // This handles edge cases with document.write() timing
    setTimeout(function() {
      if (!window.pageInitialized) {
        initializePage();
      }
    }, 100);
    
    // Test data email - change this for your environment (must match server-side TEST_DATA_EMAIL constant)
    const TEST_DATA_EMAIL = '${TEST_DATA_EMAIL}';
    
    function fillTestData() {
      google.script.run
        .withSuccessHandler(function(testNum) {
          document.getElementById('firstName').value = 'FirstName' + testNum;
          document.getElementById('lastName').value = 'LastName' + testNum;
          document.getElementById('gender').value = 'Male';
          document.getElementById('dob').value = '1990-01-15';
          document.getElementById('ssn').value = '123-45-6789';
          document.getElementById('appointmentType').value = 'Pre-Employment';
          document.getElementById('caseNumber').value = 'TEST-' + testNum;
          document.getElementById('phone').value = '(555) 123-4567';
          document.getElementById('email').value = TEST_DATA_EMAIL;
          document.getElementById('address').value = '123 Test Street';
          document.getElementById('city').value = 'Test City';
          document.getElementById('state').value = 'CA';
          document.getElementById('zipCode').value = '90210';
          validateForm();
        })
        .withFailureHandler(function(error) {
          const testNum = Math.floor(Math.random() * 10000);
          document.getElementById('firstName').value = 'FirstName' + testNum;
          document.getElementById('lastName').value = 'LastName' + testNum;
          document.getElementById('gender').value = 'Male';
          document.getElementById('dob').value = '1990-01-15';
          document.getElementById('ssn').value = '123-45-6789';
          document.getElementById('appointmentType').value = 'Pre-Employment';
          document.getElementById('caseNumber').value = 'TEST-' + testNum;
          document.getElementById('phone').value = '(555) 123-4567';
          document.getElementById('email').value = TEST_DATA_EMAIL;
          document.getElementById('address').value = '123 Test Street';
          document.getElementById('city').value = 'Test City';
          document.getElementById('state').value = 'CA';
          document.getElementById('zipCode').value = '90210';
          validateForm();
        })
        .getNextTestNumber();
    }
    
    function clearFormData() {
      cancelReschedule();
      document.getElementById('firstName').value = '';
      document.getElementById('lastName').value = '';
      document.getElementById('gender').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('ssn').value = '';
      document.getElementById('appointmentType').value = '';
      document.getElementById('caseNumber').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('email').value = '';
      document.getElementById('address').value = '';
      document.getElementById('city').value = '';
      document.getElementById('state').value = '';
      document.getElementById('zipCode').value = '';
      validateForm();
    }
    
    function initializeCalendar(slots) {
      allSlots = slots;
      
      slotsByDate = {};
      slots.forEach(slot => {
        const dateKey = slot.dateKey;
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = [];
        }
        slotsByDate[dateKey].push(slot);
      });
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
      
      renderCalendar();
      loadMonthlyBookings();
      
      if (selectedDateKey && slotsByDate[selectedDateKey]) {
        const dateDisplay = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        refreshTimeSlotsDisplay(selectedDateKey, dateDisplay);
        loadBookingsForDate(selectedDateKey, dateDisplay);
      }
      
      // Only add navigation listeners once
      if (!navigationListenersAdded) {
        // Top navigation
        document.getElementById('prevMonth').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => navigateMonth(1));
        
        // Bottom navigation
        document.getElementById('prevMonthBottom').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('nextMonthBottom').addEventListener('click', () => navigateMonth(1));
        document.getElementById('todayBtn').addEventListener('click', goToToday);
        
        navigationListenersAdded = true;
      }
    }
    
    function navigateMonth(direction) {
      if (isProcessing) return;
      currentDate.setMonth(currentDate.getMonth() + direction);
      clearSelection();
      renderCalendar();
      loadMonthlyBookings();
    }
    
    function goToToday() {
      if (isProcessing) return;
      currentDate = new Date();
      clearSelection();
      renderCalendar();
      loadMonthlyBookings();
    }
    
    function refreshTimeSlotsDisplay(dateKey, dateDisplay) {
      const slotsHeader = document.getElementById('slotsHeader');
      const slotsContent = document.getElementById('slotsContent');
      
      const slots = slotsByDate[dateKey] || [];
      slotsHeader.textContent = dateDisplay;
      
      let slotsHtml = '<div class="slots-grid">';
      slots.forEach((slot, index) => {
        const isFull = slot.remaining === 0;
        const isLow = !isFull && slot.remaining < slot.capacity;
        
        let availClass = '';
        let availText = slot.remaining + ' / ' + slot.capacity;
        
        if (isFull) {
          availClass = ' full';
        } else if (isLow) {
          availClass = ' low';
        }
        
        const btnClass = isFull ? 'slot-btn full' : 'slot-btn';
        const disabledAttr = isFull ? ' disabled' : '';
        const selectedClass = (selectedSlot && selectedSlot.row === slot.row) ? ' selected' : '';
        
        slotsHtml += '<button type="button" class="' + btnClass + selectedClass + '" data-index="' + index + '"' + disabledAttr + '>' +
          '<span class="slot-time">' + slot.startTime + '</span>' +
          '<span class="slot-availability' + availClass + '">' + availText + '</span>' +
          '</button>';
      });
      slotsHtml += '</div>';
      slotsContent.innerHTML = slotsHtml;
      
      document.querySelectorAll('.slot-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
          if (isProcessing) return;
          const index = parseInt(this.getAttribute('data-index'));
          selectSlot(slots[index], this);
        });
      });
    }
    
    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const now = new Date();
      const maxMonth = new Date(now.getFullYear(), now.getMonth() + MONTHS_AHEAD, 1);
      const minMonth = new Date(now.getFullYear(), now.getMonth() - MONTHS_BACK, 1);
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      document.getElementById('currentMonth').textContent = monthNames[month] + ' ' + year;
      
      const canGoPrev = !isProcessing && (year > minMonth.getFullYear() || 
        (year === minMonth.getFullYear() && month > minMonth.getMonth()));
      
      const canGoNext = !isProcessing && (year < maxMonth.getFullYear() || 
        (year === maxMonth.getFullYear() && month < maxMonth.getMonth()));
      
      const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
      
      // Update top navigation buttons
      document.getElementById('prevMonth').disabled = !canGoPrev;
      document.getElementById('nextMonth').disabled = !canGoNext;
      
      // Update bottom navigation buttons
      document.getElementById('prevMonthBottom').disabled = !canGoPrev;
      document.getElementById('nextMonthBottom').disabled = !canGoNext;
      document.getElementById('todayBtn').disabled = isCurrentMonth || isProcessing;
      
      const grid = document.getElementById('calendarGrid');
      grid.innerHTML = '';
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      
      const totalCells = 42;
      
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('button');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        day.disabled = true;
        grid.appendChild(day);
      }
      
      for (let d = 1; d <= daysInMonth; d++) {
        const dayDate = new Date(year, month, d);
        const dateKey = formatDateKey(dayDate);
        const day = document.createElement('button');
        day.className = 'calendar-day';
        day.textContent = d;
        
        const isPast = dayDate < today;
        const daySlots = slotsByDate[dateKey] || [];
        const totalRemaining = daySlots.reduce((sum, s) => sum + s.remaining, 0);
        const totalCapacity = daySlots.reduce((sum, s) => sum + s.capacity, 0);
        const hasSlots = daySlots.length > 0;
        const isToday = dayDate.getTime() === today.getTime();
        const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
        const isFull = hasSlots && totalRemaining === 0;
        const isPartial = hasSlots && totalRemaining > 0 && totalRemaining < totalCapacity;
        
        if (isToday) day.classList.add('today');
        if (isPast || isProcessing) {
          day.classList.add('past');
          day.disabled = true;
        } else if (hasSlots) {
          if (isFull) {
            day.classList.add('full-slots');
          } else if (isPartial) {
            day.classList.add('partial-slots');
          } else {
            day.classList.add('has-slots');
          }
          if (isSelected) day.classList.add('selected');
          
          const badge = document.createElement('span');
          badge.className = 'slot-count';
          badge.textContent = totalRemaining > 99 ? '99+' : totalRemaining;
          day.appendChild(badge);
          
          if (!isProcessing) {
            day.addEventListener('click', () => selectDate(dayDate, dateKey));
          }
        } else {
          day.disabled = true;
        }
        
        grid.appendChild(day);
      }
      
      const cellsUsed = firstDay + daysInMonth;
      const remaining = totalCells - cellsUsed;
      for (let i = 1; i <= remaining; i++) {
        const day = document.createElement('button');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        day.disabled = true;
        grid.appendChild(day);
      }
    }
    
    function formatDateKey(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }
    
    function selectDate(date, dateKey) {
      if (isProcessing) return;
      
      selectedDate = date;
      selectedDateKey = dateKey;
      selectedSlot = null;
      
      updateSlotDisplay();
      
      document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
      document.querySelectorAll('.calendar-day.has-slots, .calendar-day.full-slots').forEach(el => {
        const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        const d = parseInt(textNode ? textNode.textContent : el.textContent);
        const elDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
        if (elDate.getTime() === date.getTime()) {
          el.classList.add('selected');
        }
      });
      
      const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      refreshTimeSlotsDisplay(dateKey, dateDisplay);
      
      loadBookingsForDate(dateKey, dateDisplay);
      
      validateForm();
    }
    
    function loadBookingsForDate(dateKey, dateDisplay) {
  const bookedContent = document.getElementById('bookedContent');
  const bookedCount = document.getElementById('bookedCount');
  
  // Increment request ID to invalidate any pending requests
  dateBookingsRequestId++;
  const currentRequestId = dateBookingsRequestId;
  
  bookedContent.innerHTML = '<div class="booked-loading"><div class="loading-spinner-small"><img src="https://www.shadowaisolutions.com/SAIS%20Logo.png" alt="Loading"></div><div class="booked-loading-text">Loading bookings...</div></div>';
  bookedCount.style.display = 'none';
  
  google.script.run
    .withSuccessHandler(function(bookings) {
      // Check if this request is still valid (no newer request has been made)
      if (currentRequestId !== dateBookingsRequestId) {
        return; // Ignore stale response
      }
      
      if (bookings.length === 0) {
        bookedContent.innerHTML = '<div class="no-bookings">No appointments booked for ' + dateDisplay + '</div>';
        bookedCount.style.display = 'none';
      } else {
        bookedCount.textContent = bookings.length;
        bookedCount.style.display = 'inline';
        
        let html = '<div class="booked-list">';
        
        // Render 2 per row
        for (let i = 0; i < bookings.length; i += 2) {
          html += '<div class="booked-row">';
          
          // First booking
          const booking1 = bookings[i];
          // Full HTML escaping for both display and textarea contexts to prevent XSS
          const noteEscaped1 = booking1.note ? booking1.note.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';
          const note1 = noteEscaped1;
          const noteDisplay1 = noteEscaped1 || 'Comments';
          const noteClass1 = booking1.note ? '' : ' empty';
          const vaccineStatus1 = booking1.isNoProof ? '<span class="upload-status pending">⚠NoVacc</span>' : booking1.hasUploaded ? '<span class="upload-status uploaded">✓Vacc</span>' : '<span class="upload-status not-uploaded">✗Vacc</span>';
          const questionStatus1 = booking1.hasUploadedQuestionnaire ? '<span class="upload-status uploaded">✓Quest</span>' : '<span class="upload-status not-uploaded">✗Quest</span>';
          let visitStatusHtml1 = '';
          if (!booking1.visitStatus || booking1.visitStatus === '') {
            visitStatusHtml1 = '<span class="visit-status pending">○ Pending</span>';
          } else if (booking1.visitStatus.toString().toLowerCase() === 'no-show') {
            visitStatusHtml1 = '<span class="visit-status not-uploaded">✗ No-Show</span>';
          } else {
              visitStatusHtml1 = '<span class="visit-status uploaded">✓ ' + safeVisitStatus1 + '</span>';
            }
          const uploadStatus1 = '<div class="upload-status-container">' + vaccineStatus1 + questionStatus1 + '</div><div class="visit-status-row">' + visitStatusHtml1 + '</div>';
          const noShowClass1 = (booking1.visitStatus && booking1.visitStatus.toString().toLowerCase() === 'no-show') ? ' no-show' : '';
          const escapedName1 = booking1.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          html += '<div class="booked-item' + noShowClass1 + '">' +
            '<div class="booked-name">' + escapedName1 + '</div>' +
            '<div class="booked-details-row">' +
              '<div class="booked-details">' +
                '<div class="booked-email">' + (booking1.email || 'No email').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
                '<div class="booked-time">🕐 ' + booking1.time.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '</div>' +
                  '<div class="booked-appt-type">📋 ' + (booking1.appointmentType ? booking1.appointmentType.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : 'N/A') + '</div>' +
                '<div class="booked-note-container" data-patient-id="' + booking1.patientId + '">' +
                  '<div class="booked-note-display' + noteClass1 + '">' + noteDisplay1 + '</div>' +
                  '<div class="booked-note-edit"><textarea maxlength="500" placeholder="Add a note...">' + note1 + '</textarea></div>' +
                '</div>' +
              '</div>' +
              '<div class="booking-actions">' +
                '<button class="reschedule-btn" data-patient-id="' + booking1.patientId + '" data-appointment-row="' + booking1.appointmentRow + '">Reschedule</button>' +
                '<button class="unbook-btn" data-patient-id="' + booking1.patientId + '" data-patient-name="' + escapedName1 + '" data-patient-time="' + escapeHtml(booking1.time) + '" data-patient-email="' + escapeHtml(booking1.email || '') + '" data-appointment-row="' + booking1.appointmentRow + '">Unbook</button>' +
                '<div class="note-actions">' +
                  '<button class="note-btn edit-note-btn" data-patient-id="' + booking1.patientId + '">Edit Comment</button>' +
                  '<button class="note-btn save-note-btn" data-patient-id="' + booking1.patientId + '" style="display:none;">Save</button>' +
                  '<button class="note-btn cancel-btn cancel-note-btn" data-patient-id="' + booking1.patientId + '" style="display:none;">Cancel</button>' +
                '</div>' +
                uploadStatus1 +
              '</div>' +
            '</div>' +
          '</div>';
          
          // Second booking (if exists)
          if (i + 1 < bookings.length) {
            const booking2 = bookings[i + 1];
            // Full HTML escaping for both display and textarea contexts to prevent XSS
            const noteEscaped2 = booking2.note ? booking2.note.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';
            const note2 = noteEscaped2;
            const noteDisplay2 = noteEscaped2 || 'Comments';
            const noteClass2 = booking2.note ? '' : ' empty';
            const vaccineStatus2 = booking2.isNoProof ? '<span class="upload-status pending">⚠NoVacc</span>' : booking2.hasUploaded ? '<span class="upload-status uploaded">✓Vacc</span>' : '<span class="upload-status not-uploaded">✗Vacc</span>';
            const questionStatus2 = booking2.hasUploadedQuestionnaire ? '<span class="upload-status uploaded">✓Quest</span>' : '<span class="upload-status not-uploaded">✗Quest</span>';
            let visitStatusHtml2 = '';
            if (!booking2.visitStatus || booking2.visitStatus === '') {
              visitStatusHtml2 = '<span class="visit-status pending">○ Pending</span>';
            } else if (booking2.visitStatus.toString().toLowerCase() === 'no-show') {
              visitStatusHtml2 = '<span class="visit-status not-uploaded">✗ No-Show</span>';
            } else {
              visitStatusHtml2 = '<span class="visit-status uploaded">✓ ' + safeVisitStatus2 + '</span>';
            }
            const uploadStatus2 = '<div class="upload-status-container">' + vaccineStatus2 + questionStatus2 + '</div><div class="visit-status-row">' + visitStatusHtml2 + '</div>';
            const noShowClass2 = (booking2.visitStatus && booking2.visitStatus.toString().toLowerCase() === 'no-show') ? ' no-show' : '';
            const escapedName2 = booking2.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            const escapedEmail2 = (booking2.email || 'No email').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += '<div class="booked-item' + noShowClass2 + '">' +
              '<div class="booked-name">' + escapedName2 + '</div>' +
              '<div class="booked-details-row">' +
                '<div class="booked-details">' +
                  '<div class="booked-email">' + escapedEmail2 + '</div>' +
                  '<div class="booked-time">🕐 ' + booking2.time.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '</div>' +
                    '<div class="booked-appt-type">📋 ' + (booking2.appointmentType ? booking2.appointmentType.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'N/A') + '</div>' +
                  '<div class="booked-note-container" data-patient-id="' + booking2.patientId + '">' +
                    '<div class="booked-note-display' + noteClass2 + '">' + noteDisplay2 + '</div>' +
                    '<div class="booked-note-edit"><textarea maxlength="500" placeholder="Add a note...">' + note2 + '</textarea></div>' +
                  '</div>' +
                '</div>' +
                '<div class="booking-actions">' +
                  '<button class="reschedule-btn" data-patient-id="' + booking2.patientId + '" data-appointment-row="' + booking2.appointmentRow + '">Reschedule</button>' +
                  '<button class="unbook-btn" data-patient-id="' + booking2.patientId + '" data-patient-name="' + escapedName2 + '" data-patient-time="' + escapeHtml(booking2.time) + '" data-patient-email="' + escapeHtml(booking2.email || '') + '" data-appointment-row="' + booking2.appointmentRow + '">Unbook</button>' +
                  '<div class="note-actions">' +
                    '<button class="note-btn edit-note-btn" data-patient-id="' + booking2.patientId + '">Edit Comment</button>' +
                    '<button class="note-btn save-note-btn" data-patient-id="' + booking2.patientId + '" style="display:none;">Save</button>' +
                    '<button class="note-btn cancel-btn cancel-note-btn" data-patient-id="' + booking2.patientId + '" style="display:none;">Cancel</button>' +
                  '</div>' +
                  uploadStatus2 +
                '</div>' +
              '</div>' +
            '</div>';
          } else {
            html += '<div class="booked-item empty-placeholder"></div>';
          }
          
          html += '</div>';
        }
        
        html += '</div>';
        bookedContent.innerHTML = html;
        
        document.querySelectorAll('#bookedContent .reschedule-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            const appointmentRow = parseInt(this.getAttribute('data-appointment-row'));
            startReschedule(patientId, appointmentRow);
          });
        });
        
        document.querySelectorAll('#bookedContent .unbook-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            const patientName = this.getAttribute('data-patient-name');
            const patientTime = this.getAttribute('data-patient-time');
            const patientEmail = this.getAttribute('data-patient-email');
            const appointmentRow = parseInt(this.getAttribute('data-appointment-row'));
            startUnbook(patientId, patientName, patientTime, patientEmail, appointmentRow);
          });
        });
        
        // If in rescheduling mode, disable all reschedule, unbook, and edit note buttons
        if (isRescheduling) {
          document.querySelectorAll('#bookedContent .reschedule-btn').forEach(function(btn) {
            btn.disabled = true;
          });
          document.querySelectorAll('#bookedContent .unbook-btn').forEach(function(btn) {
            btn.disabled = true;
          });
          document.querySelectorAll('#bookedContent .edit-note-btn').forEach(function(btn) {
            btn.disabled = true;
          });
        }
        
        // Add note button event listeners
        attachNoteEventListeners('#bookedContent');
      }
    })
    .withFailureHandler(function(error) {
      // Check if this request is still valid
      if (currentRequestId !== dateBookingsRequestId) {
        return; // Ignore stale response
      }
      
      bookedContent.innerHTML = '<div class="no-bookings">Error loading bookings</div>';
      bookedCount.style.display = 'none';
    })
    .getBookingsForDate(dateKey, '${safeToken}');
}
    
    function loadMonthlyBookings() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthlyContent = document.getElementById('monthlyBookedContent');
  const monthlyCount = document.getElementById('monthlyBookedCount');
  
  // Increment request ID to invalidate any pending requests
  monthlyBookingsRequestId++;
  const currentRequestId = monthlyBookingsRequestId;
  
  monthlyContent.innerHTML = '<div class="booked-loading"><div class="loading-spinner-small"><img src="https://www.shadowaisolutions.com/SAIS%20Logo.png" alt="Loading"></div><div class="booked-loading-text">Loading monthly appointments...</div></div>';
  monthlyCount.style.display = 'none';
  
  google.script.run
    .withSuccessHandler(function(bookings) {
      // Check if this request is still valid (no newer request has been made)
      if (currentRequestId !== monthlyBookingsRequestId) {
        return; // Ignore stale response
      }
      
      if (bookings.length === 0) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'];
        monthlyContent.innerHTML = '<div class="no-bookings">No appointments booked for ' + monthNames[month] + ' ' + year + '</div>';
        monthlyCount.style.display = 'none';
      } else {
        monthlyCount.textContent = bookings.length;
        monthlyCount.style.display = 'inline';
        
        const groupedBookings = {};
        bookings.forEach(function(booking) {
          if (!groupedBookings[booking.dateDisplay]) {
            groupedBookings[booking.dateDisplay] = [];
          }
          groupedBookings[booking.dateDisplay].push(booking);
        });
        
        let html = '<div class="monthly-booked-list">';
        
        const sortedDates = Object.keys(groupedBookings).sort(function(a, b) {
          return new Date(a) - new Date(b);
        });
        
        sortedDates.forEach(function(dateDisplay) {
          const safeDateDisplay = dateDisplay.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          html += '<div class="date-group-header">📅 ' + safeDateDisplay + '</div>';
          
          const dateBookings = groupedBookings[dateDisplay];
          
          for (let i = 0; i < dateBookings.length; i += 2) {
            html += '<div class="booked-row">';
            
            const booking1 = dateBookings[i];
            // Full HTML escaping for both display and textarea contexts to prevent XSS
            const noteEscaped1 = booking1.note ? booking1.note.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';
            const note1 = noteEscaped1;
            const noteDisplay1 = noteEscaped1 || 'Comments';
            const noteClass1 = booking1.note ? '' : ' empty';
            const vaccineStatus1 = booking1.isNoProof ? '<span class="upload-status pending">⚠NoVacc</span>' : booking1.hasUploaded ? '<span class="upload-status uploaded">✓Vacc</span>' : '<span class="upload-status not-uploaded">✗Vacc</span>';
          const questionStatus1 = booking1.hasUploadedQuestionnaire ? '<span class="upload-status uploaded">✓Quest</span>' : '<span class="upload-status not-uploaded">✗Quest</span>';
          let visitStatusHtml1 = '';
          if (!booking1.visitStatus || booking1.visitStatus === '') {
            visitStatusHtml1 = '<span class="visit-status pending">○ Pending</span>';
          } else if (booking1.visitStatus.toString().toLowerCase() === 'no-show') {
            visitStatusHtml1 = '<span class="visit-status not-uploaded">✗ No-Show</span>';
          } else {
              visitStatusHtml1 = '<span class="visit-status uploaded">✓ ' + safeVisitStatus1 + '</span>';
            }
          const uploadStatus1 = '<div class="upload-status-container">' + vaccineStatus1 + questionStatus1 + '</div><div class="visit-status-row">' + visitStatusHtml1 + '</div>';
          const noShowClass1 = (booking1.visitStatus && booking1.visitStatus.toString().toLowerCase() === 'no-show') ? ' no-show' : '';
            const escapedMonthlyName1 = booking1.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            const escapedMonthlyEmail1 = (booking1.email || 'No email').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += '<div class="booked-item' + noShowClass1 + '">' +
              '<div class="booked-name">' + escapedMonthlyName1 + '</div>' +
              '<div class="booked-details-row">' +
                '<div class="booked-details">' +
                  '<div class="booked-email">' + escapedMonthlyEmail1 + '</div>' +
                  '<div class="booked-time">🕐 ' + booking1.time.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '</div>' +
                    '<div class="booked-appt-type">📋 ' + (booking1.appointmentType ? booking1.appointmentType.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : 'N/A') + '</div>' +
                    '<div class="booked-note-container" data-patient-id="' + booking1.patientId + '">' +
                    '<div class="booked-note-display' + noteClass1 + '">' + noteDisplay1 + '</div>' +
                    '<div class="booked-note-edit"><textarea maxlength="500" placeholder="Add a note...">' + note1 + '</textarea></div>' +
                  '</div>' +
                '</div>' +
                '<div class="booking-actions">' +
                  '<button class="reschedule-btn monthly-reschedule" data-patient-id="' + booking1.patientId + '" data-appointment-row="' + booking1.appointmentRow + '">Reschedule</button>' +
                  '<button class="unbook-btn monthly-unbook" data-patient-id="' + booking1.patientId + '" data-patient-name="' + escapedMonthlyName1 + '" data-patient-time="' + escapeHtml(booking1.time) + '" data-patient-email="' + escapeHtml(booking1.email || '') + '" data-appointment-row="' + booking1.appointmentRow + '">Unbook</button>' +
                  '<div class="note-actions">' +
                    '<button class="note-btn edit-note-btn" data-patient-id="' + booking1.patientId + '">Edit Comment</button>' +
                    '<button class="note-btn save-note-btn" data-patient-id="' + booking1.patientId + '" style="display:none;">Save</button>' +
                    '<button class="note-btn cancel-btn cancel-note-btn" data-patient-id="' + booking1.patientId + '" style="display:none;">Cancel</button>' +
                  '</div>' +
                  uploadStatus1 +
                '</div>' +
              '</div>' +
            '</div>';
            
            if (i + 1 < dateBookings.length) {
              const booking2 = dateBookings[i + 1];
              // Full HTML escaping for both display and textarea contexts to prevent XSS
              const noteEscaped2 = booking2.note ? booking2.note.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';
              const note2 = noteEscaped2;
              const noteDisplay2 = noteEscaped2 || 'Comments';
              const noteClass2 = booking2.note ? '' : ' empty';
              const vaccineStatus2 = booking2.isNoProof ? '<span class="upload-status pending">⚠NoVacc</span>' : booking2.hasUploaded ? '<span class="upload-status uploaded">✓Vacc</span>' : '<span class="upload-status not-uploaded">✗Vacc</span>';
            const questionStatus2 = booking2.hasUploadedQuestionnaire ? '<span class="upload-status uploaded">✓Quest</span>' : '<span class="upload-status not-uploaded">✗Quest</span>';
            let visitStatusHtml2 = '';
            if (!booking2.visitStatus || booking2.visitStatus === '') {
              visitStatusHtml2 = '<span class="visit-status pending">○ Pending</span>';
            } else if (booking2.visitStatus.toString().toLowerCase() === 'no-show') {
              visitStatusHtml2 = '<span class="visit-status not-uploaded">✗ No-Show</span>';
            } else {
              visitStatusHtml2 = '<span class="visit-status uploaded">✓ ' + safeVisitStatus2 + '</span>';
            }
            const uploadStatus2 = '<div class="upload-status-container">' + vaccineStatus2 + questionStatus2 + '</div><div class="visit-status-row">' + visitStatusHtml2 + '</div>';
            const noShowClass2 = (booking2.visitStatus && booking2.visitStatus.toString().toLowerCase() === 'no-show') ? ' no-show' : '';
              const escapedMonthlyName2 = booking2.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
              const escapedMonthlyEmail2 = (booking2.email || 'No email').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              html += '<div class="booked-item' + noShowClass2 + '">' +
                '<div class="booked-name">' + escapedMonthlyName2 + '</div>' +
                '<div class="booked-details-row">' +
                  '<div class="booked-details">' +
                    '<div class="booked-email">' + escapedMonthlyEmail2 + '</div>' +
                    '<div class="booked-time">🕐 ' + booking2.time.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '</div>' +
                    '<div class="booked-appt-type">📋 ' + (booking2.appointmentType ? booking2.appointmentType.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'N/A') + '</div>' +
                    '<div class="booked-note-container" data-patient-id="' + booking2.patientId + '">' +
                      '<div class="booked-note-display' + noteClass2 + '">' + noteDisplay2 + '</div>' +
                      '<div class="booked-note-edit"><textarea maxlength="500" placeholder="Add a note...">' + note2 + '</textarea></div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="booking-actions">' +
                    '<button class="reschedule-btn monthly-reschedule" data-patient-id="' + booking2.patientId + '" data-appointment-row="' + booking2.appointmentRow + '">Reschedule</button>' +
                    '<button class="unbook-btn monthly-unbook" data-patient-id="' + booking2.patientId + '" data-patient-name="' + escapedMonthlyName2 + '" data-patient-time="' + escapeHtml(booking2.time) + '" data-patient-email="' + escapeHtml(booking2.email || '') + '" data-appointment-row="' + booking2.appointmentRow + '">Unbook</button>' +
                    '<div class="note-actions">' +
                      '<button class="note-btn edit-note-btn" data-patient-id="' + booking2.patientId + '">Edit Comment</button>' +
                      '<button class="note-btn save-note-btn" data-patient-id="' + booking2.patientId + '" style="display:none;">Save</button>' +
                      '<button class="note-btn cancel-btn cancel-note-btn" data-patient-id="' + booking2.patientId + '" style="display:none;">Cancel</button>' +
                    '</div>' +
                    uploadStatus2 +
                  '</div>' +
                '</div>' +
              '</div>';
            } else {
              html += '<div class="booked-item empty-placeholder"></div>';
            }
            
            html += '</div>';
          }
        });
        
        html += '</div>';
        monthlyContent.innerHTML = html;
        
        document.querySelectorAll('#monthlyBookedContent .reschedule-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            const appointmentRow = parseInt(this.getAttribute('data-appointment-row'));
            startReschedule(patientId, appointmentRow);
          });
        });
        
        document.querySelectorAll('#monthlyBookedContent .unbook-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            const patientName = this.getAttribute('data-patient-name');
            const patientTime = this.getAttribute('data-patient-time');
            const patientEmail = this.getAttribute('data-patient-email');
            const appointmentRow = parseInt(this.getAttribute('data-appointment-row'));
            startUnbook(patientId, patientName, patientTime, patientEmail, appointmentRow);
          });
        });
        
        // If in rescheduling mode, disable all reschedule, unbook, and edit note buttons
        if (isRescheduling) {
          document.querySelectorAll('#monthlyBookedContent .reschedule-btn').forEach(function(btn) {
            btn.disabled = true;
          });
          document.querySelectorAll('#monthlyBookedContent .unbook-btn').forEach(function(btn) {
            btn.disabled = true;
          });
          document.querySelectorAll('#monthlyBookedContent .edit-note-btn').forEach(function(btn) {
            btn.disabled = true;
          });
        }
        
        // Add note button event listeners
        attachNoteEventListeners('#monthlyBookedContent');
      }
    })
    .withFailureHandler(function(error) {
      // Check if this request is still valid
      if (currentRequestId !== monthlyBookingsRequestId) {
        return; // Ignore stale response
      }
      
      monthlyContent.innerHTML = '<div class="no-bookings">Error loading monthly appointments</div>';
      monthlyCount.style.display = 'none';
    })
    .getBookingsForMonth(year, month, '${safeToken}');
}
    
    function startReschedule(patientId, appointmentRow) {
  // Immediately disable ALL reschedule, unbook, and edit note buttons
  document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
    btn.disabled = true;
    if (btn.getAttribute('data-patient-id') === patientId) {
      btn.textContent = 'Loading...';
    }
  });
  
  document.querySelectorAll('.unbook-btn').forEach(function(btn) {
    btn.disabled = true;
  });
  
  document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
    btn.disabled = true;
  });
  
  // Username is derived server-side from session token for audit logging
  google.script.run
        .withSuccessHandler(function(patient) {
          if (patient) {
            isRescheduling = true;
            reschedulingPatientId = patientId;
            reschedulingOldRow = appointmentRow;
            
            document.getElementById('firstName').value = patient.firstName || '';
            document.getElementById('lastName').value = patient.lastName || '';
            document.getElementById('gender').value = patient.gender || '';
            document.getElementById('dob').value = patient.dob || '';
            document.getElementById('ssn').value = patient.ssn || '';
            document.getElementById('appointmentType').value = patient.appointmentType || '';
            document.getElementById('caseNumber').value = patient.caseNumber || '';
            document.getElementById('phone').value = patient.phone || '';
            document.getElementById('email').value = patient.email || '';
            document.getElementById('address').value = patient.address || '';
            document.getElementById('city').value = patient.city || '';
            document.getElementById('state').value = patient.state || '';
            document.getElementById('zipCode').value = patient.zipCode || '';
            document.getElementById('reschedulingPatientId').value = patientId;
        
        document.getElementById('rescheduleBanner').classList.add('visible');
        document.getElementById('rescheduleBannerPatientId').textContent = patientId + ' - ' + patient.lastName + ', ' + patient.firstName;
        
        document.getElementById('submitBtn').textContent = 'Confirm Reschedule';
        document.getElementById('submitBtn').classList.add('reschedule-mode');
        
        document.getElementById('submitNotice').innerHTML = '<span class="submit-notice-icon">🔄</span><span>This will update the existing appointment to the new selected time slot.</span>';
        
        document.querySelectorAll('#bookingForm input:not([type="hidden"])').forEach(function(field) {
          field.classList.add('reschedule-mode');
          field.readOnly = true;
        });
        
        document.querySelectorAll('#bookingForm select').forEach(function(field) {
          field.classList.add('reschedule-mode');
          field.disabled = true;
        });
        
        // Keep buttons disabled (already disabled above, but ensure they stay disabled)
        document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
          btn.disabled = true;
          btn.textContent = 'Reschedule';
        });
        
        document.querySelectorAll('.unbook-btn').forEach(function(btn) {
          btn.disabled = true;
        });
        
        document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
          btn.disabled = true;
        });
        
        selectedSlot = null;
        updateSlotDisplay();
        
        document.getElementById('formContainer').scrollIntoView({ behavior: 'smooth' });
        
        validateForm();
      } else {
        alert('Could not load patient details. Please try again.');
        // Re-enable buttons on failure
        document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
          btn.disabled = false;
          btn.textContent = 'Reschedule';
        });
        document.querySelectorAll('.unbook-btn').forEach(function(btn) {
          btn.disabled = false;
        });
        document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
          if (btn.style.display !== 'none') {
            btn.disabled = false;
          }
        });
      }
    })
    .withFailureHandler(function(error) {
      alert('Error loading patient details. Please try again.');
      // Don't log error details client-side - may contain PHI
      // Re-enable buttons on error
      document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
        btn.disabled = false;
        btn.textContent = 'Reschedule';
      });
      document.querySelectorAll('.unbook-btn').forEach(function(btn) {
        btn.disabled = false;
      });
      document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
        if (btn.style.display !== 'none') {
          btn.disabled = false;
        }
      });
    })
    .getPatientDetails(patientId, '${safeToken}');
}
    
    // Unbook modal state
    let unbookPatientId = null;
    let unbookAppointmentRow = null;
    
    // Duplicate patient modal state
    let duplicatePatientData = null;
    let pendingBookingData = null;
    
    function startUnbook(patientId, patientName, patientTime, patientEmail, appointmentRow) {
      unbookPatientId = patientId;
      unbookAppointmentRow = appointmentRow;
      
      document.getElementById('unbookPatientName').textContent = patientName;
      document.getElementById('unbookPatientTime').textContent = '🕐 ' + patientTime;
      document.getElementById('unbookPatientEmail').textContent = '✉️ ' + patientEmail;
      document.getElementById('unbookPatientId').textContent = patientId;
      document.getElementById('unbookModal').classList.add('visible');
    }
    
    // Unbook modal handlers
    document.getElementById('unbookCancelBtn').addEventListener('click', function() {
      document.getElementById('unbookModal').classList.remove('visible');
      unbookPatientId = null;
      unbookAppointmentRow = null;
    });
    
    // Close unbook modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('unbookModal').classList.contains('visible')) {
    // Don't allow closing while processing
    if (document.getElementById('unbookConfirmBtn').disabled) {
      return;
    }
    document.getElementById('unbookModal').classList.remove('visible');
    unbookPatientId = null;
    unbookAppointmentRow = null;
  }
});
    
    document.getElementById('unbookConfirmBtn').addEventListener('click', function() {
  if (!unbookPatientId || !unbookAppointmentRow) return;
  
  const confirmBtn = document.getElementById('unbookConfirmBtn');
  const cancelBtn = document.getElementById('unbookCancelBtn');
  
  confirmBtn.disabled = true;
  cancelBtn.disabled = true;
  confirmBtn.textContent = 'Unbooking...';
  
  google.script.run
    .withSuccessHandler(function(result) {
      document.getElementById('unbookModal').classList.remove('visible');
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      confirmBtn.textContent = 'Unbook';
      
      if (result.success) {
        // Reset unbook state
        unbookPatientId = null;
        unbookAppointmentRow = null;
        
        // Reset rescheduling state if active
        isRescheduling = false;
        reschedulingPatientId = null;
        reschedulingOldRow = null;
        
        // Clear selection state
        selectedDate = null;
        selectedDateKey = null;
        selectedSlot = null;
        
        // Invalidate any pending requests
        dateBookingsRequestId++;
        monthlyBookingsRequestId++;
        
        // Clear data
        allSlots = [];
        slotsByDate = {};
        
        // Reset form
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('dob').value = '';
        document.getElementById('ssn').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('address').value = '';
        document.getElementById('city').value = '';
        document.getElementById('state').value = '';
        document.getElementById('zipCode').value = '';
        document.getElementById('reschedulingPatientId').value = '';
        
        // Reset reschedule UI elements
        document.getElementById('rescheduleBanner').classList.remove('visible');
        document.getElementById('submitBtn').textContent = 'Confirm Booking Appointment';
        document.getElementById('submitBtn').classList.remove('reschedule-mode');
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitNotice').innerHTML = '<span class="submit-notice-icon">📧</span><span>Upon submitting, a booking confirmation will be sent to the patient\\'s email along with a link to access the Patient Portal (vaccination upload & health questionnaire).</span>';
        
        // Reset form field styles
        document.querySelectorAll('#bookingForm input:not([type="hidden"])').forEach(function(field) {
          field.classList.remove('reschedule-mode');
          field.disabled = false;
          field.readOnly = false;
        });
        
        document.querySelectorAll('#bookingForm select').forEach(function(field) {
          field.classList.remove('reschedule-mode');
          field.disabled = false;
        });
        
        // Reset slots panel
        document.getElementById('slotsHeader').textContent = 'Select Time';
        document.getElementById('slotsContent').innerHTML = '<div class="slots-placeholder-text">← Pick a date</div>';
        
        // Reset booked sections
        document.getElementById('bookedContent').innerHTML = '<div class="booked-placeholder">← Select a date to view bookings</div>';
        document.getElementById('bookedCount').style.display = 'none';
        document.getElementById('monthlyBookedContent').innerHTML = '<div class="booked-placeholder">Loading monthly appointments...</div>';
        document.getElementById('monthlyBookedCount').style.display = 'none';
        
        // Reset selected slot display
        document.getElementById('selectedSlotDisplay').textContent = '⏳ Please select a date and time';
        document.getElementById('selectedSlotDisplay').classList.add('empty');
        
        // Reset validation hint
        document.getElementById('validationHint').textContent = 'Select a time slot and fill in required fields';
        document.getElementById('validationHint').style.color = '#666';
        
        // Remove any disabled styles from containers
        document.getElementById('calendarContainer').classList.remove('form-disabled');
        document.getElementById('slotsContainer').classList.remove('form-disabled');
        
        // Clear any messages
        document.getElementById('message').innerHTML = '';
        document.getElementById('message').className = 'message';
        
        // Show loading, hide main content
        document.getElementById('loading').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        
        // Reload all data
        google.script.run
          .withSuccessHandler(initializeCalendar)
          .withFailureHandler(showError)
          .getAvailableSlots();
      } else {
        alert(result.message);
      }
    })
    .withFailureHandler(function(error) {
      document.getElementById('unbookModal').classList.remove('visible');
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      confirmBtn.textContent = 'Unbook';
      alert('An error occurred. Please try again.');
    })
    .unbookAppointment(unbookPatientId, unbookAppointmentRow, '${safeToken}');
});

// Duplicate patient modal handlers
    document.getElementById('duplicateCancelBtn').addEventListener('click', function() {
      document.getElementById('duplicatePatientModal').classList.remove('visible');
      duplicatePatientData = null;
      pendingBookingData = null;
    });
    
    document.getElementById('duplicateConfirmBtn').addEventListener('click', function() {
      if (!duplicatePatientData || !pendingBookingData) return;
      
      const confirmBtn = document.getElementById('duplicateConfirmBtn');
      const cancelBtn = document.getElementById('duplicateCancelBtn');
      
      confirmBtn.disabled = true;
      cancelBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';
      
      document.getElementById('duplicatePatientModal').classList.remove('visible');
      
      // Reset button state for next time
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      confirmBtn.textContent = 'Use Existing Patient';
      
      // Proceed with booking using existing patient ID
      const existingPatientId = duplicatePatientData.patientId;
      duplicatePatientData = null;
      pendingBookingData = null;
      
      proceedWithBooking(existingPatientId);
    });
    
    // Close duplicate modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.getElementById('duplicatePatientModal').classList.contains('visible')) {
        document.getElementById('duplicatePatientModal').classList.remove('visible');
        duplicatePatientData = null;
        pendingBookingData = null;
      }
    });

function attachNoteEventListeners(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      
      // Helper function to disable other buttons while editing
      function disableOtherButtonsForEditing() {
        // Disable all reschedule buttons
        document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
          btn.disabled = true;
        });
        
        // Disable all unbook buttons
        document.querySelectorAll('.unbook-btn').forEach(function(btn) {
          btn.disabled = true;
        });
        
        // Disable all other edit note buttons
        document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
          btn.disabled = true;
        });
        
        // Disable header buttons
        if (document.getElementById('settingsBtn')) {
          document.getElementById('settingsBtn').disabled = true;
        }
        if (document.getElementById('logoutBtn')) {
          document.getElementById('logoutBtn').disabled = true;
        }
        if (document.getElementById('cancelRescheduleBtn')) {
          document.getElementById('cancelRescheduleBtn').disabled = true;
        }
      }
      
      // Helper function to re-enable buttons after editing
      function enableButtonsAfterEditing() {
        // Re-enable reschedule/unbook buttons only if not in reschedule mode
        if (!isRescheduling) {
          document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
            btn.disabled = false;
          });
          
          document.querySelectorAll('.unbook-btn').forEach(function(btn) {
            btn.disabled = false;
          });
        }
        
        // Re-enable all edit note buttons that are visible
        document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
          if (btn.style.display !== 'none') {
            btn.disabled = false;
          }
        });
        
        // Re-enable header buttons
        if (document.getElementById('settingsBtn')) {
          document.getElementById('settingsBtn').disabled = false;
        }
        if (document.getElementById('logoutBtn')) {
          document.getElementById('logoutBtn').disabled = false;
        }
        if (document.getElementById('cancelRescheduleBtn')) {
          document.getElementById('cancelRescheduleBtn').disabled = false;
        }
      }
      
      // Edit button click
      container.querySelectorAll('.edit-note-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const patientId = this.getAttribute('data-patient-id');
          const bookedItem = this.closest('.booked-item');
          if (!bookedItem) return;
          
          const noteContainer = bookedItem.querySelector('.booked-note-container');
          const displayDiv = noteContainer.querySelector('.booked-note-display');
          const editDiv = noteContainer.querySelector('.booked-note-edit');
          const editBtn = bookedItem.querySelector('.edit-note-btn');
          const saveBtn = bookedItem.querySelector('.save-note-btn');
          const cancelBtn = bookedItem.querySelector('.cancel-note-btn');
          
          // Disable other buttons while editing
          disableOtherButtonsForEditing();
          
          displayDiv.style.display = 'none';
          editDiv.style.display = 'block';
          editBtn.style.display = 'none';
          saveBtn.style.display = 'inline-block';
          cancelBtn.style.display = 'inline-block';
          
          const textarea = editDiv.querySelector('textarea');
          textarea.focus();
        });
      });
      
      // Cancel button click
      container.querySelectorAll('.cancel-note-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const patientId = this.getAttribute('data-patient-id');
          const bookedItem = this.closest('.booked-item');
          if (!bookedItem) return;
          
          const noteContainer = bookedItem.querySelector('.booked-note-container');
          const displayDiv = noteContainer.querySelector('.booked-note-display');
          const editDiv = noteContainer.querySelector('.booked-note-edit');
          const editBtn = bookedItem.querySelector('.edit-note-btn');
          const saveBtn = bookedItem.querySelector('.save-note-btn');
          const cancelBtn = bookedItem.querySelector('.cancel-note-btn');
          
          // Reset textarea to original value
          const originalNote = displayDiv.classList.contains('empty') ? '' : displayDiv.textContent;
          editDiv.querySelector('textarea').value = originalNote;
          
          displayDiv.style.display = 'block';
          editDiv.style.display = 'none';
          editBtn.style.display = 'inline-block';
          saveBtn.style.display = 'none';
          cancelBtn.style.display = 'none';
          
          // Re-enable other buttons after canceling edit
          enableButtonsAfterEditing();
        });
      });
      
      // Save button click
      container.querySelectorAll('.save-note-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const patientId = this.getAttribute('data-patient-id');
          const bookedItem = this.closest('.booked-item');
          if (!bookedItem) return;
          
          const noteContainer = bookedItem.querySelector('.booked-note-container');
          const displayDiv = noteContainer.querySelector('.booked-note-display');
          const editDiv = noteContainer.querySelector('.booked-note-edit');
          const editBtn = bookedItem.querySelector('.edit-note-btn');
          const saveBtn = bookedItem.querySelector('.save-note-btn');
          const cancelBtn = bookedItem.querySelector('.cancel-note-btn');
          const textarea = editDiv.querySelector('textarea');
          
          const newNote = textarea.value.trim();
          
          // Switch to saving state - show Edit Note button with "Saving..." text
          editBtn.textContent = 'Saving...';
          editBtn.disabled = true;
          editBtn.style.display = 'inline-block';
          saveBtn.style.display = 'none';
          cancelBtn.style.display = 'none';
          
          // Username is derived server-side from session token for audit logging
          google.script.run
            .withSuccessHandler(function(result) {
              if (result.success) {
                // Update display
                if (newNote) {
                  displayDiv.textContent = newNote;
                  displayDiv.classList.remove('empty');
                } else {
                  displayDiv.textContent = 'Comments';
                  displayDiv.classList.add('empty');
                }
                
                // Switch back to display mode
                displayDiv.style.display = 'block';
                editDiv.style.display = 'none';
                editBtn.textContent = 'Edit Comment';
                editBtn.disabled = false;
                editBtn.style.display = 'inline-block';
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                
                // Re-enable other buttons after successful save
                enableButtonsAfterEditing();
                
                // Sync note across all instances of this patient on the page
                document.querySelectorAll('.booked-note-container[data-patient-id="' + patientId + '"]').forEach(function(otherContainer) {
                  if (otherContainer !== noteContainer) {
                    const otherDisplay = otherContainer.querySelector('.booked-note-display');
                    const otherTextarea = otherContainer.querySelector('.booked-note-edit textarea');
                    if (otherDisplay) {
                      if (newNote) {
                        otherDisplay.textContent = newNote;
                        otherDisplay.classList.remove('empty');
                      } else {
                        otherDisplay.textContent = 'Comments';
                        otherDisplay.classList.add('empty');
                      }
                    }
                    if (otherTextarea) {
                      otherTextarea.value = newNote;
                    }
                  }
                });
              } else {
                alert('Error saving note: ' + result.message);
                // Restore edit mode on error - keep other buttons disabled
                editBtn.textContent = 'Edit Comment';
                editBtn.disabled = false;
                editBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';
                cancelBtn.style.display = 'inline-block';
              }
            })
            .withFailureHandler(function(error) {
              alert('Error saving note. Please try again.');
              // Restore edit mode on error - keep other buttons disabled
              editBtn.textContent = 'Edit Comment';
              editBtn.disabled = false;
              editBtn.style.display = 'none';
              saveBtn.style.display = 'inline-block';
              cancelBtn.style.display = 'inline-block';
            })
            .savePatientNote(patientId, newNote, '${safeToken}');
        });
      });
    }

    function cancelReschedule() {
  isRescheduling = false;
  reschedulingPatientId = null;
  reschedulingOldRow = null;
  
  document.getElementById('reschedulingPatientId').value = '';
  document.getElementById('rescheduleBanner').classList.remove('visible');
  document.getElementById('submitBtn').textContent = 'Confirm Booking Appointment';
  document.getElementById('submitBtn').classList.remove('reschedule-mode');
  document.getElementById('submitNotice').innerHTML = '<span class="submit-notice-icon">📧</span><span>Upon submitting, a booking confirmation will be sent to the patient\\'s email along with a link to access the Patient Portal (vaccination upload & health questionnaire).</span>';
  
  document.querySelectorAll('#bookingForm input:not([type="hidden"])').forEach(function(field) {
    field.classList.remove('reschedule-mode');
    field.readOnly = false;
  });
  
  document.querySelectorAll('#bookingForm select').forEach(function(field) {
    field.classList.remove('reschedule-mode');
    field.disabled = false;
  });
  
  // Re-enable reschedule buttons
  document.querySelectorAll('.reschedule-btn').forEach(function(btn) {
    btn.disabled = false;
  });
  
  // Re-enable unbook buttons
  document.querySelectorAll('.unbook-btn').forEach(function(btn) {
    btn.disabled = false;
  });
  
  // Re-enable edit note buttons
  document.querySelectorAll('.edit-note-btn').forEach(function(btn) {
    if (btn.style.display !== 'none') {
      btn.disabled = false;
    }
  });
  
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('gender').value = '';
  document.getElementById('dob').value = '';
  document.getElementById('ssn').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('address').value = '';
  document.getElementById('city').value = '';
  document.getElementById('state').value = '';
  document.getElementById('zipCode').value = '';
  
  validateForm();
}
    
    function selectSlot(slot, btn) {
      if (isProcessing) return;
      
      selectedSlot = slot;
      
      document.querySelectorAll('.slot-btn.selected').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
      
      updateSlotDisplay();
      validateForm();
    }
    
    function updateSlotDisplay() {
      const display = document.getElementById('selectedSlotDisplay');
      
      if (selectedSlot) {
        display.textContent = '📅 ' + selectedSlot.date + ' • ' + selectedSlot.startTime + ' - ' + selectedSlot.endTime;
        display.classList.remove('empty', 'fully-booked');
      } else if (selectedDate) {
        const dateDisplay = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        
        // Check if all slots for this date are fully booked
        const daySlots = slotsByDate[selectedDateKey] || [];
        const totalRemaining = daySlots.reduce((sum, s) => sum + s.remaining, 0);
        const isFullyBooked = daySlots.length > 0 && totalRemaining === 0;
        
        if (isFullyBooked) {
          display.textContent = '📅 ' + dateDisplay + ' — Fully Booked';
          display.classList.remove('empty');
          display.classList.add('fully-booked');
        } else {
          display.textContent = '📅 ' + dateDisplay + ' — select a time';
          display.classList.remove('fully-booked');
          display.classList.add('empty');
        }
      } else {
        display.textContent = '⏳ Please select a date and time';
        display.classList.remove('fully-booked');
        display.classList.add('empty');
      }
    }
    
    function validateForm() {
      if (isProcessing) return;
      
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const gender = document.getElementById('gender').value;
      const ssn = document.getElementById('ssn').value.trim();
      const appointmentType = document.getElementById('appointmentType').value;
      const caseNumber = document.getElementById('caseNumber').value.trim();
      const dob = document.getElementById('dob').value;
      const address = document.getElementById('address').value.trim();
      const city = document.getElementById('city').value.trim();
      const state = document.getElementById('state').value.trim();
      const zipCode = document.getElementById('zipCode').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const emailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
      const ssnValid = /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/.test(ssn) || /^\\*{3}-\\*{2}-[0-9]{4}$/.test(ssn);
      const phoneValid = /^\\(\\d{3}\\)\\s\\d{3}-\\d{4}$/.test(phone);
      
      const btn = document.getElementById('submitBtn');
      const hint = document.getElementById('validationHint');
      
      const missingItems = [];
      
      if (!selectedSlot) missingItems.push('time');
      if (!firstName) missingItems.push('first name');
      if (!lastName) missingItems.push('last name');
      if (!gender) missingItems.push('gender');
      if (!dob) missingItems.push('DOB');
      if (!ssn || !ssnValid) missingItems.push('SSN');
      if (!appointmentType) missingItems.push('appt type');
      if (!caseNumber) missingItems.push('case number');
      if (!phone || !phoneValid) missingItems.push('phone');
      if (!email || !emailValid) missingItems.push('email');
      
      if (missingItems.length === 0) {
        btn.disabled = false;
        hint.textContent = isRescheduling ? '✓ Ready to reschedule!' : '✓ Ready to book!';
        hint.style.color = '#2e7d32';
      } else {
        btn.disabled = true;
        hint.textContent = 'Need: ' + missingItems.join(', ');
        hint.style.color = '#666';
      }
    }
    
    function clearSelection() {
      if (isProcessing) return;
      
      selectedDate = null;
      selectedDateKey = null;
      selectedSlot = null;
      
      // Invalidate any pending date bookings requests
      dateBookingsRequestId++;
      
      document.getElementById('slotsHeader').textContent = 'Select Time';
      document.getElementById('slotsContent').innerHTML = '<div class="slots-placeholder-text">← Pick a date</div>';
      
      document.getElementById('bookedContent').innerHTML = '<div class="booked-placeholder">← Select a date to view bookings</div>';
      document.getElementById('bookedCount').style.display = 'none';
      
      updateSlotDisplay();
      validateForm();
    }
    
    function showError(error) {
      document.getElementById('loading').innerHTML = 
        'Error loading available slots.<br>Please refresh the page.';
    }
    
    function disableAllInputs() {
      isProcessing = true;
      
      document.getElementById('prevMonth').disabled = true;
      document.getElementById('nextMonth').disabled = true;
      document.getElementById('prevMonthBottom').disabled = true;
      document.getElementById('nextMonthBottom').disabled = true;
      document.getElementById('todayBtn').disabled = true;
      
      document.querySelectorAll('.calendar-day').forEach(btn => {
        btn.disabled = true;
      });
      
      document.querySelectorAll('.slot-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      document.getElementById('firstName').disabled = true;
      document.getElementById('lastName').disabled = true;
      document.getElementById('gender').disabled = true;
      document.getElementById('dob').disabled = true;
      document.getElementById('ssn').disabled = true;
      document.getElementById('appointmentType').disabled = true;
      document.getElementById('caseNumber').disabled = true;
      document.getElementById('phone').disabled = true;
      document.getElementById('email').disabled = true;
      document.getElementById('address').disabled = true;
      document.getElementById('city').disabled = true;
      document.getElementById('state').disabled = true;
      document.getElementById('zipCode').disabled = true;
      
      document.querySelectorAll('.reschedule-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      document.querySelectorAll('.unbook-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      // Disable note buttons
      document.querySelectorAll('.edit-note-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      document.querySelectorAll('.save-note-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      document.querySelectorAll('.cancel-note-btn').forEach(btn => {
        btn.disabled = true;
      });
      
      // Disable header buttons
      if (document.getElementById('settingsBtn')) {
        document.getElementById('settingsBtn').disabled = true;
      }
      if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').disabled = true;
      }
      if (document.getElementById('cancelRescheduleBtn')) {
        document.getElementById('cancelRescheduleBtn').disabled = true;
      }
      
      document.getElementById('calendarContainer').classList.add('form-disabled');
      document.getElementById('slotsContainer').classList.add('form-disabled');
    }
    
    function enableAllInputs() {
      isProcessing = false;
      
      renderCalendar();
      
      if (selectedDateKey && slotsByDate[selectedDateKey]) {
        const dateDisplay = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        refreshTimeSlotsDisplay(selectedDateKey, dateDisplay);
      }
      
      // Only enable form fields if not in reschedule mode
      if (!isRescheduling) {
        document.getElementById('firstName').disabled = false;
        document.getElementById('lastName').disabled = false;
        document.getElementById('gender').disabled = false;
        document.getElementById('dob').disabled = false;
        document.getElementById('ssn').disabled = false;
        document.getElementById('appointmentType').disabled = false;
        document.getElementById('caseNumber').disabled = false;
        document.getElementById('phone').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('address').disabled = false;
        document.getElementById('city').disabled = false;
        document.getElementById('state').disabled = false;
        document.getElementById('zipCode').disabled = false;
      }
      
      // Only re-enable reschedule/unbook buttons if NOT in reschedule mode
  if (!isRescheduling) {
    document.querySelectorAll('.reschedule-btn').forEach(btn => {
      btn.disabled = false;
    });
    
    document.querySelectorAll('.unbook-btn').forEach(btn => {
      btn.disabled = false;
    });
  }
  
  // Re-enable note buttons (only edit buttons that are visible)
  document.querySelectorAll('.edit-note-btn').forEach(btn => {
    if (btn.style.display !== 'none') {
      btn.disabled = false;
    }
  });
  
  // Enable header buttons
  if (document.getElementById('settingsBtn')) {
    document.getElementById('settingsBtn').disabled = false;
  }
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').disabled = false;
  }
  // Always enable cancel reschedule button if in reschedule mode
  if (document.getElementById('cancelRescheduleBtn')) {
    document.getElementById('cancelRescheduleBtn').disabled = false;
  }
      
      document.getElementById('calendarContainer').classList.remove('form-disabled');
      document.getElementById('slotsContainer').classList.remove('form-disabled');
    }
    
    function resetPage() {
      isProcessing = false;
      
      isRescheduling = false;
      reschedulingPatientId = null;
      reschedulingOldRow = null;
      selectedDate = null;
      selectedDateKey = null;
      selectedSlot = null;
      
      // Invalidate any pending requests
      dateBookingsRequestId++;
      monthlyBookingsRequestId++;
      
      allSlots = [];
      slotsByDate = {};
      
      document.getElementById('firstName').value = '';
      document.getElementById('lastName').value = '';
      document.getElementById('gender').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('ssn').value = '';
  document.getElementById('appointmentType').value = '';
  document.getElementById('caseNumber').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
      document.getElementById('address').value = '';
      document.getElementById('city').value = '';
      document.getElementById('state').value = '';
      document.getElementById('zipCode').value = '';
      document.getElementById('reschedulingPatientId').value = '';
      
      document.getElementById('rescheduleBanner').classList.remove('visible');
      document.getElementById('submitBtn').textContent = 'Confirm Booking Appointment';
      document.getElementById('submitBtn').classList.remove('reschedule-mode');
      document.getElementById('submitBtn').disabled = true;
      document.getElementById('submitNotice').innerHTML = '<span class="submit-notice-icon">📧</span><span>Upon submitting, a booking confirmation will be sent to the patient\\'s email along with a link to access the Patient Portal (vaccination upload & health questionnaire).</span>';
      
      document.querySelectorAll('#bookingForm input:not([type="hidden"])').forEach(function(field) {
        field.classList.remove('reschedule-mode');
        field.disabled = false;
        field.readOnly = false;
      });
      
      document.querySelectorAll('#bookingForm select').forEach(function(field) {
        field.classList.remove('reschedule-mode');
        field.disabled = false;
      });
      
      document.getElementById('slotsHeader').textContent = 'Select Time';
      document.getElementById('slotsContent').innerHTML = '<div class="slots-placeholder-text">← Pick a date</div>';
      document.getElementById('bookedContent').innerHTML = '<div class="booked-placeholder">← Select a date to view bookings</div>';
      document.getElementById('bookedCount').style.display = 'none';
      document.getElementById('monthlyBookedContent').innerHTML = '<div class="booked-placeholder">Loading monthly appointments...</div>';
      document.getElementById('monthlyBookedCount').style.display = 'none';
      
      document.getElementById('selectedSlotDisplay').textContent = '⏳ Please select a date and time';
      document.getElementById('selectedSlotDisplay').classList.add('empty');
      
      document.getElementById('validationHint').textContent = 'Select a time slot and fill in required fields';
      document.getElementById('validationHint').style.color = '#666';
      
      document.getElementById('calendarContainer').classList.remove('form-disabled');
      document.getElementById('slotsContainer').classList.remove('form-disabled');
      
      document.getElementById('message').innerHTML = '';
      document.getElementById('message').className = 'message';
      
      document.getElementById('loading').style.display = 'flex';
      document.getElementById('mainContent').style.display = 'none';
      
      // Restore to the month where the last booking was made, or current month if none
      if (lastBookedMonth !== null && lastBookedYear !== null) {
        currentDate = new Date(lastBookedYear, lastBookedMonth, 1);
      } else {
        currentDate = new Date();
      }
      
      google.script.run
        .withSuccessHandler(initializeCalendar)
        .withFailureHandler(showError)
        .getAvailableSlots();
    }
    
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!selectedSlot || isProcessing) {
        alert('Please select a time slot.');
        return;
      }
      
      // Remember the current month being viewed for "Book Another" feature
      lastBookedMonth = currentDate.getMonth();
      lastBookedYear = currentDate.getFullYear();
      
      const reschedulingId = document.getElementById('reschedulingPatientId').value.trim();
      
      // If rescheduling, skip duplicate check and proceed directly
      if (reschedulingId) {
        proceedWithBooking(null);
        return;
      }
      
      // For new bookings, check for duplicate patient first
      disableAllInputs();
      
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = 'Checking...';
      
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const dob = document.getElementById('dob').value;
      
      google.script.run
        .withSuccessHandler(function(existingPatient) {
          // Check for auth error
          if (existingPatient && existingPatient.authError) {
            enableAllInputs();
            btn.disabled = false;
            btn.textContent = 'Confirm Booking Appointment';
            alert('Session expired. Please refresh the page and log in again.');
            return;
          }
          
          if (existingPatient) {
            // Found duplicate - show confirmation modal
            enableAllInputs();
            btn.disabled = false;
            btn.textContent = 'Confirm Booking Appointment';
            validateForm();
            
            duplicatePatientData = existingPatient;
            pendingBookingData = {
              slotRow: selectedSlot.row,
              lastName: lastName,
              firstName: firstName,
              gender: document.getElementById('gender').value,
              ssn4: document.getElementById('ssn').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              state: document.getElementById('state').value,
              zipCode: document.getElementById('zipCode').value,
              phone: document.getElementById('phone').value,
              email: document.getElementById('email').value,
              dob: dob
            };
            
            // Populate and show the modal
            document.getElementById('duplicatePatientName').textContent = existingPatient.firstName + ' ' + existingPatient.lastName;
            document.getElementById('duplicatePatientId').textContent = existingPatient.patientId;
            document.getElementById('duplicatePatientEmail').textContent = existingPatient.email ? '✉️ ' + existingPatient.email : '✉️ No email on file';
            document.getElementById('duplicatePatientExistingAppt').textContent = existingPatient.existingAppointment ? '📅 Current appt: ' + existingPatient.existingAppointment : '📅 No current appointment';
            document.getElementById('duplicatePatientModal').classList.add('visible');
          } else {
            // No duplicate found - proceed with normal booking
            proceedWithBooking(null);
          }
        })
        .withFailureHandler(function(error) {
          // On error, proceed with normal booking (fail open)
          console.error('Error checking for duplicate:', error);
          proceedWithBooking(null);
        })
        .checkDuplicatePatient(firstName, lastName, dob, '${safeToken}');
    });
    
    function proceedWithBooking(useExistingPatientId) {
      disableAllInputs();
      
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = isRescheduling ? 'Rescheduling...' : 'Booking...';
      
      const reschedulingId = document.getElementById('reschedulingPatientId').value.trim();
      const loggedInUsername = '${username || ''}';
      
      google.script.run
        .withSuccessHandler(handleResult)
        .withFailureHandler(handleError)
        .bookAppointment(
          selectedSlot.row,
          document.getElementById('lastName').value,
          document.getElementById('firstName').value,
          document.getElementById('gender').value,
          document.getElementById('ssn').value,
          document.getElementById('appointmentType').value,
          document.getElementById('caseNumber').value,
          document.getElementById('address').value,
          document.getElementById('city').value,
          document.getElementById('state').value,
          document.getElementById('zipCode').value,
          document.getElementById('phone').value,
          document.getElementById('email').value,
          document.getElementById('dob').value,
          reschedulingId,
          reschedulingOldRow,
          '${safeToken}',
          useExistingPatientId
        );
    }
    
    function handleResult(result) {
      const messageDiv = document.getElementById('message');
      
      if (result.success) {
        document.getElementById('mainContent').style.display = 'none';
        messageDiv.className = 'message success';
        messageDiv.innerHTML = '<strong>✓ ' + (result.isReschedule ? 'Rescheduled' : 'Booking Confirmed') + '!</strong><br><br>' + 
          result.message + 
          '<br><br><a class="book-another-link" onclick="resetPage()">📅 Book Another Appointment</a>';
        
        // Re-enable header buttons so user can still logout or access settings
        if (document.getElementById('settingsBtn')) {
          document.getElementById('settingsBtn').disabled = false;
        }
        if (document.getElementById('logoutBtn')) {
          document.getElementById('logoutBtn').disabled = false;
        }
      } else {
        messageDiv.className = 'message error';
        messageDiv.textContent = result.message;
        resetButton();
        enableAllInputs();
      }
    }
    
    function handleError(error) {
      document.getElementById('message').className = 'message error';
      document.getElementById('message').textContent = 'Something went wrong. Please try again.';
      resetButton();
      enableAllInputs();
    }
    
    function resetButton() {
      const btn = document.getElementById('submitBtn');
      btn.disabled = false;
      btn.textContent = isRescheduling ? 'Confirm Reschedule' : 'Confirm Booking Appointment';
      validateForm();
    }
  </script>
</body>
</html>
`;
}

// ================================================================================
// UPLOAD PAGE HTML - Patient file upload interface
// ================================================================================

function getUploadPageHtml(folderId, patientName, existingFileCount, lastUploadInfo, questionnaireStatus, privacyStatus, appointmentInfo, portalToken, lastVaccinationFileName) {
  // Validate existingFileCount is a non-negative integer (defense in depth)
  const safeFileCount = (typeof existingFileCount === 'number' && Number.isInteger(existingFileCount) && existingFileCount >= 0) 
    ? existingFileCount 
    : 0;
  
  // Escape patient name to prevent XSS from URL parameter
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  // Escape for JavaScript string context (defense in depth - folderId already validated)
  const escapeForJsString = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/</g, '\\x3c')
      .replace(/>/g, '\\x3e');
  };
  
  const safePatientName = escapeHtml(patientName);
  const safeFolderId = escapeForJsString(folderId);
  const safePortalToken = portalToken ? escapeForJsString(portalToken) : '';
  
  const safeLastFileName = lastVaccinationFileName ? escapeHtml(lastVaccinationFileName) : '';
  const isNoProofVaccination = lastUploadInfo && lastUploadInfo.startsWith('NO_PROOF:');
  const hasUploadedVaccination = !!lastUploadInfo;
  const hasCompletedQuestionnaire = questionnaireStatus && questionnaireStatus.completed;
  const questionnaireTimestamp = questionnaireStatus ? questionnaireStatus.timestamp : null;
  const hasSignedPrivacy = privacyStatus && privacyStatus.completed;
  const privacyTimestamp = privacyStatus ? privacyStatus.timestamp : null;
  
  // Escape timestamp values for HTML (defense in depth - these are date-formatted strings)
  const safeLastUploadInfo = lastUploadInfo ? escapeHtml(lastUploadInfo) : '';
  const safeQuestionnaireTimestamp = questionnaireTimestamp ? escapeHtml(questionnaireTimestamp) : '';
  const safePrivacyTimestamp = privacyTimestamp ? escapeHtml(privacyTimestamp) : '';
  
  const completedCount = (hasUploadedVaccination ? 1 : 0) + (hasCompletedQuestionnaire ? 1 : 0) + (hasSignedPrivacy ? 1 : 0);
  const totalTasks = 3;
  const allComplete = completedCount === totalTasks;
  
  // Escape appointment info for HTML
  const safeApptDate = appointmentInfo ? escapeHtml(appointmentInfo.date) : '';
  const safeApptTime = appointmentInfo ? escapeHtml(appointmentInfo.time) : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_self">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      min-height: 100vh;
      padding: 0;
    }
    
    .page-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header-bar {
      background: linear-gradient(135deg, #1a5f7a 0%, #0d3d4d 100%);
      padding: 8px 20px;
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header-content {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 44px;
      height: 44px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .logo-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .header-text h1 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    
    .header-text p {
      font-size: 11px;
      opacity: 0.9;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 15px;
    }
    
    .portal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 600px;
    }
    
    .patient-banner {
      border-radius: 12px 12px 0 0;
    }
    
    .patient-banner {
      background: linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 100%);
      padding: 10px 20px;
      border-bottom: 1px solid #c5dce3;
      border-radius: 12px 12px 0 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .patient-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a5f7a;
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .patient-name {
      font-size: 18px;
      font-weight: 600;
      color: #0d3d4d;
      margin: 0;
    }
    
    .patient-banner-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .appointment-info {
      text-align: right;
      flex-shrink: 0;
    }
    
    .appointment-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a5f7a;
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .appointment-datetime {
      font-size: 14px;
      font-weight: 600;
      color: #0d3d4d;
    }
    
    .appointment-time {
      color: #1a5f7a;
    }
    
    /* Sticky Header Container */
    .sticky-header-container {
      background: white;
      position: sticky;
      top: 46px;
      z-index: 99;
    }
    
    /* Progress Section */
    .progress-section {
      padding: 12px 20px;
      background: #fafbfc;
      border-bottom: 1px solid #e8eaed;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .progress-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    
    .progress-count {
      font-size: 13px;
      font-weight: 600;
      color: #1a5f7a;
    }
    
    .progress-bar-container {
      background: #e0e0e0;
      border-radius: 6px;
      height: 6px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      border-radius: 10px;
      transition: width 0.5s ease;
    }
    
    .progress-bar.partial {
      background: linear-gradient(90deg, #ff9800, #ffc107);
    }
    
    .progress-bar.complete {
      background: linear-gradient(90deg, #4caf50, #8bc34a);
    }
    
    /* Completion Banner Wrapper - provides solid background behind banner */
    .completion-banner-wrapper {
      display: none;
      background: white;
      padding: 6px 15px;
    }
    
    .completion-banner-wrapper.visible {
      display: block;
    }
    
    /* Completion Banner */
    .completion-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border: 2px solid #4caf50;
      border-radius: 10px;
      padding: 8px 16px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    }
    
    /* Spacer to account for sticky header */
    .checklist {
      padding-top: 10px;
    }
    
    .completion-banner-wrapper.visible + .checklist {
      padding-top: 0;
    }
    
    .completion-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    
    .completion-content {
      text-align: left;
    }
    
    .completion-title {
      font-size: 16px;
      font-weight: 700;
      color: #2e7d32;
      margin-bottom: 0;
      line-height: 1.2;
    }
    
    .completion-text {
      font-size: 13px;
      color: #388e3c;
      line-height: 1.2;
    }
    
    /* Checklist */
    .checklist {
      padding: 10px 20px 20px;
    }
    
    .checklist-item {
      border: 2px solid #f5d9a8;
      border-radius: 12px;
      margin-bottom: 10px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
    }
    
    .checklist-item:last-child {
      margin-bottom: 0;
    }
    
    .checklist-item.completed {
      border-color: #4caf50;
      background: white;
    }
    
    .checklist-item.expanded {
      border-color: #1a5f7a;
    }
    
    .checklist-header {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      cursor: pointer;
      gap: 12px;
      transition: background 0.2s;
      background: #fffaf3;
    }
    
    .checklist-header:hover {
      background: #fff5e6;
    }
    
    .checklist-item.completed .checklist-header {
      background: #fafff9;
    }
    
    .checklist-item.completed .checklist-header:hover {
      background: #f0fff0;
    }
    
    .checklist-checkbox {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      transition: all 0.3s;
    }
    
    .checklist-item.completed .checklist-checkbox {
      background: #4caf50;
      border-color: #4caf50;
      color: white;
    }
    
    .checklist-info {
      flex: 1;
      min-width: 0;
    }
    
    .checklist-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
    }
    
    .checklist-status {
      font-size: 12px;
      color: #666;
    }
    
    .checklist-item.completed .checklist-status {
      color: #4caf50;
    }
    
    .checklist-toggle {
      font-size: 18px;
      color: #999;
      transition: transform 0.3s;
    }
    
    .checklist-item.expanded .checklist-toggle {
      transform: rotate(180deg);
    }
    
    .checklist-content {
      display: none;
      padding: 0 16px 12px;
      border-top: 1px solid #e8eaed;
    }
    
    .checklist-item.expanded .checklist-content {
      display: block;
    }
    
    /* Upload Section Styles */
    .upload-area {
      padding-top: 10px;
    }
    
    .upload-status-cards {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .status-card {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      text-align: center;
    }
    
    .status-card.files {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border: 1px solid #90caf9;
    }
    
    .status-card.last-upload {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border: 1px solid #a5d6a7;
    }
    
    .status-card-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #555;
      font-weight: 600;
      margin-bottom: 1px;
    }
    
    .status-card-value {
      font-size: 13px;
      font-weight: 600;
      color: #1a5f7a;
    }
    
    .status-card.last-upload .status-card-value {
      color: #2e7d32;
    }
    
    .dropzone {
      border: 2px dashed #c5dce3;
      border-radius: 10px;
      padding: 15px 15px;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #fafcfd 0%, #f0f5f7 100%);
      text-align: center;
    }
    
    .dropzone:hover {
      border-color: #1a5f7a;
      background: linear-gradient(135deg, #f0f7fa 0%, #e4eff3 100%);
    }
    
    .dropzone.dragover {
      border-color: #1a5f7a;
      background: linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 100%);
      border-style: solid;
    }
    
    .dropzone-icon {
      font-size: 32px;
      margin-bottom: 5px;
    }
    
    .dropzone-text {
      font-size: 15px;
      font-weight: 600;
      color: #1a5f7a;
      margin-bottom: 2px;
    }
    
    .dropzone-subtext {
      font-size: 12px;
      color: #666;
    }
    
    .file-input {
      display: none;
    }
    
    .selected-file {
      background: linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 100%);
      border: 2px solid #1a5f7a;
      border-radius: 10px;
      padding: 12px 15px;
      margin-bottom: 15px;
      display: none;
      align-items: center;
      gap: 12px;
    }
    
    .selected-file.visible {
      display: flex;
    }
    
    .file-icon {
      width: 40px;
      height: 40px;
      background: #1a5f7a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
    }
    
    .file-name {
      font-weight: 600;
      color: #0d3d4d;
      word-break: break-all;
      font-size: 13px;
      margin-bottom: 2px;
    }
    
    .file-size {
      font-size: 11px;
      color: #1a5f7a;
      font-weight: 500;
    }
    
    .remove-file {
      background: white;
      border: 2px solid #e0e0e0;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .remove-file:hover {
      background: #ffebee;
      border-color: #ef5350;
      color: #c62828;
    }
    
    .action-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #f28b82 0%, #e57373 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: none;
      box-shadow: 0 4px 15px rgba(229, 115, 115, 0.3);
    }
    
    .action-btn.visible {
      display: block;
    }
    
    .action-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(229, 115, 115, 0.4);
    }
    
    .action-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .message {
      padding: 12px 15px;
      border-radius: 8px;
      margin-top: 15px;
      display: none;
      font-weight: 500;
      font-size: 13px;
    }
    
    .message.visible {
      display: block;
    }
    
    .message.success {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      color: #1b5e20;
      border: 1px solid #a5d6a7;
    }
    
    .message.error {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
      color: #b71c1c;
      border: 1px solid #ef9a9a;
    }
    
    .upload-another {
      margin-top: 12px;
      padding: 10px 20px;
      background: white;
      border: 2px solid #1a5f7a;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #1a5f7a;
      cursor: pointer;
      display: none;
      transition: all 0.2s;
    }
    
    .upload-another.visible {
      display: inline-block;
    }
    
    .upload-another:hover {
      background: #1a5f7a;
      color: white;
    }
    
    /* Uploaded file name display */
    .uploaded-file-name {
      display: none;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border: 2px solid #4caf50;
      border-radius: 10px;
      padding: 10px 15px;
      margin-bottom: 10px;
      font-size: 13px;
      color: #1b5e20;
      font-weight: 600;
      word-break: break-all;
    }
    
    .uploaded-file-name.visible {
      display: flex;
    }
    
    .uploaded-file-name .uploaded-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    
    /* Red upload button after file uploaded */
    .action-btn.uploaded-state {
      background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%);
      box-shadow: 0 4px 15px rgba(198, 40, 40, 0.3);
    }
    
    .action-btn.uploaded-state:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
    }
    
    /* No proof of vaccination button */
    .no-proof-btn {
      width: 100%;
      padding: 12px;
      background: white;
      border: 2px dashed #ff9800;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #e65100;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 10px;
      display: block;
    }
    
    .no-proof-btn:hover {
      background: #fff3e0;
      border-color: #e65100;
    }
    
    .no-proof-btn.hidden {
      display: none;
    }
    
    /* No Proof Confirmation Modal */
    .confirm-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .confirm-overlay.visible {
      display: flex;
    }
    
    .confirm-modal {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      max-width: 400px;
      width: 100%;
      overflow: hidden;
      animation: modalSlideIn 0.2s ease;
    }
    
    @keyframes modalSlideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .confirm-header {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #ffcc80;
    }
    
    .confirm-header-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    
    .confirm-header-title {
      font-size: 16px;
      font-weight: 700;
      color: #e65100;
    }
    
    .confirm-body {
      padding: 16px 20px;
      font-size: 14px;
      color: #444;
      line-height: 1.5;
    }
    
    .confirm-footer {
      padding: 12px 20px 16px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .confirm-btn {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    
    .confirm-btn.cancel {
      background: #f5f5f5;
      color: #555;
      border: 1px solid #ddd;
    }
    
    .confirm-btn.cancel:hover {
      background: #e8e8e8;
    }
    
    .confirm-btn.proceed {
      background: linear-gradient(135deg, #e65100 0%, #bf360c 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(230, 81, 0, 0.3);
    }
    
    .confirm-btn.proceed:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(230, 81, 0, 0.4);
    }
    
    /* Questionnaire Styles */
    .questionnaire-area {
      padding-top: 10px;
    }
    
    .form-section {
      margin-bottom: 20px;
      padding: 15px;
      background: #fafbfc;
      border-radius: 8px;
      border: 1px solid #e8eaed;
    }
    
    .form-section:last-of-type {
      margin-bottom: 15px;
    }
    
    .form-section-title {
      font-size: 13px;
      font-weight: 700;
      color: #1a5f7a;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #1a5f7a;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group:last-child {
      margin-bottom: 0;
    }
    
    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #f5d9a8;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s;
      background: #fffaf3;
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }
    
    .form-textarea:focus {
      outline: none;
      border-color: #1a5f7a;
      box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
    }
    
    .form-textarea.answered {
      background: #fafff9;
      border-color: #c8e6c9;
    }
    
    .form-textarea.required-field:not(.answered) {
      background: #fff5f5;
      border-color: #f5c6cb;
    }
    
    .radio-group {
      display: flex;
      gap: 10px;
    }
    
    .radio-option {
      flex: 1;
      position: relative;
    }
    
    .radio-option input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 2;
      margin: 0;
    }
    
    .radio-option .radio-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    
    .radio-option input:checked + .radio-label {
      background: #e8f5e9;
      border-color: #2e7d32;
      color: #2e7d32;
    }
    
    .radio-option input:checked + .radio-label.no-selected {
      background: #ffebee;
      border-color: #c62828;
      color: #c62828;
    }
    
    .radio-option:hover .radio-label {
      border-color: #1a5f7a;
      background: #f8fbfc;
    }
    
    .submit-questionnaire-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #1a5f7a 0%, #0d3d4d 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(26, 95, 122, 0.3);
    }
    
    .submit-questionnaire-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 95, 122, 0.4);
    }
    
    .submit-questionnaire-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Medical Questionnaire Styles */
    .form-intro {
      text-align: center;
      margin-bottom: 15px;
      padding: 12px;
      background: linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 100%);
      border-radius: 8px;
    }
    
    .form-intro p {
      margin: 0;
      color: #1a5f7a;
    }
    
    .form-intro-sub {
      font-size: 12px;
      margin-top: 5px !important;
      color: #555 !important;
    }
    
    .condition-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .condition-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      background: #fffaf3;
      border: 1px solid #f5d9a8;
      border-radius: 6px;
      transition: background 0.2s, border-color 0.2s;
    }
    
    .condition-row:hover {
      background: #fff5e6;
      border-color: #e8c88a;
    }
    
    .condition-row.answered {
      background: #fafff9;
      border-color: #c8e6c9;
    }
    
    .condition-row.answered:hover {
      background: #f0fff0;
      border-color: #a5d6a7;
    }
    
    .condition-row.required-field:not(.answered) {
      background: #fff5f5;
      border-color: #f5c6cb;
    }
    
    .condition-row.required-field:not(.answered):hover {
      background: #ffecec;
      border-color: #f0a8a8;
    }
    
    .condition-label {
      font-size: 13px;
      color: #333;
      flex: 1;
    }
    
    .condition-options {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    
    .condition-option {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .condition-option input {
      margin-right: 4px;
      cursor: pointer;
    }
    
    .condition-option span {
      font-size: 12px;
      font-weight: 600;
      color: #555;
    }
    
    .condition-option input:checked + span {
      color: #1a5f7a;
    }
    
    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #f5d9a8;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s;
      background: #fffaf3;
      font-family: inherit;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #1a5f7a;
      box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
    }
    
    .form-input.answered {
      background: #fafff9;
      border-color: #c8e6c9;
    }
    
    .form-input.required-field:not(.answered) {
      background: #fff5f5;
      border-color: #f5c6cb;
    }
    
    .form-row {
      display: flex;
      gap: 12px;
    }
    
    .certification-section {
      background: linear-gradient(135deg, #fff5f5 0%, #ffebee 100%);
      border: 2px solid #ef9a9a;
    }
    
    .certification-text {
      font-size: 13px;
      color: #555;
      margin-bottom: 12px;
      font-style: italic;
    }
    
    .signature-input {
      font-family: 'Brush Script MT', cursive, sans-serif;
      font-size: 18px;
      text-align: center;
      border-style: dashed;
    }
    
    @media (max-width: 480px) {
      .condition-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      
      .condition-options {
        align-self: flex-end;
      }
      
      .form-row {
        flex-direction: column;
        gap: 8px;
      }
    }
    
    .questionnaire-complete-notice {
      text-align: center;
      padding: 12px;
      color: #2e7d32;
    }
    
    .questionnaire-complete-notice .check-icon {
      font-size: 32px;
      margin-bottom: 5px;
    }
    
    .questionnaire-complete-notice .complete-text {
      font-size: 14px;
      font-weight: 500;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .footer-bar {
      background: #f0f2f4;
      padding: 12px 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }
    
    .footer-text {
      font-size: 11px;
      color: #888;
    }
    
    /* Responsive adjustments */
    @media (max-width: 480px) {
      .header-bar {
        padding: 12px 15px;
      }
      
      .header-text h1 {
        font-size: 16px;
      }
      
      .header-text p {
        font-size: 10px;
      }
      
      .logo-icon {
        width: 38px;
        height: 38px;
      }
      
      .main-content {
        padding: 15px 10px;
      }
      
      .patient-banner {
        padding: 12px 15px;
      }
      
      .patient-name {
        font-size: 16px;
      }
      
      .sticky-header-container {
        top: 40px;
      }
      
      .progress-section {
        padding: 15px;
      }
      
      .patient-banner {
        padding: 12px 15px;
      }
      
      .checklist {
        padding: 0 15px 15px;
      }
      
      .checklist-header {
        padding: 12px;
      }
      
      .checklist-content {
        padding: 0 12px 12px;
      }
      
      .checklist-checkbox {
        width: 24px;
        height: 24px;
        font-size: 14px;
      }
      
      .checklist-title {
        font-size: 14px;
      }
      
      .upload-status-cards {
        flex-direction: column;
      }
      
      .dropzone {
        padding: 25px 12px;
      }
      
      .dropzone-icon {
        font-size: 30px;
      }
      
      .dropzone-text {
        font-size: 14px;
      }
      
      .radio-option .radio-label {
        padding: 10px 12px;
        font-size: 13px;
      }
      
      .form-section {
        padding: 12px;
      }
      
      .completion-banner-wrapper {
        padding: 5px 10px;
      }
      
      .completion-banner {
        padding: 6px 12px;
        flex-direction: row;
        gap: 8px;
      }
      
      .completion-icon {
        font-size: 24px;
      }
      
      .completion-title {
        font-size: 14px;
      }
      
      .completion-text {
        font-size: 12px;
      }
      
      .patient-banner-content {
        flex-direction: column;
        gap: 8px;
      }
      
      .appointment-info {
        text-align: left;
      }
    }
    
    /* Privacy Notice Styles */
    .privacy-area {
      padding-top: 10px;
    }
    
    .privacy-complete-notice {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 8px;
      border: 1px solid #a5d6a7;
    }
    
    .privacy-complete-notice .check-icon {
      font-size: 24px;
    }
    
    .privacy-complete-notice .complete-text {
      color: #2e7d32;
      font-weight: 600;
    }
    
    .privacy-document {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 15px;
    }
    
    .privacy-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #1a5f7a;
    }
    
    .privacy-logo {
      width: 80px;
      height: auto;
    }
    
    .privacy-header-text {
      text-align: right;
      font-size: 11px;
      color: #555;
      line-height: 1.4;
    }
    
    .privacy-title {
      text-align: center;
      color: #1a5f7a;
      font-size: 18px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .privacy-content {
      font-size: 12px;
      line-height: 1.6;
      color: #333;
    }
    
    .privacy-content p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    .privacy-content h3 {
      color: #1a5f7a;
      font-size: 13px;
      margin-top: 20px;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .privacy-content h4 {
      color: #333;
      font-size: 12px;
      font-weight: 700;
      margin-top: 15px;
      margin-bottom: 8px;
    }
    
    .privacy-section-title {
      color: #1a5f7a;
      font-size: 13px;
      margin-top: 20px;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .privacy-footer-text {
      text-align: center;
      font-size: 11px;
      color: #666;
      margin-top: 20px;
    }
    
    .privacy-download-section {
      text-align: right;
      margin-bottom: 15px;
    }
    
    .privacy-download-caption {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
      font-style: italic;
    }
    
    .download-privacy-btn {
      display: inline-block;
      padding: 5px 10px;
      background: white;
      border: 1px solid #b0bec5;
      border-radius: 4px;
      color: #607d8b;
      font-weight: 500;
      font-size: 11px;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .download-privacy-btn:hover {
      background: #607d8b;
      color: white;
      border-color: #607d8b;
    }
    
    .download-error {
      font-size: 11px;
      color: #c62828;
      margin-top: 4px;
      display: none;
    }
    
    .download-error.visible {
      display: block;
    }
    
    .privacy-signature-section {
      background: #fafbfc;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      padding: 15px;
    }
    
    .signature-instruction {
      font-size: 13px;
      color: #333;
      margin-bottom: 12px;
      font-weight: 500;
    }
    
    .submit-privacy-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #1a5f7a 0%, #0d3d4d 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(26, 95, 122, 0.3);
      margin-top: 10px;
    }
    
    .submit-privacy-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 95, 122, 0.4);
    }
    
    .submit-privacy-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Required field styling */
    .required-indicator {
      color: #dc3545;
      font-weight: bold;
    }
    
    .required-field.missing {
      border-color: #dc3545 !important;
      background-color: #fff5f5 !important;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
    }
    
    .validation-error-message {
      color: #dc3545;
      font-size: 13px;
      margin-top: 8px;
      padding: 10px 15px;
      background: #fff5f5;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      display: none;
    }
    
    .validation-error-message.visible {
      display: block;
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <div class="header-bar">
      <div class="header-content">
        <div class="logo-icon"><img src="https://pfcassociates.org/PFC_images/PFC_LOGO_4.png" alt="PFC Logo"></div>
        <div class="header-text">
          <h1>PFC Associates, LLC</h1>
          <p>Patient Portal • 920 Varnum St NE, Washington, DC 20017</p>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="portal-container">
        <div class="patient-banner">
          <div class="patient-banner-content">
            <div class="patient-info">
              <div class="patient-label">Patient</div>
              <div class="patient-name">${safePatientName}</div>
            </div>
            ${appointmentInfo ? `
            <div class="appointment-info">
              <div class="appointment-label">Appointment</div>
              <div class="appointment-datetime">${safeApptDate} <span class="appointment-time">@ ${safeApptTime}</span></div>
            </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Sticky Header Container -->
        <div class="sticky-header-container" id="stickyHeaderContainer">
          <!-- Progress Section -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-title">Pre-Visit Checklist</span>
              <span class="progress-count" id="progressCount">${completedCount} of ${totalTasks} complete</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar ${allComplete ? 'complete' : 'partial'}" id="progressBar" style="width: ${(completedCount / totalTasks) * 100}%"></div>
            </div>
          </div>
          
          <!-- Completion Banner -->
          <div class="completion-banner-wrapper ${allComplete ? 'visible' : ''}" id="completionBannerWrapper">
            <div class="completion-banner" id="completionBanner">
              <div class="completion-icon">🎉</div>
              <div class="completion-content">
                <div class="completion-title">All Tasks Complete!</div>
                <div class="completion-text">You're all set for your appointment. See you soon!</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Checklist -->
        <div class="checklist">
          <!-- Privacy Notice Item -->
          <div class="checklist-item ${hasSignedPrivacy ? 'completed' : ''}" id="privacyItem">
            <div class="checklist-header" onclick="toggleChecklist('privacy')">
              <div class="checklist-checkbox">${hasSignedPrivacy ? '✓' : '1'}</div>
              <div class="checklist-info">
                <div class="checklist-title">Read Notice of Privacy Practice</div>
                <div class="checklist-status" id="privacyStatusText">${hasSignedPrivacy ? '✓ Acknowledged on ' + safePrivacyTimestamp : '○ Required'}</div>
              </div>
              <div class="checklist-toggle">▼</div>
            </div>
            <div class="checklist-content">
              <div class="privacy-area">
                ${hasSignedPrivacy ? `
                  <div class="privacy-complete-notice">
                    <div class="check-icon">✅</div>
                    <div class="complete-text">Privacy notice acknowledged on ${safePrivacyTimestamp}</div>
                  </div>
                  <div class="privacy-download-section">
                    <div class="privacy-download-caption">Optional download of the privacy notice for your records</div>
                    <button type="button" class="download-privacy-btn" id="downloadPrivacyBtnCompleted">📄 Download PDF</button>
                    <div class="download-error" id="downloadErrorCompleted">Download failed. Please try again later.</div>
                  </div>
                ` : `
                  <div class="privacy-document">
                    <div class="privacy-header">
                      <img src="https://pfcassociates.org/PFC_images/PFC_LOGO_4.png" alt="PFC Logo" class="privacy-logo">
                      <div class="privacy-header-text">
                        <div>920 Varnum Street, NE</div>
                        <div>Washington, DC 20017-2145</div>
                        <div>Office: (202) 854-7400</div>
                        <div>Fax: (202) 854-7827</div>
                      </div>
                    </div>
                    
                    <h2 class="privacy-title">NOTICE OF PRIVACY PRACTICE</h2>
                    
                    <div class="privacy-content">
                      <p>The Police and Fire Clinic is required by Federal and District of Columbia law to maintain the privacy of protected health information. We must inform you of our privacy practices and legal duties. You have the right to obtain a paper copy of this Notice upon request at any time.</p>
                      
                      <p>We are required to abide by the terms of this Notice of Privacy Practices. From time to time, we may update this notice and you may receive the most current version by contacting the Police and Fire Clinic @ (202) 854-7400. You may request a copy of the revised Notice(s) at any time. You can pick up a revised copy at the Police and Fire Clinic or we will mail a copy at your request within 14 business days. We reserve the right to change the terms of this Notice at any time. Any changes will be effective for all protected health information that the Police and Fire Clinic maintain. Any changes shall be consistent with the law.</p>
                      
                      <p>We have designated a Privacy Officer to answer your questions about our privacy practices and to ensure that the Fire and Police Clinic's continue to comply with applicable Federal and District of Columbia laws and regulations. The Privacy Officer will also take your complaints and can give you information about how to file a complaint. You can contact the Privacy and Security Office at the Police and Fire Clinic at (202) 854-7425 or email PFCHIPAA@pfcassociates.org. The mailing address is 920 Varnum Street NE Washington, DC 20017.</p>
                      
                      <p>If you still have questions or concerns about the District's Policies and Procedures regarding HIPAA, you may contact the Director, Medical Services Branch @ (202)-854-7416. Additionally, you may contact the District of Columbia's Director/District-Wide Privacy and Security Official, within the Attorney General's Office, Health Care and Confidentiality on 202-442-9373.</p>
                      
                      <h3 class="privacy-section-title">USE AND DISCLOSURE OF YOUR PROTECTED HEALTH INFORMATION THAT WE MAY MAKE TO CARRY OUT TREATMENT, PAYMENT, AND HEALTH CARE OPERATIONS</h3>
                      
                      <h4>TREATMENT</h4>
                      <p>The Police and Fire Clinic may use information in your records to provide treatment to you. We may disclose information in your record to help you get health care services from another provider, a hospital, etc. An example is if you are referred to a specialist for treatment, he or she may ask a Police and Fire Clinic physician to share your health information to provide the treatment.</p>
                      
                      <h4>PAYMENT</h4>
                      <p>We may use or disclose information from your record to obtain payment for the services you receive. An example is when your information is used or disclosed to complete a claim form to obtain payment from an insurer.</p>
                      
                      <h4>HEALTHCARE OPERATIONS</h4>
                      <p>We may use or disclose information from your record to allow health care operations. These operations include activities like reviewing records to see how care can be improved, contacting you with information about treatment alternatives, and coordinating care with other providers. An example would be to engage in quality review activities or for the implementation of compliance programs. This would also include sharing information as needed with our accountants, with the management team for The Police and Fire Clinic and our attorneys.</p>
                      
                      <h4>HEALTH OVERSIGHT</h4>
                      <p>We may share your information as it relates to public health, abuse or neglect, and health oversight. As an example, to alert a person who may have been exposed to a disease or may be at risk for contracting or spreading a disease.</p>
                      
                      <h3 class="privacy-section-title">USE OR DISCLOSURE OF YOUR PROTECTED HEALTH INFORMATION THAT WE ARE REQUIRED TO MAKE WITHOUT YOUR PERMISSION</h3>
                      <p>In certain circumstances, the Police and Fire Clinic is required by law to make a disclosure of your health information. Also, we must disclose information to the Department of Health and Human Services, if requested, to prove that we are complying with regulations that safeguard your health information.</p>
                      
                      <h3 class="privacy-section-title">USE OR DISCLOSURE OF YOUR PROTECTED HEALTH INFORMATION THAT WE ARE ALLOWED TO MAKE WITHOUT YOUR PERMISSION</h3>
                      <p>There are certain situations where we are allowed to disclose information from your record without your permission. In these situations, we must use our professional judgment before disclosing information about you. Usually, we must determine that the disclosure is in your best interest, and may have to meet certain guidelines and limitations.</p>
                      
                      <p>We may use or disclose information from your record if we believe it is necessary to prevent or lessen a serious and imminent threat to the safety of a person or the public. We may report suspected cases of abuse, neglect, or domestic violence involving adult or disabled victims.</p>
                      
                      <p>The Police and Fire Clinic may release health information related to Military, National Security, and Intelligence Activities, or for the protection of the President.</p>
                      
                      <p>We may report certain types of diseases, injuries, adverse drug reactions, and product defects to public health authorities. We may disclose information from your record to a medical examiner or coroner. We may disclose information to funeral directors to allow them to carry out their duties upon your death.</p>
                      
                      <p>We may assist in health oversight activities, such as investigations of possible health care fraud.</p>
                      
                      <p>We may disclose information from your record as authorized by workers' compensation laws.</p>
                      
                      <p>We may disclose information from your record if ordered to do so by a court, grand jury, or administrative tribunal. Under certain conditions, we may disclose information in response to a subpoena or other legal process, even if a court does not order it.</p>
                      
                      <p>We may disclose information from your record to law enforcement officials, if certain criteria are met. For example, if such information would help locate or identify a missing person, we are allowed to disclose it.</p>
                      
                      <p>If you provide information to us that reveal you may have committed a crime, we may be required to disclose that information to law enforcement or to prosecuting attorneys charged with the duty of investigating potential crimes.</p>
                      
                      <h3 class="privacy-section-title">YOUR RIGHTS</h3>
                      <p>You may ask us to restrict the use and disclosure of certain information in your record that otherwise would be allowed for treatment, payment, or health care operations. However, we do not have to agree to these restrictions and we will notify you within 14 business days if we do not agree.</p>
                      
                      <p>You have a right to receive confidential communications from us. For example, if you want information at an alternative address, please notify us.</p>
                      
                      <p>You have a right to inspect the information in your record. You may request a copy of your record in paper or electronic form. An authorization form must be completed in order to obtain a copy of your record. It must be completed, signed, and dated by the member. Typically, you can expect a 14-day turnaround time for your request to be completed after the request has been received in the Health Information Management Department. If your circumstances require a more rapid turnaround time, please contact the Health Information Management Department @ (202) 854-7847 to discuss your request.</p>
                      
                      <p>On occasion, extenuating circumstances applicable to certain requests may delay the turnaround time. You may request the information in paper or electronic form as long as it is reasonable for both parties. For example, you may request your records on a CD drive or a USB device. This may be subject to certain limitations and fees. Your request must be in writing.</p>
                      
                      <p>Your employer pays the Police and Fire Clinic for services rendered. You are not allowed to self-pay. If you wish for your employer not to find out about treatment you must seek care from your personal physician. In this case you may not be covered under occupational guidelines.</p>
                      
                      <p>If you believe information in your record is not accurate or not complete, you may request amendment of the information. You must submit enough information to support your request for amendment. Your request must be in writing. The Police and Fire Clinic will determine the accuracy or completeness of the record and notify you within 14 business days of the outcome.</p>
                      
                      <p>You have the right to request an accounting of certain disclosures made by us. Your request must be submitted in writing.</p>
                      
                      <p>You have the right to complain to us about our privacy practices, including the actions of our staff with respect to the privacy of your health information. You also have the right to complain to the Secretary of the Department of Health and Human Services about our privacy practices. You will not face retaliation from us or your agency for making complaints.</p>
                      
                      <p>Except as described in this Notice we may not use or disclose information from your record unless you give your written authorization. We are required to disclose information from your record under a written court order in the interest of justice. You may revoke an authorization in writing at any time, but this will not affect any use or disclosure made by us before the revocation.</p>
                      
                      <h3 class="privacy-section-title">NOTICE OF POLICY REGARDING DISCLOSURES TO YOUR EMPLOYER</h3>
                      <p>In most instances, we are not permitted to disclose any health information about you to your employer. However, since we are contracted by your employer to provide health care and we are seeing you at the request of your employer, there are certain circumstances where we may disclose health information to your employer.</p>
                      
                      <p>For example, when we see you because of a work-related illness or injury, we may report certain information to your employer regarding that illness or injury. This is to allow your employer to correct potential problems, and to meet legal requirements. Certain information gathered as a condition of your employment, such as urine drug screen results, may also be reported to your employer.</p>
                      
                      <p>We also may disclose health information to your employer for workplace medical surveillance. For example, we may disclose information to help your employer identify patterns of injury or illness.</p>
                      
                      <p>Apart from these circumstances, your health information is subject to all the protections allowed for by law.</p>
                      
                      <p>Additionally, in being consistent with the Genetic Information Nondiscrimination Act (GINA), we are prohibited from disclosing genetic information of an individual for underwriting purposes. Within certain limited exception(s), information may be shared with insurance companies that underwrite long-term care policies.</p>
                      
                      <h3 class="privacy-section-title">OTHER REASONS WE MAY USE YOUR INFORMATION</h3>
                      <p>Office staff may contact you to provide appointment reminders as a courtesy. However, you are responsible for remembering your appointment.</p>
                      
                      <p>We may contact you with information about treatment alternatives or other health-related benefits or services that may be of interest to you.</p>
                      
                      <p>Unless otherwise stated in this Notice, most uses and disclosures of psychotherapy notes (if recorded by the Police and Fire Clinic) require us to notify and obtain your consent unless we are required to make a disclosure of this type of information by law or as previously set forth in this Notice. The Police and Fire Clinic does not use or disclose health information for marketing purposes. The Police and Fire Clinic does not undertake in fundraising communications to you.</p>
                      
                      <p>Also, it should be noted that employment records are not covered under these HIPAA regulations but will be safeguarded in a manner consistent with privacy practices and guidelines previously established to protect member's confidentiality.</p>
                      
                      <p>We are required at the Police and Fire Clinic to notify you of any breach of your unsecured PHI.</p>
                      
                      <p class="privacy-footer-text"><em>"This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully."</em></p>
                    </div>
                    
                    <div class="privacy-download-section">
                      <div class="privacy-download-caption">Optional download of the privacy notice for your records</div>
                      <button type="button" class="download-privacy-btn" id="downloadPrivacyBtn">📄 Download PDF</button>
                      <div class="download-error" id="downloadError">Download failed. Please try again later.</div>
                    </div>
                    
                    <div class="privacy-signature-section">
                      <p class="signature-instruction">By signing below, I acknowledge that I have read and understand the Notice of Privacy Practice.</p>
                      <div class="form-group">
                        <label class="form-label">Electronic Signature (Type your full name):</label>
                        <input type="text" class="form-input signature-input" id="privacySignature" placeholder="Type your full legal name">
                      </div>
                      <button type="button" class="submit-privacy-btn" id="submitPrivacyBtn">Acknowledge Privacy Notice</button>
                      <div class="message" id="privacyMessage"></div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
          
          <!-- Vaccination Upload Item -->
          <div class="checklist-item ${hasUploadedVaccination ? 'completed' : ''}" id="vaccinationItem">
            <div class="checklist-header" onclick="toggleChecklist('vaccination')">
              <div class="checklist-checkbox">${hasUploadedVaccination ? '✓' : '2'}</div>
              <div class="checklist-info">
                <div class="checklist-title">Upload Vaccination Proof</div>
                <div class="checklist-status" id="vaccinationStatus">${isNoProofVaccination ? '⚠ No proof of vaccination — ' + escapeHtml(lastUploadInfo.replace('NO_PROOF:', '')) : hasUploadedVaccination ? '✓ Uploaded on ' + safeLastUploadInfo : '○ Required'}</div>
              </div>
              <div class="checklist-toggle">▼</div>
            </div>
            <div class="checklist-content">
              <div class="upload-area">
                <div class="upload-status-cards">
                  <div class="status-card files">
                    <div class="status-card-label">Files Submitted</div>
                    <div class="status-card-value" id="fileCountValue">${safeFileCount}</div>
                  </div>
                  <div class="status-card last-upload" id="lastUploadCard" style="${lastUploadInfo ? '' : 'display:none;'}">
                    <div class="status-card-label">Last Upload</div>
                    <div class="status-card-value" id="lastUploadValue">${safeLastUploadInfo}</div>
                  </div>
                </div>
                
                <div class="dropzone" id="dropzone">
                  <div class="dropzone-icon">📁</div>
                  <div class="dropzone-text">Drag & drop your file here</div>
                  <div class="dropzone-subtext">or tap to browse your device</div>
                </div>
                
                <input type="file" class="file-input" id="fileInput" accept="image/*,.pdf,.doc,.docx">
                
                <div class="selected-file" id="selectedFile">
                  <span class="file-icon">📎</span>
                  <div class="file-info">
                    <div class="file-name" id="fileName"></div>
                    <div class="file-size" id="fileSize"></div>
                  </div>
                  <button class="remove-file" id="removeFile">✕</button>
                </div>
                
                <button class="action-btn" id="uploadBtn">Upload File</button>
                
                <div class="uploaded-file-name ${safeLastFileName && !isNoProofVaccination ? 'visible' : ''}" id="uploadedFileName">
                  <span class="uploaded-icon">✅</span>
                  <span id="uploadedFileNameText">${safeLastFileName || ''}</span>
                </div>
                
                <div class="message" id="uploadMessage"></div>
                
                <button class="upload-another" id="uploadAnother">Upload Another File</button>
                
                <button class="no-proof-btn ${hasUploadedVaccination ? 'hidden' : ''}" id="noProofBtn">I don't have proof of vaccination</button>
                
                <div class="confirm-overlay" id="noProofConfirm">
                  <div class="confirm-modal">
                    <div class="confirm-header">
                      <span class="confirm-header-icon">⚠️</span>
                      <span class="confirm-header-title">No Proof of Vaccination</span>
                    </div>
                    <div class="confirm-body">
                      Are you sure you don't have proof of vaccination? You can always come back and upload it later.
                    </div>
                    <div class="confirm-footer">
                      <button class="confirm-btn cancel" id="noProofCancel">Cancel</button>
                      <button class="confirm-btn proceed" id="noProofProceed">Yes, I'm Sure</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Questionnaire Item -->
          <div class="checklist-item ${hasCompletedQuestionnaire ? 'completed' : ''}" id="questionnaireItem">
            <div class="checklist-header" onclick="toggleChecklist('questionnaire')">
              <div class="checklist-checkbox">${hasCompletedQuestionnaire ? '✓' : '3'}</div>
              <div class="checklist-info">
                <div class="checklist-title">Complete Health Questionnaire</div>
                <div class="checklist-status" id="questionnaireStatusText">${hasCompletedQuestionnaire ? '✓ Completed on ' + safeQuestionnaireTimestamp : '○ Required'}</div>
              </div>
              <div class="checklist-toggle">▼</div>
            </div>
            <div class="checklist-content">
              <div class="questionnaire-area">
                ${hasCompletedQuestionnaire ? `
                  <div class="questionnaire-complete-notice">
                    <div class="check-icon">✅</div>
                    <div class="complete-text">Questionnaire completed on ${safeQuestionnaireTimestamp}</div>
                  </div>
                ` : `
                  <form id="questionnaireForm">
                    <div class="form-intro">
                      <p><strong>Applicant Medical Questionnaire</strong></p>
                      <p class="form-intro-sub">Please check YES or NO for each condition you have now or have ever had.</p>
                    </div>
                    
                    <!-- PATIENT INFO Section -->
                    <div class="form-section">
                      <div class="form-section-title">PATIENT INFORMATION</div>
                      <div class="form-row" style="display: flex; gap: 15px;">
                        <div class="form-group" style="flex: 1;">
                          <label class="form-label">First Name <span class="required-indicator">*</span></label>
                          <input type="text" class="form-input required-field" name="firstName" id="questFirstName" placeholder="John">
                        </div>
                        <div class="form-group" style="flex: 1;">
                          <label class="form-label">Last Name <span class="required-indicator">*</span></label>
                          <input type="text" class="form-input required-field" name="lastName" id="questLastName" placeholder="Smith">
                        </div>
                      </div>
                    </div>
                    
                    <!-- HEAD Section -->
                    <div class="form-section">
                      <div class="form-section-title">HEAD</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_injury" value="Yes"><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_injury" value="No"><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Loss of Consciousness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_loc" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_loc" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Seizure</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_seizure" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_seizure" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Dizziness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_dizziness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_dizziness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Fainting</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_fainting" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_fainting" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Chronic Headaches</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_headaches" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_headaches" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Migraines</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="head_migraines" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="head_migraines" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- EARS Section -->
                    <div class="form-section">
                      <div class="form-section-title">EARS</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="ears_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="ears_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Ringing</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="ears_ringing" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="ears_ringing" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Decreased Hearing</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="ears_decreased" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="ears_decreased" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Hearing Loss</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="ears_loss" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="ears_loss" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Ruptured Ear Drum</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="ears_ruptured" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="ears_ruptured" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- EYES Section -->
                    <div class="form-section">
                      <div class="form-section-title">EYES</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Double Vision</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_double" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_double" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Blurred Vision</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_blurred" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_blurred" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Glasses</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_glasses" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_glasses" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Contacts</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_contacts" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_contacts" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Decreased Far Vision</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_far" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_far" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Decreased Near Vision</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_near" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_near" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Vision in One Eye</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_oneeye" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_oneeye" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Color Vision Disorder</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="eyes_color" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="eyes_color" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- THROAT/NECK Section -->
                    <div class="form-section">
                      <div class="form-section-title">THROAT / NECK</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Throat Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="throat_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="throat_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Chronic Sore Throats</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="throat_sore" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="throat_sore" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Neck Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neck_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neck_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Neck Masses</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neck_masses" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neck_masses" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- CARDIOVASCULAR Section -->
                    <div class="form-section">
                      <div class="form-section-title">CARDIOVASCULAR</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Chest Pain/Tightness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_chest" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_chest" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Heart Attack</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_attack" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_attack" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Palpitations</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_palpitations" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_palpitations" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Irregular Heart Beat</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_irregular" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_irregular" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">High Blood Pressure</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_bp" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_bp" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Stroke</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_stroke" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_stroke" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Heart Murmur</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="cardio_murmur" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="cardio_murmur" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- MEDICAL CONDITIONS Section -->
                    <div class="form-section">
                      <div class="form-section-title">MEDICAL CONDITIONS</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Diabetes</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="med_diabetes" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="med_diabetes" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Thyroid Disorder</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="med_thyroid" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="med_thyroid" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Cancer</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="med_cancer" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="med_cancer" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Bleeding Disorder</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="med_bleeding" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="med_bleeding" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Anemia</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="med_anemia" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="med_anemia" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- PULMONARY/NOSE/SINUS Section -->
                    <div class="form-section">
                      <div class="form-section-title">PULMONARY / NOSE / SINUS</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Asthma</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="pulm_asthma" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="pulm_asthma" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Shortness of Breath</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="pulm_breath" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="pulm_breath" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Lung Disease/Problems</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="pulm_lung" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="pulm_lung" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Nose Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="nose_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="nose_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Chronic Nose Bleeds</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="nose_bleeds" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="nose_bleeds" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Sinus Allergies</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="sinus_allergies" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="sinus_allergies" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- ABDOMEN Section -->
                    <div class="form-section">
                      <div class="form-section-title">ABDOMEN</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Chronic Abdominal Pain</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_pain" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_pain" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Abdominal Cramps</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_cramps" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_cramps" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Diarrhea</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_diarrhea" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_diarrhea" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Nausea/Vomiting</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_nausea" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_nausea" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Bowel Problems</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_bowel" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_bowel" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Hepatitis</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_hepatitis" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_hepatitis" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Hernia</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="abd_hernia" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="abd_hernia" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- MUSCULOSKELETAL Section -->
                    <div class="form-section">
                      <div class="form-section-title">MUSCULOSKELETAL</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Joint Pain</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_joint" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_joint" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Muscle Weakness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_weakness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_weakness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Arthritis</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_arthritis" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_arthritis" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Back Injury or Pain</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_back" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_back" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Back Surgery</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_backsurg" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_backsurg" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Herniated Disk</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="musc_herniated" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="musc_herniated" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- KIDNEY Section -->
                    <div class="form-section">
                      <div class="form-section-title">KIDNEY</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Kidney Injury</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="kidney_injury" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="kidney_injury" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Bladder Disorders</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="kidney_bladder" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="kidney_bladder" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Kidney Disorders</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="kidney_disorders" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="kidney_disorders" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Dark Urine</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="kidney_urine" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="kidney_urine" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- FRACTURES OR INJURY Section -->
                    <div class="form-section">
                      <div class="form-section-title">FRACTURES OR INJURY</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Shoulder</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_shoulder" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_shoulder" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Elbow</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_elbow" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_elbow" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Wrist</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_wrist" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_wrist" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Hand</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_hand" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_hand" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Fingers</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_fingers" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_fingers" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Hip</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_hip" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_hip" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Knee</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_knee" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_knee" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Ankle</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_ankle" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_ankle" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Foot</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_foot" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_foot" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Other Joint</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="frac_other" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="frac_other" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- MENTAL Section -->
                    <div class="form-section">
                      <div class="form-section-title">MENTAL HEALTH</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Memory Loss</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_memory" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_memory" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Depression</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_depression" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_depression" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Phobias (incl. Claustrophobia)</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_phobias" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_phobias" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Suicidal Thoughts</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_suicidal" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_suicidal" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Homicidal Thoughts</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_homicidal" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_homicidal" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Anxiety</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_anxiety" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_anxiety" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">PTSD</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_ptsd" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_ptsd" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Decreased Alertness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_alertness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_alertness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Unexplained Sleepiness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="mental_sleepiness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="mental_sleepiness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- NEUROLOGICAL Section -->
                    <div class="form-section">
                      <div class="form-section-title">NEUROLOGICAL</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Tremors</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neuro_tremors" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neuro_tremors" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Numbness/Weakness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neuro_numbness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neuro_numbness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Confusion</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neuro_confusion" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neuro_confusion" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Dizziness</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neuro_dizziness" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neuro_dizziness" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Convulsions</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="neuro_convulsions" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="neuro_convulsions" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- SKIN Section -->
                    <div class="form-section">
                      <div class="form-section-title">SKIN</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Rash</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="skin_rash" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="skin_rash" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Jaundice</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="skin_jaundice" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="skin_jaundice" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- EXPLANATION Section -->
                    <div class="form-section">
                      <div class="form-section-title">ANSWERS TO YES - EXPLAIN</div>
                      <div class="form-group">
                        <label class="form-label">For any YES answers above, please explain (including dates and treatments):</label>
                        <textarea class="form-textarea" name="yesExplanation" placeholder="Explain any conditions you answered YES to, including dates and any treatments received..." rows="4"></textarea>
                      </div>
                    </div>
                    
                    <!-- HOSPITALIZATIONS Section -->
                    <div class="form-section">
                      <div class="form-section-title">HOSPITALIZATIONS, OPERATIONS, INJURIES OR ILLNESS</div>
                      <div class="form-group">
                        <label class="form-label">Please list any hospitalizations, operations, injuries, or significant illnesses (with year):</label>
                        <textarea class="form-textarea" name="hospitalizations" placeholder="Example: Appendectomy - 2018, Broken arm - 2015&#10;Enter 'None' if not applicable" rows="3"></textarea>
                      </div>
                    </div>
                    
                    <!-- VACCINES Section -->
                    <div class="form-section">
                      <div class="form-section-title">IMMUNIZATION HISTORY</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Hepatitis Vaccine (3-shot series)?</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="vaccine_hep" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="vaccine_hep" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">History of Positive T.B. Test?</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="tb_positive" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="tb_positive" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-group" style="margin-top: 12px;">
                        <label class="form-label">If positive T.B. test, treatment dates:</label>
                        <input type="text" class="form-input" name="tb_treatment" placeholder="Enter treatment dates if applicable">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Last T.B. Test Date:</label>
                        <input type="text" class="form-input" name="tb_test_date" placeholder="MM/YYYY or approximate date">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Last Tetanus Shot Date:</label>
                        <input type="text" class="form-input" name="tetanus_date" placeholder="MM/YYYY or approximate date">
                      </div>
                    </div>
                    
                    <!-- CHILDHOOD DISEASES Section -->
                    <div class="form-section">
                      <div class="form-section-title">CHILDHOOD DISEASES</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Chicken Pox</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="child_chickenpox" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="child_chickenpox" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Mumps</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="child_mumps" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="child_mumps" value="No" ><span>No</span></label>
                          </div>
                        </div>
                        <div class="condition-row required-field">
                          <span class="condition-label">Measles</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="child_measles" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="child_measles" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- SOCIAL HISTORY Section -->
                    <div class="form-section">
                      <div class="form-section-title">SOCIAL HISTORY</div>
                      <div class="condition-grid">
                        <div class="condition-row required-field">
                          <span class="condition-label">Have you ever smoked?</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="smoke" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="smoke" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row" style="margin-top: 10px;">
                        <div class="form-group" style="flex: 1;">
                          <label class="form-label">If yes, packs per day:</label>
                          <input type="text" class="form-input" name="smoke_packs" placeholder="e.g., 1">
                        </div>
                        <div class="form-group" style="flex: 1;">
                          <label class="form-label">Years smoked:</label>
                          <input type="text" class="form-input" name="smoke_years" placeholder="e.g., 5">
                        </div>
                      </div>
                      <div class="condition-grid" style="margin-top: 12px;">
                        <div class="condition-row required-field">
                          <span class="condition-label">Do you drink alcohol?</span>
                          <div class="condition-options">
                            <label class="condition-option"><input type="radio" name="alcohol" value="Yes" ><span>Yes</span></label>
                            <label class="condition-option"><input type="radio" name="alcohol" value="No" ><span>No</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-group" style="margin-top: 10px;">
                        <label class="form-label">If yes, how much per week?</label>
                        <input type="text" class="form-input" name="alcohol_amount" placeholder="e.g., 2-3 drinks per week">
                      </div>
                    </div>
                    
                    <!-- MEDICATIONS Section -->
                    <div class="form-section">
                      <div class="form-section-title">CURRENT MEDICATIONS</div>
                      <div class="form-group">
                        <label class="form-label">List all medications you are currently taking (medication name, dose, frequency):</label>
                        <textarea class="form-textarea" name="medications" placeholder="Example:&#10;Lisinopril - 10mg - Once daily&#10;Metformin - 500mg - Twice daily&#10;&#10;Enter 'None' if not taking any medications" rows="4"></textarea>
                      </div>
                    </div>
                    
                    <!-- DRUG ALLERGIES Section -->
                    <div class="form-section">
                      <div class="form-section-title">DRUG ALLERGIES</div>
                      <div class="form-group">
                        <label class="form-label">List any drug allergies:</label>
                        <textarea class="form-textarea" name="drugAllergies" placeholder="List any medications you are allergic to and the reaction&#10;Enter 'None' if no known drug allergies" rows="2"></textarea>
                      </div>
                    </div>
                    
                    <!-- CERTIFICATION Section -->
                    <div class="form-section certification-section">
                      <div class="form-section-title">CERTIFICATION</div>
                      <p class="certification-text">I certify to the best of my knowledge that the above answers are correct and complete.</p>
                      <div class="form-group">
                        <label class="form-label">Electronic Signature (Type your full name):</label>
                        <input type="text" class="form-input signature-input" name="signature" placeholder="Type your full legal name">
                      </div>
                    </div>
                    
                    <div class="validation-error-message" id="validationErrorMessage"></div>
                    <button type="submit" class="submit-questionnaire-btn" id="submitQuestionnaireBtn">Submit Medical Questionnaire</button>
                  </form>
                  
                  <div class="message" id="questionnaireMessage"></div>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bar">
      <div class="footer-text">PFC Associates, LLC • 920 Varnum St NE, Washington, DC 20017</div>
    </div>
  </div>

  <script>
    let completedTasks = ${completedCount};
    const totalTasks = ${totalTasks};
    
    // Toggle checklist item expansion
    function toggleChecklist(itemId) {
      const item = document.getElementById(itemId + 'Item');
      const wasExpanded = item.classList.contains('expanded');
      
      // Close all items
      document.querySelectorAll('.checklist-item').forEach(el => {
        el.classList.remove('expanded');
      });
      
      // If it wasn't expanded, expand it
      if (!wasExpanded) {
        item.classList.add('expanded');
      }
    }
    
    // Update progress display
    function updateProgress() {
      const progressCount = document.getElementById('progressCount');
      const progressBar = document.getElementById('progressBar');
      const completionBanner = document.getElementById('completionBanner');
      
      progressCount.textContent = completedTasks + ' of ' + totalTasks + ' complete';
      progressBar.style.width = ((completedTasks / totalTasks) * 100) + '%';
      
      if (completedTasks === totalTasks) {
        progressBar.classList.remove('partial');
        progressBar.classList.add('complete');
        document.getElementById('completionBannerWrapper').classList.add('visible');
      }
    }
    
    // Vaccination upload handling
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const selectedFile = document.getElementById('selectedFile');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadMessage = document.getElementById('uploadMessage');
    const uploadAnother = document.getElementById('uploadAnother');
    const noProofBtn = document.getElementById('noProofBtn');
    const uploadedFileNameEl = document.getElementById('uploadedFileName');
    const uploadedFileNameText = document.getElementById('uploadedFileNameText');
    
    let currentFile = null;
    let uploadedFileCount = ${safeFileCount};
    let vaccinationWasCompleted = ${hasUploadedVaccination};
    let isNoProof = ${isNoProofVaccination};
    
    // If patient previously selected "no proof", hide upload controls on load
    if (isNoProof) {
      dropzone.style.display = 'none';
      noProofBtn.classList.add('hidden');
      uploadMessage.textContent = 'You indicated you don\\'t have proof of vaccination. You can upload it later if needed using the "Upload Another File" button.';
      uploadMessage.className = 'message success visible';
      uploadAnother.classList.add('visible');
    }
    
    // Click to browse
    dropzone.addEventListener('click', function() {
      fileInput.click();
    });
    
    // Drag and drop
    dropzone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });
    
    function handleFile(file) {
      currentFile = file;
      
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      selectedFile.classList.add('visible');
      uploadBtn.classList.add('visible');
      dropzone.style.display = 'none';
      uploadMessage.classList.remove('visible');
    }
    
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    // Remove file
    removeFile.addEventListener('click', function() {
      currentFile = null;
      fileInput.value = '';
      selectedFile.classList.remove('visible');
      uploadBtn.classList.remove('visible');
      dropzone.style.display = 'block';
    });
    
    // Upload
    uploadBtn.addEventListener('click', function() {
      if (!currentFile) return;
      
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<span class="loading-spinner"></span>Uploading...';
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        
        google.script.run
          .withSuccessHandler(function(result) {
            if (result.success) {
              uploadMessage.textContent = '✓ File uploaded successfully!';
              uploadMessage.className = 'message success visible';
              
              selectedFile.classList.remove('visible');
              uploadBtn.classList.remove('visible');
              uploadAnother.classList.add('visible');
              
              // Show uploaded file name
              if (result.fileName) {
                uploadedFileNameText.textContent = result.fileName;
                uploadedFileNameEl.classList.add('visible');
              }
              
              // Hide the "no proof" button since they uploaded
              noProofBtn.classList.add('hidden');
              isNoProof = false;
              
              // Update file count
              uploadedFileCount++;
              document.getElementById('fileCountValue').textContent = uploadedFileCount;
              
              // Update last upload timestamp
              document.getElementById('lastUploadValue').textContent = result.uploadTime;
              document.getElementById('lastUploadCard').style.display = '';
              
              // Update vaccination status
              const vaccinationItem = document.getElementById('vaccinationItem');
              const vaccinationStatus = document.getElementById('vaccinationStatus');
              
              if (!vaccinationWasCompleted) {
                vaccinationItem.classList.add('completed');
                vaccinationItem.querySelector('.checklist-checkbox').textContent = '✓';
                completedTasks++;
                vaccinationWasCompleted = true;
                updateProgress();
              }
              vaccinationStatus.textContent = '✓ Uploaded on ' + result.uploadTime;
              
              // Auto-collapse vaccination section and expand next incomplete section
              setTimeout(function() {
                vaccinationItem.classList.remove('expanded');
                const questionnaireItem = document.getElementById('questionnaireItem');
                if (!questionnaireItem.classList.contains('completed')) {
                  questionnaireItem.classList.add('expanded');
                  questionnaireItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 1500);
            } else {
              uploadMessage.textContent = 'Error: ' + (result.message || 'Upload failed');
              uploadMessage.className = 'message error visible';
              uploadBtn.disabled = false;
              uploadBtn.textContent = 'Upload File';
            }
          })
          .withFailureHandler(function(error) {
            uploadMessage.textContent = 'Error: Upload failed. Please try again.';
            uploadMessage.className = 'message error visible';
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload File';
          })
          .uploadFile('${safePortalToken || safeFolderId}', currentFile.name, base64Data, currentFile.type);
      };
      
      reader.readAsDataURL(currentFile);
    });
    
    // Upload another
    uploadAnother.addEventListener('click', function() {
      currentFile = null;
      fileInput.value = '';
      uploadMessage.classList.remove('visible');
      uploadAnother.classList.remove('visible');
      uploadedFileNameEl.classList.remove('visible');
      dropzone.style.display = 'block';
      
      // Reset upload button state
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload File';
      uploadBtn.classList.remove('visible');
      uploadBtn.classList.remove('uploaded-state');
      selectedFile.classList.remove('visible');
    });
    
    // No proof of vaccination handler
    const noProofConfirm = document.getElementById('noProofConfirm');
    const noProofCancel = document.getElementById('noProofCancel');
    const noProofProceed = document.getElementById('noProofProceed');
    
    noProofBtn.addEventListener('click', function() {
      noProofConfirm.classList.add('visible');
    });
    
    noProofCancel.addEventListener('click', function() {
      noProofConfirm.classList.remove('visible');
    });
    
    // Close modal if clicking overlay background
    noProofConfirm.addEventListener('click', function(e) {
      if (e.target === noProofConfirm) {
        noProofConfirm.classList.remove('visible');
      }
    });
    
    noProofProceed.addEventListener('click', function() {
      noProofConfirm.classList.remove('visible');
      
      noProofBtn.disabled = true;
      noProofBtn.textContent = 'Saving...';
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result.success) {
            // Mark vaccination as complete (skipped)
            const vaccinationItem = document.getElementById('vaccinationItem');
            const vaccinationStatus = document.getElementById('vaccinationStatus');
            
            if (!vaccinationWasCompleted) {
              vaccinationItem.classList.add('completed');
              vaccinationItem.querySelector('.checklist-checkbox').textContent = '✓';
              completedTasks++;
              vaccinationWasCompleted = true;
              isNoProof = true;
              updateProgress();
            }
            vaccinationStatus.textContent = '⚠ No proof of vaccination — ' + result.timestamp;
            
            // Hide the button and upload controls
            noProofBtn.classList.add('hidden');
            dropzone.style.display = 'none';
            uploadMessage.textContent = 'You indicated you don\\'t have proof of vaccination. You can upload it later if needed.';
            uploadMessage.className = 'message success visible';
            uploadAnother.classList.add('visible');
            
            // Auto-collapse and move to next item
            setTimeout(function() {
              vaccinationItem.classList.remove('expanded');
              const questionnaireItem = document.getElementById('questionnaireItem');
              if (!questionnaireItem.classList.contains('completed')) {
                questionnaireItem.classList.add('expanded');
                questionnaireItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 1500);
          } else {
            noProofBtn.disabled = false;
            noProofBtn.textContent = 'I don\\'t have proof of vaccination';
            uploadMessage.textContent = 'Error: ' + (result.message || 'Could not save. Please try again.');
            uploadMessage.className = 'message error visible';
          }
        })
        .withFailureHandler(function(error) {
          noProofBtn.disabled = false;
          noProofBtn.textContent = 'I don\\'t have proof of vaccination';
          uploadMessage.textContent = 'Error: Could not save. Please try again.';
          uploadMessage.className = 'message error visible';
        })
        .markNoProofVaccination('${safePortalToken || safeFolderId}');
    });
    
    // Privacy PDF download handler
    var downloadPrivacyBtn = document.getElementById('downloadPrivacyBtn');
    if (downloadPrivacyBtn) downloadPrivacyBtn.addEventListener('click', function() {
      var btn = this;
      var errorEl = document.getElementById('downloadError');
      errorEl.classList.remove('visible');
      btn.textContent = '⏳ Downloading...';
      btn.disabled = true;
      
      try {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.src = 'https://drive.google.com/uc?export=download&id=1iaucey2QMWcijItR6Vk4YLhPAZo6i8Ow';
        
        // Reset button after a short delay (download triggers in background)
        setTimeout(function() {
          btn.textContent = '📄 Download PDF';
          btn.disabled = false;
        }, 2000);
        
        // Clean up iframe after download has time to start
        setTimeout(function() {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 10000);
      } catch (e) {
        errorEl.classList.add('visible');
        btn.textContent = '📄 Download PDF';
        btn.disabled = false;
        setTimeout(function() { errorEl.classList.remove('visible'); }, 5000);
      }
    });
    
    // Privacy PDF download handler (completed state)
    var downloadBtnCompleted = document.getElementById('downloadPrivacyBtnCompleted');
    if (downloadBtnCompleted) {
      downloadBtnCompleted.addEventListener('click', function() {
        var btn = this;
        var errorEl = document.getElementById('downloadErrorCompleted');
        errorEl.classList.remove('visible');
        btn.textContent = '⏳ Downloading...';
        btn.disabled = true;
        
        try {
          var iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframe.src = 'https://drive.google.com/uc?export=download&id=1iaucey2QMWcijItR6Vk4YLhPAZo6i8Ow';
          
          setTimeout(function() {
            btn.textContent = '📄 Download PDF';
            btn.disabled = false;
          }, 2000);
          
          setTimeout(function() {
            if (iframe.parentNode) {
              document.body.removeChild(iframe);
            }
          }, 10000);
        } catch (e) {
          errorEl.classList.add('visible');
          btn.textContent = '📄 Download PDF';
          btn.disabled = false;
          setTimeout(function() { errorEl.classList.remove('visible'); }, 5000);
        }
      });
    }
    
    // Questionnaire form handling
    const questionnaireForm = document.getElementById('questionnaireForm');
    const questionnaireMessage = document.getElementById('questionnaireMessage');
    const submitQuestionnaireBtn = document.getElementById('submitQuestionnaireBtn');
    const validationErrorMessage = document.getElementById('validationErrorMessage');
    
    if (questionnaireForm) {
      questionnaireForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous validation styling
        document.querySelectorAll('.required-field.missing').forEach(function(el) {
          el.classList.remove('missing');
        });
        validationErrorMessage.classList.remove('visible');
        validationErrorMessage.textContent = '';
        
        // Get required field values
        const firstName = document.getElementById('questFirstName').value.trim();
        const lastName = document.getElementById('questLastName').value.trim();
        
        // Validate required fields
        const missingFields = [];
        if (!firstName) {
          missingFields.push('First Name');
          document.getElementById('questFirstName').classList.add('missing');
        }
        if (!lastName) {
          missingFields.push('Last Name');
          document.getElementById('questLastName').classList.add('missing');
        }
        
        // Check all radio button groups are answered
        let unansweredRadioCount = 0;
        const radioGroups = {};
        document.querySelectorAll('.condition-row.required-field input[type="radio"]').forEach(function(radio) {
          if (!radioGroups[radio.name]) {
            radioGroups[radio.name] = radio.closest('.condition-row');
          }
        });
        
        Object.keys(radioGroups).forEach(function(name) {
          const isAnswered = document.querySelector('input[name="' + name + '"]:checked');
          const row = radioGroups[name];
          if (!isAnswered && row) {
            row.classList.add('missing');
            unansweredRadioCount++;
          }
        });
        
        if (unansweredRadioCount > 0) {
          missingFields.push(unansweredRadioCount + ' unanswered question' + (unansweredRadioCount > 1 ? 's' : ''));
        }
        
        // If validation fails, show error and scroll to first missing field
        if (missingFields.length > 0) {
          validationErrorMessage.textContent = 'Please complete all required fields: ' + missingFields.join(', ');
          validationErrorMessage.classList.add('visible');
          
          // Scroll to first missing field
          const firstMissing = document.querySelector('.required-field.missing');
          if (firstMissing) {
            firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (firstMissing.focus) firstMissing.focus();
          }
          return;
        }
        
        submitQuestionnaireBtn.disabled = true;
        submitQuestionnaireBtn.innerHTML = '<span class="loading-spinner"></span>Submitting...';
        
        // Collect ALL form data properly
        const formData = new FormData(questionnaireForm);
        const questionnaireData = {};
        
        // Iterate through all form entries
        for (const [key, value] of formData.entries()) {
          questionnaireData[key] = value;
        }
        
        // Add timestamp
        questionnaireData.submittedAt = new Date().toLocaleString();
        
        google.script.run
          .withSuccessHandler(function(result) {
            if (result.success) {
              questionnaireMessage.textContent = '✓ Questionnaire submitted successfully!';
              questionnaireMessage.className = 'message success visible';
              questionnaireForm.style.display = 'none';
              
              // Update questionnaire status
              const questionnaireItem = document.getElementById('questionnaireItem');
              const questionnaireStatusText = document.getElementById('questionnaireStatusText');
              
              questionnaireItem.classList.add('completed');
                questionnaireItem.querySelector('.checklist-checkbox').textContent = '✓';
                questionnaireStatusText.textContent = '✓ Completed on ' + result.timestamp;
                
                completedTasks++;
                updateProgress();
                
                // Auto-collapse questionnaire section after completion
                setTimeout(function() {
                  questionnaireItem.classList.remove('expanded');
                  // Scroll to completion banner if all tasks done
                  const completionBanner = document.getElementById('completionBanner');
                  if (completionBanner.classList.contains('visible')) {
                    completionBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 1500);
            } else {
              questionnaireMessage.textContent = 'Error: ' + (result.message || 'Submission failed');
              questionnaireMessage.className = 'message error visible';
              submitQuestionnaireBtn.disabled = false;
              submitQuestionnaireBtn.textContent = 'Submit Questionnaire';
            }
          })
          .withFailureHandler(function(error) {
            questionnaireMessage.textContent = 'Error: Submission failed. Please try again.';
            questionnaireMessage.className = 'message error visible';
            submitQuestionnaireBtn.disabled = false;
            submitQuestionnaireBtn.textContent = 'Submit Questionnaire';
          })
          .saveQuestionnaire('${safePortalToken || safeFolderId}', questionnaireData);
      });
    }
    
    // Update field styling based on answered/unanswered state
    function updateFieldState(element) {
      if (element.type === 'radio') {
        // For radio buttons, find the parent condition-row
        const conditionRow = element.closest('.condition-row');
        if (conditionRow) {
          const radioName = element.name;
          const isAnswered = document.querySelector('input[name="' + radioName + '"]:checked');
          if (isAnswered) {
            conditionRow.classList.add('answered');
            conditionRow.classList.remove('missing');
          } else {
            conditionRow.classList.remove('answered');
          }
        }
      } else if (element.classList.contains('form-input') || element.classList.contains('form-textarea')) {
        // For text inputs and textareas
        if (element.value.trim() !== '') {
          element.classList.add('answered');
          element.classList.remove('missing');
        } else {
          element.classList.remove('answered');
        }
      }
    }
    
    // Initialize all field states on page load
    function initializeFieldStates() {
      // Check all radio buttons
      const radioGroups = {};
      document.querySelectorAll('.condition-row input[type="radio"]').forEach(radio => {
        if (!radioGroups[radio.name]) {
          radioGroups[radio.name] = radio.closest('.condition-row');
        }
      });
      
      Object.keys(radioGroups).forEach(name => {
        const isAnswered = document.querySelector('input[name="' + name + '"]:checked');
        const conditionRow = radioGroups[name];
        if (conditionRow) {
          if (isAnswered) {
            conditionRow.classList.add('answered');
          } else {
            conditionRow.classList.remove('answered');
          }
        }
      });
      
      // Check all text inputs and textareas
      document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        updateFieldState(input);
      });
    }
    
    // Privacy notice submission handling
    const submitPrivacyBtn = document.getElementById('submitPrivacyBtn');
    const privacySignature = document.getElementById('privacySignature');
    const privacyMessage = document.getElementById('privacyMessage');
    let privacyWasCompleted = ${hasSignedPrivacy};
    
    
    
    if (submitPrivacyBtn) {
      submitPrivacyBtn.addEventListener('click', function() {
        const signature = privacySignature.value.trim();
        
        if (!signature) {
          privacyMessage.textContent = 'Please enter your signature to acknowledge.';
          privacyMessage.className = 'message error visible';
          return;
        }
        
        submitPrivacyBtn.disabled = true;
        submitPrivacyBtn.innerHTML = '<span class="loading-spinner"></span>Submitting...';
        privacyMessage.classList.remove('visible');
        
        google.script.run
          .withSuccessHandler(function(result) {
            if (result.success) {
              privacyMessage.textContent = '✓ Privacy notice acknowledged successfully!';
              privacyMessage.className = 'message success visible';
              
              // Update privacy status
              const privacyItem = document.getElementById('privacyItem');
              const privacyStatusText = document.getElementById('privacyStatusText');
              
              privacyItem.classList.add('completed');
              privacyItem.querySelector('.checklist-checkbox').textContent = '✓';
              privacyStatusText.textContent = '✓ Acknowledged on ' + result.timestamp;
              
              // Hide the form but keep download available
              document.querySelector('.privacy-document').style.display = 'none';
              document.querySelector('.privacy-signature-section').innerHTML = '<div class="privacy-complete-notice"><div class="check-icon">✅</div><div class="complete-text">Privacy notice acknowledged on ' + result.timestamp + '</div></div>';
              
              if (!privacyWasCompleted) {
                completedTasks++;
                updateProgress();
              }
              
              // Auto-collapse after completion
              setTimeout(function() {
                privacyItem.classList.remove('expanded');
                // Expand next incomplete item
                const vaccinationItem = document.getElementById('vaccinationItem');
                const questionnaireItem = document.getElementById('questionnaireItem');
                if (!vaccinationItem.classList.contains('completed')) {
                  vaccinationItem.classList.add('expanded');
                } else if (!questionnaireItem.classList.contains('completed')) {
                  questionnaireItem.classList.add('expanded');
                }
              }, 1500);
            } else {
              privacyMessage.textContent = 'Error: ' + (result.message || 'Submission failed');
              privacyMessage.className = 'message error visible';
              submitPrivacyBtn.disabled = false;
              submitPrivacyBtn.textContent = 'Acknowledge Privacy Notice';
            }
          })
          .withFailureHandler(function(error) {
            privacyMessage.textContent = 'Error: Submission failed. Please try again.';
            privacyMessage.className = 'message error visible';
            submitPrivacyBtn.disabled = false;
            submitPrivacyBtn.textContent = 'Acknowledge Privacy Notice';
          })
          .savePrivacyNotice('${safePortalToken || safeFolderId}', { signature: signature });
      });
    }
    
    // Auto-expand first incomplete item on load
    document.addEventListener('DOMContentLoaded', function() {
      const privacyItem = document.getElementById('privacyItem');
      const vaccinationItem = document.getElementById('vaccinationItem');
      const questionnaireItem = document.getElementById('questionnaireItem');
      
      if (!privacyItem.classList.contains('completed')) {
        privacyItem.classList.add('expanded');
      } else // Initialize field states
      initializeFieldStates();
      
      // Track if radio was already checked before mousedown
      let radioWasChecked = false;
      let radioTarget = null;
      
      // Helper to find radio button from click target (handles label clicks)
      function findRadioFromTarget(target) {
        // If it's the radio itself
        if (target.type === 'radio') {
          return target;
        }
        // If it's inside a label that contains a radio
        const label = target.closest('label.condition-option');
        if (label) {
          return label.querySelector('input[type="radio"]');
        }
        return null;
      }
      
      // On mousedown, record if this radio is already checked
      document.addEventListener('mousedown', function(e) {
        const radio = findRadioFromTarget(e.target);
        if (radio && radio.closest('.condition-row')) {
          radioWasChecked = radio.checked;
          radioTarget = radio;
        }
      });
      
      // On click, use setTimeout to deselect after browser processes the click
      document.addEventListener('click', function(e) {
        const radio = findRadioFromTarget(e.target);
        if (radio && radio.closest('.condition-row')) {
          if (radioWasChecked && radioTarget === radio) {
            // Use setTimeout to run after browser's default behavior
            setTimeout(function() {
              radio.checked = false;
              updateFieldState(radio);
            }, 0);
          } else {
            updateFieldState(radio);
          }
        }
      });
      
      // Listen for radio button changes (for keyboard navigation)
      document.addEventListener('change', function(e) {
        if (e.target.type === 'radio' && e.target.closest('.condition-row')) {
          updateFieldState(e.target);
        }
      });
      
      // Listen for text input changes
      document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-input') || e.target.classList.contains('form-textarea')) {
          updateFieldState(e.target);
        }
      });
    });
  </script>
</body>
</html>
`;
}

// ================================================================================
// SERVER-SIDE FUNCTIONS - Called by the frontend
// ================================================================================

function getAvailableSlots() {
  // Note: No PHI is returned by this function, but we log access for security monitoring
  // Uncomment the following line if you want to track slot viewing patterns:
  // logAuditEvent('VIEW_AVAILABLE_SLOTS', 'Anonymous', null, 'Available slots requested');
  
  // PERFORMANCE: Check cache first - slots don't change rapidly
  const cache = CacheService.getScriptCache();
  const cacheKey = 'available_slots_data';
  const cached = cache.get(cacheKey);
  
  if (cached !== null) {
    try {
      const cachedSlots = JSON.parse(cached);
      // Filter out slots that have passed minBookingTime since cache was created
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + (MIN_HOURS_ADVANCE * 60 * 60 * 1000));
      const minBookingTimestamp = minBookingTime.getTime();
      
      return cachedSlots.filter(slot => slot.slotTimestamp > minBookingTimestamp);
    } catch (e) {
      // Cache corrupted, continue to fetch fresh
    }
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Appointments');
  const data = sheet.getDataRange().getValues();
  const tz = Session.getScriptTimeZone();
  
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + (MIN_HOURS_ADVANCE * 60 * 60 * 1000));
  
  const available = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = row[0];
    const startTime = row[1];
    const endTime = row[2];
    const capacity = row[3];
    const booked = row[5] || 0;
    
    if (!date || !startTime || !endTime || !capacity) continue;
    
    const remaining = capacity - booked;
    
    const slotDate = new Date(date);
    const slotTime = new Date(startTime);
    const slotDateTime = new Date(slotDate);
    slotDateTime.setHours(slotTime.getHours(), slotTime.getMinutes(), 0, 0);
    
    if (slotDateTime <= minBookingTime) {
      continue;
    }
    
    available.push({
      row: i + 1,
      dateKey: Utilities.formatDate(slotDate, tz, 'yyyy-MM-dd'),
      date: Utilities.formatDate(slotDate, tz, 'EEE, MMM d, yyyy'),
      startTime: Utilities.formatDate(new Date(startTime), tz, 'h:mm a'),
      endTime: Utilities.formatDate(new Date(endTime), tz, 'h:mm a'),
      capacity: capacity,
      booked: booked,
      remaining: remaining,
      slotTimestamp: slotDateTime.getTime()  // For cache filtering
    });
  }
  
  // Cache the result (short duration since bookings change availability)
  try {
    cache.put(cacheKey, JSON.stringify(available), CACHE_SLOTS_DURATION);
  } catch (e) {
    // Cache put failed (possibly data too large), continue without caching
    Logger.log('Failed to cache available slots: ' + e.name);
  }
  
  return available;
}

/**
 * PERFORMANCE: Invalidate slots cache when a booking is made/changed
 * Call this after any booking operation
 */
function invalidateSlotsCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('available_slots_data');
}

function getBookingsForDate(dateKey, token) {
  // Verify session FIRST before any processing
  const sessionCheck = verifySessionForAudit(token, true);
  
  // CRITICAL: Reject if authentication is required but session is invalid
  if (!sessionCheck.valid) {
    logAuditEvent('VIEW_DAILY_BOOKINGS_DENIED', 'Unknown', null, 'Unauthorized access attempt - invalid session');
    return [];
  }
  const requestingUsername = sessionCheck.username;
  
  // Validate dateKey format (YYYY-MM-DD)
  if (!dateKey || typeof dateKey !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    Logger.log('getBookingsForDate: Invalid dateKey format: ' + (dateKey ? dateKey.substring(0, 20) : 'null'));
    return [];
  }
  
  // Validate the date is a real date
  const dateParts = dateKey.split('-');
  const testDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  if (isNaN(testDate.getTime())) {
    Logger.log('getBookingsForDate: Invalid date: ' + dateKey);
    return [];
  }
  
  // Log PHI access for HIPAA compliance
  logAuditEvent('VIEW_DAILY_BOOKINGS', requestingUsername, null, 'Viewed bookings for date: ' + dateKey);
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const appointmentsSheet = ss.getSheetByName('Appointments');
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const tz = Session.getScriptTimeZone();
  
  const appointmentsData = appointmentsSheet.getDataRange().getValues();
  const bookings = [];
  
  // Load DCHR data to get notes
  const dchrLastRow = dchrSheet.getLastRow();
  let dchrData = [];
  if (dchrLastRow >= DCHR_START_ROW) {
    dchrData = dchrSheet.getRange(DCHR_START_ROW, 1, dchrLastRow - DCHR_START_ROW + 1, COL_NOTE_TIMESTAMP).getValues();
  }
  
  // Build a map of patientId to patient data
  const patientDataMap = {};
  for (let i = 0; i < dchrData.length; i++) {
    const patientId = dchrData[i][COL_PATIENT_ID - 1];
    if (patientId) {
      patientDataMap[patientId] = {
        email: dchrData[i][COL_EMAIL - 1] || '',
        hasUploaded: !!dchrData[i][COL_LAST_FILE_LINK - 1],
        isNoProof: dchrData[i][COL_LAST_FILE_LINK - 1] === 'NO_PROOF',
        hasUploadedQuestionnaire: !!dchrData[i][COL_LAST_QUESTIONNAIRE_LINK - 1],
        note: dchrData[i][COL_NOTE - 1] || '',
        noteTimestamp: dchrData[i][COL_NOTE_TIMESTAMP - 1] || '',
        appointmentType: dchrData[i][COL_APPT_TYPE - 1] || '',
        visitStatus: dchrData[i][COL_VISIT_STATUS - 1] || ''
      };
    }
  }
  
  const targetDate = new Date(dateKey + 'T00:00:00');
  
  for (let i = 1; i < appointmentsData.length; i++) {
    const row = appointmentsData[i];
    const date = row[0];
    const startTime = row[1];
    const endTime = row[2];
    const booked = row[5] || 0;
    
    if (!date) continue;
    
    const rowDate = new Date(date);
    const rowDateKey = Utilities.formatDate(rowDate, tz, 'yyyy-MM-dd');
    
    if (rowDateKey !== dateKey) continue;
    
    const timeDisplay = Utilities.formatDate(new Date(startTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
    
    for (let j = 0; j < booked; j++) {
      const colIndex = BOOKING_START_COL - 1 + (j * FIELDS_PER_BOOKING);
      const cellValue = row[colIndex];
      
      if (cellValue) {
        let displayText = cellValue;
        
        const match = displayText.match(/^(.+?)\s*-\s*(DCHR-\d+-ID)$/);
        
        if (match) {
          const name = match[1].trim();
          const patientId = match[2];
          const patientInfo = patientDataMap[patientId] || { email: '', hasUploaded: false, isNoProof: false, note: '', noteTimestamp: '' };
          
          bookings.push({
            name: name,
            patientId: patientId.replace(/[^a-zA-Z0-9\-]/g, ''), // Sanitize for safe HTML attribute use
            email: patientInfo.email,
            hasUploaded: patientInfo.hasUploaded,
            isNoProof: patientInfo.isNoProof || false,
            hasUploadedQuestionnaire: patientInfo.hasUploadedQuestionnaire,
            note: patientInfo.note,
            noteTimestamp: patientInfo.noteTimestamp,
            appointmentType: patientInfo.appointmentType,
            visitStatus: patientInfo.visitStatus,
            time: timeDisplay,
            appointmentRow: i + 1
          });
        }
      }
    }
  }
  
  bookings.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  return bookings;
}

function getBookingsForMonth(year, month, token) {
  // Verify session FIRST before any processing
  const sessionCheck = verifySessionForAudit(token, true);
  
  // CRITICAL: Reject if authentication is required but session is invalid
  if (!sessionCheck.valid) {
    logAuditEvent('VIEW_MONTHLY_BOOKINGS_DENIED', 'Unknown', null, 'Unauthorized access attempt - invalid session');
    return [];
  }
  const requestingUsername = sessionCheck.username;
  
  // Validate year and month
  if (typeof year !== 'number' || typeof month !== 'number' ||
      !Number.isInteger(year) || !Number.isInteger(month) ||
      year < 2000 || year > 2100 ||
      month < 0 || month > 11) {
    Logger.log('getBookingsForMonth: Invalid year/month: ' + year + '/' + month);
    return [];
  }
  
  // Log PHI access for HIPAA compliance
  logAuditEvent('VIEW_MONTHLY_BOOKINGS', requestingUsername, null, 'Viewed bookings for: ' + (month + 1) + '/' + year);
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const appointmentsSheet = ss.getSheetByName('Appointments');
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const tz = Session.getScriptTimeZone();
  
  const appointmentsData = appointmentsSheet.getDataRange().getValues();
  const bookings = [];
  
  // Load DCHR data to get notes
  const dchrLastRow = dchrSheet.getLastRow();
  let dchrData = [];
  if (dchrLastRow >= DCHR_START_ROW) {
    dchrData = dchrSheet.getRange(DCHR_START_ROW, 1, dchrLastRow - DCHR_START_ROW + 1, COL_NOTE_TIMESTAMP).getValues();
  }
  
  // Build a map of patientId to patient data
  const patientDataMap = {};
  for (let i = 0; i < dchrData.length; i++) {
    const patientId = dchrData[i][COL_PATIENT_ID - 1];
    if (patientId) {
      patientDataMap[patientId] = {
        email: dchrData[i][COL_EMAIL - 1] || '',
        hasUploaded: !!dchrData[i][COL_LAST_FILE_LINK - 1],
        isNoProof: dchrData[i][COL_LAST_FILE_LINK - 1] === 'NO_PROOF',
        hasUploadedQuestionnaire: !!dchrData[i][COL_LAST_QUESTIONNAIRE_LINK - 1],
        note: dchrData[i][COL_NOTE - 1] || '',
        noteTimestamp: dchrData[i][COL_NOTE_TIMESTAMP - 1] || '',
        appointmentType: dchrData[i][COL_APPT_TYPE - 1] || '',
        visitStatus: dchrData[i][COL_VISIT_STATUS - 1] || ''
      };
    }
  }
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  for (let i = 1; i < appointmentsData.length; i++) {
    const row = appointmentsData[i];
    const date = row[0];
    const startTime = row[1];
    const endTime = row[2];
    const booked = row[5] || 0;
    
    if (!date) continue;
    
    const rowDate = new Date(date);
    if (rowDate < firstDayOfMonth || rowDate > lastDayOfMonth) continue;
    
    const dateDisplay = Utilities.formatDate(rowDate, tz, 'EEE, MMM d, yyyy');
    const timeDisplay = Utilities.formatDate(new Date(startTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
    
    for (let j = 0; j < booked; j++) {
      const colIndex = BOOKING_START_COL - 1 + (j * FIELDS_PER_BOOKING);
      const cellValue = row[colIndex];
      
      if (cellValue) {
        let displayText = cellValue;
        
        const match = displayText.match(/^(.+?)\s*-\s*(DCHR-\d+-ID)$/);
        
        if (match) {
          const name = match[1].trim();
          const patientId = match[2];
          const patientInfo = patientDataMap[patientId] || { email: '', hasUploaded: false, isNoProof: false, note: '', noteTimestamp: '' };
          
          bookings.push({
            name: name,
            patientId: patientId.replace(/[^a-zA-Z0-9\-]/g, ''), // Sanitize for safe HTML attribute use
            email: patientInfo.email,
            hasUploaded: patientInfo.hasUploaded,
            isNoProof: patientInfo.isNoProof || false,
            hasUploadedQuestionnaire: patientInfo.hasUploadedQuestionnaire,
            note: patientInfo.note,
            noteTimestamp: patientInfo.noteTimestamp,
            appointmentType: patientInfo.appointmentType,
            visitStatus: patientInfo.visitStatus,
            time: timeDisplay,
            appointmentRow: i + 1
          });
        }
      }
    }
  }
  
  bookings.sort((a, b) => {
    if (a.dateSort !== b.dateSort) {
      return a.dateSort - b.dateSort;
    }
    return a.time.localeCompare(b.time);
  });
  
  return bookings;
}

function checkDuplicatePatient(firstName, lastName, dob, token) {
  // Note: This function is called during booking to detect duplicates
  // Audit logging deferred to the calling function (bookAppointment) to avoid
  // logging PHI searches that don't result in matches
  
  // Verify session - must be valid if authentication is required
  const sessionCheck = verifySessionForAudit(token, true);
  if (!sessionCheck.valid) {
    // Log unauthorized attempt without PHI
    logAuditEvent('DUPLICATE_CHECK_DENIED', 'Unknown', null, 'Unauthorized duplicate check attempt - invalid session');
    // Return object indicating auth failure so client can handle appropriately
    return { authError: true };
  }
  
  try {
    // Basic input validation
    if (!firstName || !lastName || !dob) {
      return null;
    }
    
    // Limit input lengths
    if (firstName.length > 100 || lastName.length > 100) {
      return null;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    return null;
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_APPT_TIME).getValues();
  
  // Normalize input for comparison
  const normalizedFirstName = firstName.trim().toLowerCase();
  const normalizedLastName = lastName.trim().toLowerCase();
  const normalizedDob = dob; // Already in yyyy-MM-dd format from the form
  
  for (let i = 0; i < data.length; i++) {
    const rowFirstName = (data[i][COL_FIRST_NAME - 1] || '').toString().trim().toLowerCase();
    const rowLastName = (data[i][COL_LAST_NAME - 1] || '').toString().trim().toLowerCase();
    let rowDob = data[i][COL_DOB - 1];
    
    // Format the DOB from the sheet for comparison
    if (rowDob instanceof Date) {
      rowDob = Utilities.formatDate(rowDob, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } else if (rowDob) {
      const dobDate = new Date(rowDob);
      if (!isNaN(dobDate.getTime())) {
        rowDob = Utilities.formatDate(dobDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
    }
    
    if (rowFirstName === normalizedFirstName && 
        rowLastName === normalizedLastName && 
        rowDob === normalizedDob) {
      // Found a match - return patient info
      const patientId = data[i][COL_PATIENT_ID - 1];
      const email = data[i][COL_EMAIL - 1] || '';
      const phone = data[i][COL_PHONE - 1] || '';
      const apptDate = data[i][COL_APPT_DATE - 1] || '';
      const apptTime = data[i][COL_APPT_TIME - 1] || '';
      
      // Log duplicate detection for HIPAA audit trail - use actual requesting username
      logAuditEvent('DUPLICATE_CHECK_MATCH', sessionCheck.username, patientId, 'Duplicate patient detected during booking');
      
      return {
        patientId: patientId,
        firstName: data[i][COL_FIRST_NAME - 1],
        lastName: data[i][COL_LAST_NAME - 1],
        dob: rowDob,
        email: email,
        phone: phone,
        existingAppointment: apptDate ? (apptDate + ' ' + apptTime) : null,
        dchrRow: DCHR_START_ROW + i
      };
    }
  }
  
  return null;
  
  } catch (error) {
    // Log without PHI (error may contain patient names from search)
    Logger.log('checkDuplicatePatient error occurred. Error type: ' + error.name);
    return null; // Fail open - allow booking to proceed
  }
}

function getPatientDetails(patientId, token) {
  // Verify session and get authenticated username for audit
  const sessionCheck = verifySessionForAudit(token, true);
  
  // CRITICAL: Reject if authentication is required but session is invalid
  if (!sessionCheck.valid) {
    logAuditEvent('VIEW_PATIENT_DENIED', 'Unknown', patientId || 'N/A', 'Unauthorized access attempt - invalid session');
    return null;
  }
  const requestingUsername = sessionCheck.username;
  
  // Validate patientId format before processing
  if (!patientId || typeof patientId !== 'string' || !patientId.match(/^DCHR-\d{7}-ID$/)) {
    logAuditEvent('VIEW_PATIENT_FAILED', requestingUsername, patientId || 'INVALID', 'Invalid patient ID format attempted');
    return null;
  }
  
  // Log PHI access for HIPAA compliance
  logAuditEvent('VIEW_PATIENT', requestingUsername, patientId, 'Accessed patient details');
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    return null;
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_PATIENT_ID - 1] === patientId) {
      const row = data[i];
      
      let dobFormatted = '';
      if (row[COL_DOB - 1]) {
        const dobValue = row[COL_DOB - 1];
        if (dobValue instanceof Date) {
          dobFormatted = Utilities.formatDate(dobValue, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else {
          const dobDate = new Date(dobValue);
          if (!isNaN(dobDate.getTime())) {
            dobFormatted = Utilities.formatDate(dobDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          }
        }
      }
      
      // Mask SSN for display (show only last 4 digits) - NEVER return full SSN to client
      const fullSsn = row[COL_SSN - 1] || '';
      const maskedSsn = fullSsn ? '***-**-' + fullSsn.slice(-4) : '';
      
      return {
        patientId: row[COL_PATIENT_ID - 1],
        lastName: row[COL_LAST_NAME - 1] || '',
        firstName: row[COL_FIRST_NAME - 1] || '',
        gender: row[COL_GENDER - 1] || '',
        ssn: maskedSsn,
        // SECURITY: Full SSN intentionally omitted - reschedule preserves existing SSN server-side
        appointmentType: row[COL_APPT_TYPE - 1] || '',
        caseNumber: row[COL_CASE_NUMBER - 1] || '',
        address: row[COL_ADDRESS - 1] || '',
        city: row[COL_CITY - 1] || '',
        state: row[COL_STATE - 1] || '',
        zipCode: row[COL_ZIP - 1] || '',
        phone: row[COL_PHONE - 1] || '',
        email: row[COL_EMAIL - 1] || '',
        dob: dobFormatted,
        folderLink: row[COL_FOLDER_LINK - 1] || '',
        uploadLink: row[COL_UPLOAD_LINK - 1] || ''
      };
    }
  }
  
  // Log that patient was not found (potential data integrity issue or unauthorized probe)
  logAuditEvent('VIEW_PATIENT_NOT_FOUND', requestingUsername, patientId, 'Patient ID not found in records');
  return null;
}

function findDchrRowByPatientId(patientId) {
  // Validate patientId format
  if (!patientId || typeof patientId !== 'string' || !/^DCHR-\d{7}-ID$/.test(patientId)) {
    Logger.log('findDchrRowByPatientId: Invalid patientId format');
    return -1;
  }
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
    const lastRow = dchrSheet.getLastRow();
    
    if (lastRow < DCHR_START_ROW) {
      return -1;
    }
    
    const data = dchrSheet.getRange(DCHR_START_ROW, COL_PATIENT_ID, lastRow - DCHR_START_ROW + 1, 1).getValues();
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === patientId) {
        return DCHR_START_ROW + i;
      }
    }
    
    return -1;
  } catch (error) {
    Logger.log('findDchrRowByPatientId: Sheet access error');
    return -1;
  }
}

function removeBookingFromSlot(appointmentRow, patientId) {
  // Validate inputs
  if (!appointmentRow || typeof appointmentRow !== 'number' || appointmentRow < 2 || !Number.isInteger(appointmentRow)) {
    Logger.log('removeBookingFromSlot: Invalid appointmentRow: ' + appointmentRow);
    return false;
  }
  if (!patientId || typeof patientId !== 'string' || !patientId.match(/^DCHR-\d{7}-ID$/)) {
    Logger.log('removeBookingFromSlot: Invalid patientId format');
    return false;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const appointmentsSheet = ss.getSheetByName('Appointments');
  
  // Validate row is within sheet bounds
  const lastRow = appointmentsSheet.getLastRow();
  if (appointmentRow > lastRow) {
    Logger.log('removeBookingFromSlot: appointmentRow exceeds sheet bounds');
    return false;
  }
  
  const rowData = appointmentsSheet.getRange(appointmentRow, 1, 1, 100).getValues()[0];
  const capacity = rowData[3];
  const booked = rowData[5] || 0;
  
  let foundColIndex = -1;
  for (let j = 0; j < booked; j++) {
    const colIndex = BOOKING_START_COL - 1 + (j * FIELDS_PER_BOOKING);
    const cellValue = rowData[colIndex];
    
    // Ensure both values are strings for safe comparison
    if (cellValue && typeof cellValue.toString === 'function' && cellValue.toString().includes(patientId)) {
      foundColIndex = j;
      break;
    }
  }
  
  if (foundColIndex === -1) {
    return false;
  }
  
  for (let j = foundColIndex; j < booked - 1; j++) {
    const currentCol = BOOKING_START_COL + (j * FIELDS_PER_BOOKING);
    const nextCol = BOOKING_START_COL + ((j + 1) * FIELDS_PER_BOOKING);
    
    const nextCell = appointmentsSheet.getRange(appointmentRow, nextCol);
    const nextFormula = nextCell.getFormula();
    const nextValue = nextCell.getValue();
    
    const currentCell = appointmentsSheet.getRange(appointmentRow, currentCol);
    if (nextFormula) {
      currentCell.setFormula(nextFormula);
    } else {
      currentCell.setValue(nextValue);
    }
  }
  
  const lastCol = BOOKING_START_COL + ((booked - 1) * FIELDS_PER_BOOKING);
  appointmentsSheet.getRange(appointmentRow, lastCol).clearContent();
  
  const newBookedCount = booked - 1;
  appointmentsSheet.getRange(appointmentRow, 6).setValue(newBookedCount);
  appointmentsSheet.getRange(appointmentRow, 7).setValue(capacity - newBookedCount);
  
  return true;
}

function generatePatientId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  
  const currentValue = dchrSheet.getRange('C1').getValue();
  let counter = 0;
  
  if (typeof currentValue === 'number' && currentValue > 0) {
    counter = Math.floor(currentValue);
  } else if (typeof currentValue === 'string' && !isNaN(parseInt(currentValue))) {
    counter = parseInt(currentValue);
  }
  
  const newCounter = counter + 1;
  
  // Protect against overflow (max 9,999,999 for 7-digit format)
  if (newCounter > 9999999) {
    throw new Error('Patient ID counter has reached maximum value. Contact system administrator.');
  }
  
  dchrSheet.getRange('C1').setValue(newCounter);
  
  const paddedNumber = String(newCounter).padStart(7, '0');
  return 'DCHR-' + paddedNumber + '-ID';
}

function getNextTestNumber() {
  // Security: Only allow test data in development
  // To enable: Set cell C1 in DCHR_All_Categories to "ENABLE_TEST_MODE"
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  
  const testModeFlag = dchrSheet.getRange('E1').getValue();
  if (testModeFlag !== 'ENABLE_TEST_MODE') {
    Logger.log('Test data function called but test mode not enabled');
    return Math.floor(Math.random() * 10000); // Return random number instead
  }
  
  const currentValue = dchrSheet.getRange('D1').getValue();
  let counter = 0;
  
  if (typeof currentValue === 'number' && currentValue > 0) {
    counter = Math.floor(currentValue);
  } else if (typeof currentValue === 'string' && !isNaN(parseInt(currentValue))) {
    counter = parseInt(currentValue);
  }
  
  const newCounter = counter + 1;
  
  dchrSheet.getRange('D1').setValue(newCounter);
  
  return newCounter;
}

function getNextDchrRow() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    return DCHR_START_ROW;
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, COL_PATIENT_ID, lastRow - DCHR_START_ROW + 1, 1).getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (!data[i][0] || data[i][0] === '') {
      return DCHR_START_ROW + i;
    }
  }
  
  return lastRow + 1;
}

function bookAppointment(slotRow, lastName, firstName, gender, ssn, appointmentType, caseNumber, address, city, state, zipCode, phone, email, dob, reschedulingPatientId, oldAppointmentRow, bookedByUsername, useExistingPatientId) {
  // Type validation - ensure string parameters are strings
  const stringParams = { lastName, firstName, gender, ssn, appointmentType, caseNumber, address, city, state, zipCode, phone, email, dob };
  for (const [name, value] of Object.entries(stringParams)) {
    if (value !== null && value !== undefined && value !== '' && typeof value !== 'string') {
      return { success: false, message: 'Invalid input type for ' + name + '.' };
    }
  }
  
  // Type validation for optional patient ID parameters
  if (reschedulingPatientId !== null && reschedulingPatientId !== undefined && reschedulingPatientId !== '' && typeof reschedulingPatientId !== 'string') {
    return { success: false, message: 'Invalid rescheduling patient ID type.' };
  }
  if (useExistingPatientId !== null && useExistingPatientId !== undefined && useExistingPatientId !== '' && typeof useExistingPatientId !== 'string') {
    return { success: false, message: 'Invalid existing patient ID type.' };
  }
  
  // Server-side input validation (don't trust client-side validation)
  const validationErrors = [];
  
  // Input length limits (prevent DoS and data issues)
  const MAX_NAME_LENGTH = 100;
  const MAX_ADDRESS_LENGTH = 200;
  const MAX_CITY_LENGTH = 100;
  
  if (lastName && lastName.length > MAX_NAME_LENGTH) validationErrors.push('Last name too long (max ' + MAX_NAME_LENGTH + ' chars)');
  if (firstName && firstName.length > MAX_NAME_LENGTH) validationErrors.push('First name too long (max ' + MAX_NAME_LENGTH + ' chars)');
  if (address && address.length > MAX_ADDRESS_LENGTH) validationErrors.push('Address too long (max ' + MAX_ADDRESS_LENGTH + ' chars)');
  if (city && city.length > MAX_CITY_LENGTH) validationErrors.push('City too long (max ' + MAX_CITY_LENGTH + ' chars)');
  
  // Required field checks
  if (!lastName || !lastName.trim()) validationErrors.push('Last name is required');
  if (!firstName || !firstName.trim()) validationErrors.push('First name is required');
  if (!gender) validationErrors.push('Gender is required');
  if (!dob) validationErrors.push('Date of birth is required');
  if (!phone || !phone.trim()) validationErrors.push('Phone is required');
  if (!email || !email.trim()) validationErrors.push('Email is required');
  if (!appointmentType) validationErrors.push('Appointment type is required');
  if (!caseNumber || !caseNumber.trim()) validationErrors.push('Case number is required');
  
  // Format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email.trim())) {
    validationErrors.push('Invalid email format');
  }
  
  const ssnRegex = /^(\d{3}-?\d{2}-?\d{4}|\*{3}-\*{2}-\d{4})$/;
  if (ssn && !ssnRegex.test(ssn.trim())) {
    validationErrors.push('Invalid SSN format (use XXX-XX-XXXX)');
  }
  
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  if (phone && !phoneRegex.test(phone.trim())) {
    validationErrors.push('Invalid phone format (minimum 10 digits)');
  }
  
  if (state && (state.trim().length !== 2 || !/^[A-Za-z]{2}$/.test(state.trim()))) {
    validationErrors.push('State must be 2-letter code (e.g., CA, NY)');
  }
  
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (zipCode && !zipRegex.test(zipCode.trim())) {
    validationErrors.push('Invalid zip code format');
  }
  
  // DOB validation
  if (dob) {
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      validationErrors.push('Invalid date of birth');
    } else if (dobDate > new Date()) {
      validationErrors.push('Date of birth cannot be in the future');
    }
  }
  
  // Valid appointment types
  const validAppointmentTypes = ['Pre-Employment', 'Fitness for Duty', 'Shy Bladder', 'Shy Lung'];
  if (appointmentType && !validAppointmentTypes.includes(appointmentType)) {
    validationErrors.push('Invalid appointment type');
  }
  
  // Valid genders
  const validGenders = ['Male', 'Female', 'Other'];
  if (gender && !validGenders.includes(gender)) {
    validationErrors.push('Invalid gender selection');
  }
  
  if (validationErrors.length > 0) {
    return { success: false, message: 'Validation errors: ' + validationErrors.join(', ') };
  }
  
  // Basic validation of row parameters (bounds check happens after sheet retrieval)
  // Also check for excessively large values to prevent potential issues
  const MAX_REASONABLE_ROW = 100000;
  if (!slotRow || typeof slotRow !== 'number' || !Number.isInteger(slotRow) || slotRow < 2 || slotRow > MAX_REASONABLE_ROW) {
    return { success: false, message: 'Invalid appointment slot reference.' };
  }
  
  if (oldAppointmentRow !== null && oldAppointmentRow !== undefined && oldAppointmentRow !== '') {
    if (typeof oldAppointmentRow !== 'number' || !Number.isInteger(oldAppointmentRow) || oldAppointmentRow < 2 || oldAppointmentRow > MAX_REASONABLE_ROW) {
      return { success: false, message: 'Invalid original appointment reference.' };
    }
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const appointmentsSheet = ss.getSheetByName('Appointments');
  
  // Validate row parameters against actual sheet bounds (after sheet is retrieved)
  const appointmentsLastRow = appointmentsSheet.getLastRow();
  if (slotRow > appointmentsLastRow) {
    return { success: false, message: 'Invalid appointment slot reference.' };
  }
  if (oldAppointmentRow && oldAppointmentRow > appointmentsLastRow) {
    return { success: false, message: 'Invalid original appointment reference.' };
  }
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const tz = Session.getScriptTimeZone();

  // Verify session and get authenticated username for audit
  // Note: bookedByUsername parameter is now treated as token
  const sessionCheck = verifySessionForAudit(bookedByUsername, true);
  if (!sessionCheck.valid) {
    return { success: false, message: sessionCheck.error };
  }
  const verifiedUsername = sessionCheck.username;
  
  const isReschedule = reschedulingPatientId && reschedulingPatientId.trim() !== '';
  const isExistingPatient = useExistingPatientId && useExistingPatientId.trim() !== '';
  
  // Validate patient ID format if provided (prevents injection/invalid lookups)
  const patientIdRegex = /^DCHR-\d{7}-ID$/;
  if (isReschedule && !patientIdRegex.test(reschedulingPatientId.trim())) {
    return { success: false, message: 'Invalid patient ID format for reschedule.' };
  }
  if (isExistingPatient && !patientIdRegex.test(useExistingPatientId.trim())) {
    return { success: false, message: 'Invalid patient ID format.' };
  }
  
  // Use LockService to prevent race conditions on concurrent bookings
  const lock = LockService.getScriptLock();
  try {
    // Try to acquire lock for 10 seconds
    if (!lock.tryLock(10000)) {
      return { success: false, message: 'System is busy. Please try again in a moment.' };
    }
    
    // Re-fetch data after acquiring lock to get current state
    const rowData = appointmentsSheet.getRange(slotRow, 1, 1, 100).getValues()[0];
    const date = rowData[0];
    const startTime = rowData[1];
    const endTime = rowData[2];
    const capacity = rowData[3];
    const booked = rowData[5] || 0;
    
    if (booked >= capacity) {
      lock.releaseLock();
      return { success: false, message: 'Sorry, that slot is now fully booked. Please choose another time.' };
    }
  
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + (MIN_HOURS_ADVANCE * 60 * 60 * 1000));
  const slotDate = new Date(date);
  const slotTime = new Date(startTime);
  const slotDateTime = new Date(slotDate);
  slotDateTime.setHours(slotTime.getHours(), slotTime.getMinutes(), 0, 0);
  
  if (slotDateTime <= minBookingTime) {
    lock.releaseLock();
    return { success: false, message: 'Sorry, appointments must be booked at least 24 hours in advance. Please choose another time.' };
  }
  
  let patientId;
  let folderUrl;
  let uploadLink;
  let dchrRow;
  let fullName = firstName + ' ' + lastName;
  
  // Format the username suffix for timestamps (using verified username)
  const usernameSuffix = ' by ' + verifiedUsername;
  
  if (isReschedule) {
    // RESCHEDULING EXISTING APPOINTMENT
    patientId = reschedulingPatientId.trim();
    
    const oldRowData = appointmentsSheet.getRange(oldAppointmentRow, 1, 1, 3).getValues()[0];
    const oldDate = oldRowData[0];
    const oldStartTime = oldRowData[1];
    const oldEndTime = oldRowData[2];
    
    const oldFormattedDate = Utilities.formatDate(new Date(oldDate), tz, 'MM/dd/yyyy');
    const oldFormattedTime = Utilities.formatDate(new Date(oldStartTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(oldEndTime), tz, 'h:mm a');
    
    if (oldAppointmentRow) {
      const removalSuccess = removeBookingFromSlot(oldAppointmentRow, patientId);
      if (!removalSuccess) {
        // Log as potential data integrity issue - patient may have already been removed
        Logger.log('Warning: Could not remove patient from old slot row ' + oldAppointmentRow + '. May have already been removed.');
        // Audit log for tracking - helps identify if this happens frequently
        logAuditEvent('RESCHEDULE_REMOVAL_WARNING', verifiedUsername, patientId, 'Could not remove from old slot row ' + oldAppointmentRow + ' - may already be removed');
      }
    }
    
    dchrRow = findDchrRowByPatientId(patientId);
    if (dchrRow === -1) {
      lock.releaseLock();
      return { success: false, message: 'Could not find patient record for rescheduling.' };
    }
    
    const existingData = dchrSheet.getRange(dchrRow, 1, 1, COL_FOLDER_LINK).getValues()[0];
    folderUrl = existingData[COL_FOLDER_LINK - 1];
    uploadLink = existingData[COL_UPLOAD_LINK - 1];
    
    // IMPORTANT: Preserve original SSN - client only receives masked version
    // so we must NOT overwrite with the masked value from the form
    const existingSsn = existingData[COL_SSN - 1];
    
    const formattedAppointmentDate = Utilities.formatDate(new Date(date), tz, 'MM/dd/yyyy');
    const formattedAppointmentTime = Utilities.formatDate(new Date(startTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
    
    dchrSheet.getRange(dchrRow, COL_APPT_DATE).setValue(formattedAppointmentDate);
    dchrSheet.getRange(dchrRow, COL_APPT_TIME).setValue(formattedAppointmentTime);
    
    const rescheduleTimestamp = Utilities.formatDate(new Date(), tz, 'MM/dd/yyyy h:mm:ss a');
    const lastBookedAtValue = 'From ' + oldFormattedDate + ' ' + oldFormattedTime + ' on ' + rescheduleTimestamp + usernameSuffix;
    dchrSheet.getRange(dchrRow, COL_LAST_BOOKED_AT).setValue(lastBookedAtValue);
    
    dchrSheet.getRange(dchrRow, COL_LAST_NAME).setValue(lastName);
    dchrSheet.getRange(dchrRow, COL_FIRST_NAME).setValue(firstName);
    dchrSheet.getRange(dchrRow, COL_GENDER).setValue(gender);
    // SSN intentionally NOT updated during reschedule - preserve original value
    // dchrSheet.getRange(dchrRow, COL_SSN).setValue(ssn); // REMOVED - would overwrite with masked value
    dchrSheet.getRange(dchrRow, COL_APPT_TYPE).setValue(appointmentType);
    dchrSheet.getRange(dchrRow, COL_CASE_NUMBER).setValue(caseNumber);
    dchrSheet.getRange(dchrRow, COL_ADDRESS).setValue(address);
    dchrSheet.getRange(dchrRow, COL_CITY).setValue(city);
    dchrSheet.getRange(dchrRow, COL_STATE).setValue(state);
    dchrSheet.getRange(dchrRow, COL_ZIP).setValue(zipCode);
    dchrSheet.getRange(dchrRow, COL_PHONE).setValue(phone);
    dchrSheet.getRange(dchrRow, COL_EMAIL).setValue(email);
    dchrSheet.getRange(dchrRow, COL_DOB).setValue(dob);
    
  } else if (isExistingPatient) {
    // BOOKING WITH EXISTING PATIENT RECORD
    patientId = useExistingPatientId.trim();
    
    // Log the decision to reuse existing patient record
    logAuditEvent('REUSE_EXISTING_PATIENT', verifiedUsername, patientId, 'User confirmed reuse of existing patient record');
    
    dchrRow = findDchrRowByPatientId(patientId);
    if (dchrRow === -1) {
      lock.releaseLock();
      return { success: false, message: 'Could not find existing patient record.' };
    }
    
    // Get existing folder and upload links - keep these unchanged
    const existingData = dchrSheet.getRange(dchrRow, 1, 1, COL_FOLDER_LINK).getValues()[0];
    folderUrl = existingData[COL_FOLDER_LINK - 1];
    uploadLink = existingData[COL_UPLOAD_LINK - 1];
    
    const formattedAppointmentDate = Utilities.formatDate(new Date(date), tz, 'MM/dd/yyyy');
    const formattedAppointmentTime = Utilities.formatDate(new Date(startTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
    
    // Note in Last Booked At that this is a rebooking of existing patient
    const rebookTimestamp = Utilities.formatDate(new Date(), tz, 'MM/dd/yyyy h:mm:ss a');
    const lastBookedAtValue = 'Rebooked existing patient on ' + rebookTimestamp + usernameSuffix;
    // Appointment date, time, and lastBookedAt are now set in the batch update below
    
    // PERFORMANCE: Batch update all patient information in one call
    // Update columns E through S (Last Name through Last Booked At) in a single operation
    dchrSheet.getRange(dchrRow, COL_LAST_NAME, 1, 15).setValues([[
      lastName,           // COL_LAST_NAME (3)
      firstName,          // COL_FIRST_NAME (4)
      gender,             // COL_GENDER (5)
      ssn,                // COL_SSN (6)
      address,            // COL_ADDRESS (7)
      city,               // COL_CITY (8)
      state,              // COL_STATE (9)
      zipCode,            // COL_ZIP (10)
      phone,              // COL_PHONE (11)
      email,              // COL_EMAIL (12)
      dob,                // COL_DOB (13)
      appointmentType,    // COL_APPT_TYPE (14)
      formattedAppointmentDate,  // COL_APPT_DATE (15)
      formattedAppointmentTime,  // COL_APPT_TIME (16)
      lastBookedAtValue   // COL_LAST_BOOKED_AT (17)
    ]]);
    
    // Update case number in column B (2)
    dchrSheet.getRange(dchrRow, COL_CASE_NUMBER).setValue(caseNumber);
    
  } else {
    // NEW PATIENT BOOKING
    patientId = generatePatientId();
    const bookedAt = new Date();
    const bookedAtFormatted = Utilities.formatDate(bookedAt, tz, 'MM/dd/yyyy h:mm:ss a') + usernameSuffix;
    
    let folderId;
    try {
      const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
      // Sanitize names for folder creation to prevent failures with special characters
      const safeFolderLastName = lastName.replace(/[\/\\:*?"<>|]/g, '_').substring(0, 50);
      const safeFolderFirstName = firstName.replace(/[\/\\:*?"<>|]/g, '_').substring(0, 50);
      const folderName = safeFolderLastName + ', ' + safeFolderFirstName + ' (' + patientId + ')';
      const patientFolder = parentFolder.createFolder(folderName);
      folderId = patientFolder.getId();
      folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
    } catch (driveError) {
      lock.releaseLock();
      // Log error without PHI (error message may contain folder name with patient name)
      Logger.log('Failed to create patient folder for booking. Error type: ' + driveError.name);
      return { success: false, message: 'Could not create patient folder. Please try again or contact support.' };
    }
    
    const formattedAppointmentDate = Utilities.formatDate(new Date(date), tz, 'MM/dd/yyyy');
    const formattedAppointmentTime = Utilities.formatDate(new Date(startTime), tz, 'h:mm a') + ' - ' + Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
    
    // Generate secure portal token for patient portal URL
    const portalToken = Utilities.getUuid();
    uploadLink = 'https://www.pfcassociates.org/dchrpatientportal.html?portal=' + portalToken;
    
    dchrRow = getNextDchrRow();
    
    // Store portal token in column A (1)
    dchrSheet.getRange(dchrRow, COL_PORTAL_TOKEN).setValue(portalToken);
    
    // Store case number in column B (2)
    dchrSheet.getRange(dchrRow, COL_CASE_NUMBER).setValue(caseNumber);
    
    dchrSheet.getRange(dchrRow, COL_PATIENT_ID, 1, 21).setValues([[
      patientId,
      bookedAtFormatted,
      lastName,
      firstName,
      gender,
      ssn,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      dob,
      appointmentType,
      formattedAppointmentDate,
      formattedAppointmentTime,
      '',
      '',
      uploadLink,
      '',
      ''
    ]]);
    
    // Store folder link in column AN (40)
    dchrSheet.getRange(dchrRow, COL_FOLDER_LINK).setValue(folderUrl);
  }
  
  const dchrSheetId = dchrSheet.getSheetId();
  
  // Sanitize names for formula to prevent formula injection
  // Remove characters that can trigger formula execution: = + - @ and tab
  const sanitizeForFormula = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/"/g, '""')           // Escape double quotes for formula string
      .replace(/^[=+\-@\t]+/, '')    // Remove leading formula triggers
      .replace(/[=+\-@\t]/g, ' ')    // Replace remaining formula triggers with space
      .substring(0, 100);
  };
  const safeLastName = sanitizeForFormula(lastName);
  const safeFirstName = sanitizeForFormula(firstName);
  const linkDisplayText = safeLastName + ', ' + safeFirstName + ' - ' + patientId;
  
  const hyperlinkFormula = '=HYPERLINK("#gid=' + dchrSheetId + '&range=C"&MATCH("' + patientId + '",DCHR_All_Categories!C:C,0),"' + linkDisplayText + '")';
  
  const bookingIndex = booked;
  const startCol = BOOKING_START_COL + (bookingIndex * FIELDS_PER_BOOKING);
  
  // PERFORMANCE: Update formula first, then batch update booked/remaining counts
  appointmentsSheet.getRange(slotRow, startCol).setFormula(hyperlinkFormula);
  
  const newBookedCount = booked + 1;
  // Batch update booked count (col 6) and remaining (col 7) in one call
  appointmentsSheet.getRange(slotRow, 6, 1, 2).setValues([[newBookedCount, capacity - newBookedCount]]);
  
  const calendar = CalendarApp.getDefaultCalendar();
  const startDateTime = combineDateTime(date, startTime);
  const endDateTime = combineDateTime(date, endTime);
  
  const staticDchrLink = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/edit#gid=' + dchrSheetId + '&range=C' + dchrRow;
  
  // Sanitize calendar event data to prevent injection
  const sanitizeForCalendar = (str) => {
    if (!str) return '';
    // Remove potential script/html tags, dangerous protocols, and limit length
    return str.toString()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 500); // Limit length
  };
  
  let eventTitle;
  const safeCalendarName = sanitizeForCalendar(fullName);
  if (isReschedule) {
    eventTitle = 'Rescheduled: ' + safeCalendarName;
  } else if (isExistingPatient) {
    eventTitle = 'Rebooked: ' + safeCalendarName;
  } else {
    eventTitle = 'Appointment: ' + safeCalendarName;
  }
  
  // HIPAA: Exclude SSN from calendar - use minimum necessary data
  // Full details available via Patient Details link
  const calendarDescription = [
    'Name: ' + sanitizeForCalendar(fullName),
    'Phone: ' + sanitizeForCalendar(phone),
    'Email: ' + sanitizeForCalendar(email),
    'Type: ' + sanitizeForCalendar(appointmentType),
    '',
    'Patient Folder: ' + folderUrl,
    'Full Patient Details: ' + staticDchrLink
  ].join('\n');
  
  // Create calendar event - don't fail booking if calendar fails
  let calendarEventCreated = true;
  try {
    calendar.createEvent(
      eventTitle,
      startDateTime,
      endDateTime,
      {
        description: calendarDescription
        // REMOVED: guests and sendInvites options (Feb 2026)
        // Previously had: guests: email, sendInvites: false
        // Issue: Google Workspace was ignoring sendInvites:false and still sending
        // calendar invitations to the patient's email. Additionally, the Workspace
        // "Automatically add video calls" setting was attaching a Google Meet link
        // to the invite. Patients were receiving unwanted meeting invitations.
        // The patient already receives a separate confirmation email from MailApp.
        // To re-enable: add these inside this options object:
        //   guests: email,
        //   sendInvites: false
      }
    );
  } catch (calendarError) {
    calendarEventCreated = false;
    // Log without exposing error details (may contain PHI from event description)
    Logger.log('Failed to create calendar event. Error type: ' + calendarError.name);
    // Continue with booking - calendar failure shouldn't roll back the appointment
  }
  
  const formattedDateRaw = Utilities.formatDate(new Date(date), tz, 'EEEE, MMMM d, yyyy');
  const formattedStartRaw = Utilities.formatDate(new Date(startTime), tz, 'h:mm a');
  const formattedEndRaw = Utilities.formatDate(new Date(endTime), tz, 'h:mm a');
  
  // Escape dates for HTML contexts (defense in depth)
  const formattedDate = escapeHtmlGlobal(formattedDateRaw);
  const formattedStart = escapeHtmlGlobal(formattedStartRaw);
  const formattedEnd = escapeHtmlGlobal(formattedEndRaw);
  
// Escape function for email HTML to prevent injection
  const escapeEmailHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  const safeFullName = escapeEmailHtml(fullName);
  
  // HTML-escape uploadLink for safe insertion into href attributes
  const safeUploadLink = uploadLink ? uploadLink.replace(/&/g, '&amp;') : '';
  
  let subject;
  let htmlBody;
  
  if (isReschedule) {
    subject = 'Appointment Rescheduled';
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${safeFullName},</p>
        
        <p>Your DYRS pre-employment physical exam with <strong>PFC Associates, LLC</strong> has been <strong>rescheduled</strong> to <strong>${formattedDate}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Location:</strong> PFC Associates - 920 Varnum Street NE, Washington DC 20017</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStart} (Eastern Time - US & Canada)</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p style="margin-bottom: 10px;"><strong><u>Instructions</u>:</strong></p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Bring a Photo ID to be checked in to the clinic</li>
            <li style="margin: 8px 0;">If you wear glasses or contacts, please bring them with you to your appointment for a vision screening. The dress code is business casual, you can wear jeans, no rips or tears in them.</li>
            <li style="margin: 8px 0;">If you have not uploaded a copy of your Hep A vaccine please bring a copy with you. If you don't have a copy of your Hep A vaccine, we will draw blood for a titer to check your immunity status.</li>
          </ol>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2e7d32;">Required: Complete Your Patient Portal</h3>
          <p>Before your appointment, please complete the following:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 5px 0;"><strong>Read Notice of Privacy Practice</strong> - Acknowledge you read our policy</li>
            <li style="margin: 5px 0;"><strong>Upload Proof of Vaccination</strong> - Submit your vaccination records</li>
            <li style="margin: 5px 0;"><strong>Complete Health Questionnaire</strong> - Answer a few questions about your health history</li>
          </ul>
          <p style="margin-top: 15px;"><a href="${safeUploadLink}" style="display: inline-block; background: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Patient Portal</a></p>
        </div>
        
        <p>Thank you!</p>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          This is an automated message. Please do not reply to this email.<br>
          For questions, please contact your Departmental Liaison.
        </p>
      </div>
    `;
  } else if (isExistingPatient) {
    subject = lastName + ', ' + firstName + ' - Appointment Confirmation - Action Required';
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${safeFullName},</p>
        
        <p>Your DYRS pre-employment physical exam with <strong>PFC Associates, LLC</strong> on <strong>${formattedDate}</strong> has been scheduled.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Location:</strong> PFC Associates - 920 Varnum Street NE, Washington DC 20017</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStart} (Eastern Time - US & Canada)</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p style="margin-bottom: 10px;"><strong><u>Instructions</u>:</strong></p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Bring a Photo ID to be checked in to the clinic</li>
            <li style="margin: 8px 0;">If you wear glasses or contacts, please bring them with you to your appointment for a vision screening. The dress code is business casual, you can wear jeans, no rips or tears in them.</li>
            <li style="margin: 8px 0;">If you have not uploaded a copy of your Hep A vaccine please bring a copy with you. If you don't have a copy of your Hep A vaccine, we will draw blood for a titer to check your immunity status.</li>
          </ol>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2e7d32;">Required: Complete Your Patient Portal</h3>
          <p>Before your appointment, please complete the following:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 5px 0;"><strong>Read Notice of Privacy Practice</strong> - Acknowledge you read our policy</li>
            <li style="margin: 5px 0;"><strong>Upload Proof of Vaccination</strong> - Submit your vaccination records</li>
            <li style="margin: 5px 0;"><strong>Complete Health Questionnaire</strong> - Answer a few questions about your health history</li>
          </ul>
          <p style="margin-top: 15px;"><a href="${safeUploadLink}" style="display: inline-block; background: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Patient Portal</a></p>
        </div>
        
        <p>Thank you!</p>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          This is an automated message. Please do not reply to this email.<br>
          For questions, please contact your Departmental Liaison.
        </p>
      </div>
    `;
  } else {
    subject = lastName + ', ' + firstName + ' - Appointment Confirmation - Action Required';
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${safeFullName},</p>
        
        <p>Your DYRS pre-employment physical exam with <strong>PFC Associates, LLC</strong> on <strong>${formattedDate}</strong> has been scheduled.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Location:</strong> PFC Associates - 920 Varnum Street NE, Washington DC 20017</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedStart} (Eastern Time - US & Canada)</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p style="margin-bottom: 10px;"><strong><u>Instructions</u>:</strong></p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 8px 0;">Bring a Photo ID to be checked in to the clinic</li>
            <li style="margin: 8px 0;">If you wear glasses or contacts, please bring them with you to your appointment for a vision screening. The dress code is business casual, you can wear jeans, no rips or tears in them.</li>
            <li style="margin: 8px 0;">If you have not uploaded a copy of your Hep A vaccine please bring a copy with you. If you don't have a copy of your Hep A vaccine, we will draw blood for a titer to check your immunity status.</li>
          </ol>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2e7d32;">Required: Complete Your Patient Portal</h3>
          <p>Before your appointment, please complete the following:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li style="margin: 5px 0;"><strong>Read Notice of Privacy Practice</strong> - Acknowledge you read our policy</li>
            <li style="margin: 5px 0;"><strong>Upload Proof of Vaccination</strong> - Submit your vaccination records</li>
            <li style="margin: 5px 0;"><strong>Complete Health Questionnaire</strong> - Answer a few questions about your health history</li>
          </ul>
          <p style="margin-top: 15px;"><a href="${safeUploadLink}" style="display: inline-block; background: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Patient Portal</a></p>
        </div>
        
        <p>Thank you!</p>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          This is an automated message. Please do not reply to this email.<br>
          For questions, please contact your Departmental Liaison.
        </p>
      </div>
    `;
  }
  
  // Get CC and BCC emails from Users tab (skip for internal test email)
  const emailRecipients = getEmailRecipientsFromUsers();
  
  const gmailOptions = {
    htmlBody: htmlBody,
    from: SEND_FROM_EMAIL,
    name: SEND_FROM_NAME
  };
  
  const skipCcBcc = email && email.toLowerCase() === 'fhoyos@pfcassociates.org';
  
  // Add CC if there are any emails configured
  if (!skipCcBcc && emailRecipients.cc.length > 0) {
    gmailOptions.cc = emailRecipients.cc.join(',');
  }
  
  // Add BCC if there are any emails configured
  if (!skipCcBcc && emailRecipients.bcc.length > 0) {
    gmailOptions.bcc = emailRecipients.bcc.join(',');
  }
  
  // Send confirmation email - don't fail booking if email fails
  let emailSent = true;
  try {
    GmailApp.sendEmail(email, subject, '', gmailOptions);
  } catch (emailError) {
    emailSent = false;
    // Log without exposing error details (may contain email address)
    Logger.log('Failed to send confirmation email. Error type: ' + emailError.name);
    // Continue with booking - email failure shouldn't roll back the appointment
  }
  
  let successMessage;
  let auditAction;
  let emailNote = '';
  if (!emailSent) {
    emailNote = ' (Note: Confirmation email could not be sent)';
  }
  if (!calendarEventCreated) {
    emailNote += emailNote ? ' Calendar event also failed.' : ' (Note: Calendar event could not be created)';
  }
  
  // Escape patient name for safe HTML display in success message
  const safeFullNameForMessage = escapeHtmlGlobal(fullName);
  // Dates already escaped above via escapeHtmlGlobal for HTML safety
  
  if (isReschedule) {
    successMessage = 'Appointment for ' + safeFullNameForMessage + ' has been rescheduled to ' + formattedDate + ' at ' + formattedStart + '.' + emailNote;
    auditAction = 'RESCHEDULE';
  } else if (isExistingPatient) {
    successMessage = 'Appointment for ' + safeFullNameForMessage + ' (existing patient) has been booked for ' + formattedDate + ' at ' + formattedStart + '.' + emailNote;
    auditAction = 'REBOOK_EXISTING';
  } else {
    successMessage = 'Appointment for ' + safeFullNameForMessage + ' has been booked for ' + formattedDate + ' at ' + formattedStart + '.' + emailNote;
    auditAction = 'CREATE_BOOKING';
  }
  
  // Log for HIPAA compliance
  logAuditEvent(auditAction, verifiedUsername, patientId, 'Appointment: ' + formattedDate + ' ' + formattedStart);
  
  // PERFORMANCE: Invalidate slots cache so other users see updated availability
  invalidateSlotsCache();
  
  // Release the lock
  lock.releaseLock();
  
  return { 
    success: true, 
    message: successMessage,
    isReschedule: isReschedule,
    isExistingPatient: isExistingPatient
  };
  
  } catch (error) {
    // Ensure lock is released on error
    try { lock.releaseLock(); } catch (e) {}
    // Log error type only - message may contain PHI
    Logger.log('bookAppointment error type: ' + (error ? error.name : 'unknown'));
    return { success: false, message: 'An error occurred while booking. Please try again.' };
  }
}

function uploadFile(folderIdOrToken, fileName, base64Data, mimeType) {
  try {
    // Determine if this is a portal token (UUID format) or legacy folderId
    let folderId = folderIdOrToken;
    const isPortalToken = /^[a-f0-9-]{36}$/i.test(folderIdOrToken);
    
    if (isPortalToken) {
      const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
      if (!patientInfo || !patientInfo.folderId) {
        return { success: false, message: 'Invalid or expired portal link.' };
      }
      folderId = patientInfo.folderId;
    }
    
    // Rate limit check - prevent upload abuse (max 20 uploads per hour per folder)
    const cache = CacheService.getScriptCache();
    // Sanitize folderId for cache key (already validated above, but defense in depth)
    const sanitizedFolderIdForCache = folderId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
    const rateLimitKey = 'upload_rate_' + sanitizedFolderIdForCache;
    const currentCount = parseInt(cache.get(rateLimitKey) || '0');
    if (currentCount >= 20) {
      Logger.log('Upload rate limit exceeded for folder');
      return { success: false, message: 'Too many uploads. Please wait before uploading more files.' };
    }
    
    // Validate folder ID belongs to a patient in our system
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
    const lastRow = dchrSheet.getLastRow();
    
    if (lastRow >= DCHR_START_ROW) {
      const folderLinks = dchrSheet.getRange(DCHR_START_ROW, COL_FOLDER_LINK, lastRow - DCHR_START_ROW + 1, 1).getValues();
      const expectedUrl = 'https://drive.google.com/drive/folders/' + folderId;
      let isValidFolder = false;
      
      for (let i = 0; i < folderLinks.length; i++) {
        if (folderLinks[i][0] === expectedUrl) {
          isValidFolder = true;
          break;
        }
      }
      
      if (!isValidFolder) {
        Logger.log('Upload attempt to unauthorized folder rejected');
        return { success: false, message: 'Invalid upload destination.' };
      }
    } else {
      return { success: false, message: 'System error: No patient records found.' };
    }
    
    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedMimeTypes.includes(mimeType)) {
      return { success: false, message: 'File type not allowed. Please upload an image, PDF, or Word document.' };
    }
    
    // Validate fileName
    if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
      return { success: false, message: 'Invalid file name.' };
    }
    
    // Validate file size (10MB max)
    // Check base64 string length first to avoid decoding huge payloads
    // Base64 is ~4/3 the size of binary, so 10MB binary ≈ 13.3MB base64
    const maxSizeBytes = 10 * 1024 * 1024;
    const maxBase64Length = Math.ceil(maxSizeBytes * 4 / 3) + 100; // Small buffer for padding
    
    if (!base64Data || base64Data.length > maxBase64Length) {
      return { success: false, message: 'File too large. Maximum size is 10MB.' };
    }
    
    // Validate base64 format before decoding
    if (typeof base64Data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
      return { success: false, message: 'Invalid file data format.' };
    }
    
    let decodedData;
    try {
      decodedData = Utilities.base64Decode(base64Data);
    } catch (decodeError) {
      return { success: false, message: 'Invalid file data. Please try selecting the file again.' };
    }
    if (decodedData.length > maxSizeBytes) {
      return { success: false, message: 'File too large. Maximum size is 10MB.' };
    }
    
    // Validate file magic bytes match claimed MIME type (defense in depth)
    const magicBytesValid = validateFileMagicBytes(decodedData, mimeType);
    if (!magicBytesValid) {
      Logger.log('File magic bytes do not match claimed MIME type');
      return { success: false, message: 'File content does not match file type. Please ensure you are uploading the correct file.' };
    }
    
    const folder = DriveApp.getFolderById(folderId);
    // Sanitize filename to prevent path traversal and special characters
    const sanitizedFileName = fileName
      .replace(/[\/\\:*?"<>|]/g, '_')  // Remove path/special chars
      .replace(/\.\./g, '_')            // Prevent directory traversal
      .replace(/^\.+/, '')              // Remove leading dots
      .substring(0, 200);               // Limit length
    const prefixedFileName = 'Vaccination_Proof_' + (sanitizedFileName || 'upload');
    const blob = Utilities.newBlob(decodedData, mimeType, prefixedFileName);
    const file = folder.createFile(blob);
    const fileUrl = file.getUrl();
    
    const uploadTime = new Date();
    const tz = Session.getScriptTimeZone();
    const formattedUploadTime = Utilities.formatDate(uploadTime, tz, 'MMM d, yyyy h:mm a');
    
    const patientId = updateLastFileLink(folderId, fileUrl, uploadTime);
    
    // Audit log for HIPAA compliance
    logAuditEvent('FILE_UPLOAD', 'Patient Portal', patientId || 'Unknown', 'Vaccination file uploaded: ' + prefixedFileName);
    
    // Increment rate limit counter (expires in 1 hour) - rateLimitKey declared at function start
    cache.put(rateLimitKey, (currentCount + 1).toString(), 3600);
    
    // Simple abuse detection: warn if folder has excessive files (potential abuse)
    try {
      const fileCount = folder.getFiles();
      let count = 0;
      while (fileCount.hasNext() && count < 51) {
        fileCount.next();
        count++;
      }
      if (count >= 50) {
        Logger.log('High file count detected in patient folder - potential abuse');
        logAuditEvent('FILE_UPLOAD_WARNING', 'Patient Portal', patientId || 'Unknown', 'Folder has 50+ files - potential abuse');
      }
    } catch (countError) {
      // Non-critical - don't fail upload for count check failure
    }
    
    return { success: true, uploadTime: formattedUploadTime, fileName: prefixedFileName };
  } catch (error) {
    // Log error without exposing file names (could contain PHI)
    Logger.log('uploadFile error occurred');
    return { success: false, message: 'Failed to upload file. Please try again.' };
  }
}

function markNoProofVaccination(portalTokenOrFolderId) {
  try {
    let folderId = portalTokenOrFolderId;
    let patientId = null;
    
    // Check if this is a portal token (UUID format) and look up folderId
    if (/^[a-f0-9-]{36}$/i.test(portalTokenOrFolderId)) {
      const patientInfo = lookupPatientByPortalToken(portalTokenOrFolderId);
      if (patientInfo && patientInfo.folderId) {
        folderId = patientInfo.folderId;
        patientId = patientInfo.patientId;
      } else {
        return { success: false, message: 'Invalid portal link.' };
      }
    }
    
    // Validate folderId format
    if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
      return { success: false, message: 'Invalid request.' };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
    const lastRow = dchrSheet.getLastRow();
    
    if (lastRow < DCHR_START_ROW) {
      return { success: false, message: 'Patient record not found.' };
    }
    
    const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
    const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
        const actualRow = DCHR_START_ROW + i;
        patientId = patientId || data[i][COL_PATIENT_ID - 1] || 'Unknown';
        
        // Only set NO_PROOF if there isn't already a real file uploaded
        const existingFileLink = data[i][COL_LAST_FILE_LINK - 1];
        if (existingFileLink && existingFileLink !== 'NO_PROOF') {
          return { success: false, message: 'A vaccination file has already been uploaded.' };
        }
        
        const now = new Date();
        const tz = Session.getScriptTimeZone();
        dchrSheet.getRange(actualRow, COL_LAST_FILE_LINK).setValue('NO_PROOF');
        dchrSheet.getRange(actualRow, COL_LAST_UPLOAD_AT).setValue(now);
        
        logAuditEvent('NO_PROOF_VACCINATION', 'Patient Portal', patientId, 'Patient indicated no proof of vaccination');
        
        const formattedTime = Utilities.formatDate(now, tz, 'MMM d, yyyy h:mm a');
        return { success: true, timestamp: formattedTime };
      }
    }
    
    return { success: false, message: 'Patient record not found.' };
  } catch (error) {
    Logger.log('markNoProofVaccination error occurred');
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

function updateLastFileLink(folderId, fileUrl, uploadTime) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  
  if (lastRow < DCHR_START_ROW) {
    return null;
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  
  const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
      const actualRow = DCHR_START_ROW + i;
      dchrSheet.getRange(actualRow, COL_LAST_FILE_LINK).setValue(fileUrl);
      dchrSheet.getRange(actualRow, COL_LAST_UPLOAD_AT).setValue(uploadTime);
      return data[i][COL_PATIENT_ID - 1] || null; // Return patient ID for audit logging
    }
  }
  return null;
}

function savePatientNote(patientId, note, token) {
  // Verify session and get authenticated username
  const sessionCheck = verifySessionForAudit(token, true);
  if (!sessionCheck.valid) {
    return { success: false, message: sessionCheck.error };
  }
  const username = sessionCheck.username;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const tz = Session.getScriptTimeZone();
  
  // Server-side validation of note length
  const MAX_NOTE_LENGTH = 500;
  if (note && note.length > MAX_NOTE_LENGTH) {
    return { success: false, message: 'Note exceeds maximum length of ' + MAX_NOTE_LENGTH + ' characters.' };
  }
  
  const dchrRow = findDchrRowByPatientId(patientId);
  
  if (dchrRow === -1) {
    return { success: false, message: 'Patient not found.' };
  }
  
  // Check if there was a previous note
  const previousNote = dchrSheet.getRange(dchrRow, COL_NOTE).getValue();
  const action = previousNote ? 'Edited' : 'Saved';
  
  // Save the timestamp with username and action
  const timestamp = Utilities.formatDate(new Date(), tz, 'MM/dd/yyyy h:mm a');
  const usernameSuffix = ' by ' + (username ? username : 'Unlogged User');
  const timestampValue = action + ' on ' + timestamp + usernameSuffix;
  
  // PERFORMANCE: Batch update note and timestamp in one call
  dchrSheet.getRange(dchrRow, COL_NOTE, 1, 2).setValues([[note, timestampValue]]);
  
  // Audit log for HIPAA compliance
  logAuditEvent('UPDATE_NOTE', username, patientId, action + ' patient note');
  
  return { success: true, noteTimestamp: timestampValue };
}

function getQuestionnaireStatus(folderIdOrToken) {
  // Note: Called from Patient Portal - minimal logging to avoid excess audit entries
  // Full access logging happens when questionnaire is submitted
  
  // Check if this is a portal token (UUID format) and look up folderId
  let folderId = folderIdOrToken;
  if (/^[a-f0-9-]{36}$/i.test(folderIdOrToken)) {
    const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
    if (patientInfo && patientInfo.folderId) {
      folderId = patientInfo.folderId;
    } else {
      return { completed: false, timestamp: null };
    }
  }
  
  // Validate folderId format
  if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
    return { completed: false, timestamp: null };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  const tz = Session.getScriptTimeZone();
  
  if (lastRow < DCHR_START_ROW) {
    return { completed: false, timestamp: null };
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
      const questionnaireLink = data[i][COL_LAST_QUESTIONNAIRE_LINK - 1];
      const questionnaireAt = data[i][COL_LAST_QUESTIONNAIRE_AT - 1];
      
      if (questionnaireLink && questionnaireAt) {
        return {
          completed: true,
          timestamp: Utilities.formatDate(new Date(questionnaireAt), tz, 'MMM d, yyyy h:mm a')
        };
      }
      return { completed: false, timestamp: null };
    }
  }
  
  return { completed: false, timestamp: null };
}

function getPrivacyNoticeStatus(folderIdOrToken) {
  // Check if this is a portal token (UUID format) and look up folderId
  let folderId = folderIdOrToken;
  if (/^[a-f0-9-]{36}$/i.test(folderIdOrToken)) {
    const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
    if (patientInfo && patientInfo.folderId) {
      folderId = patientInfo.folderId;
    } else {
      return { completed: false, timestamp: null };
    }
  }
  
  // Validate folderId format
  if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
    return { completed: false, timestamp: null };
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  const tz = Session.getScriptTimeZone();
  
  if (lastRow < DCHR_START_ROW) {
    return { completed: false, timestamp: null };
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
      const privacySignedAt = data[i][COL_PRIVACY_SIGNED_AT - 1];
      const privacySignature = data[i][COL_PRIVACY_SIGNATURE - 1];
      
      if (privacySignedAt && privacySignature) {
        return {
          completed: true,
          timestamp: Utilities.formatDate(new Date(privacySignedAt), tz, 'MMM d, yyyy h:mm a')
        };
      }
      return { completed: false, timestamp: null };
    }
  }
  
  return { completed: false, timestamp: null };
}

function getPatientAppointmentInfo(folderIdOrToken) {
  // Check if this is a portal token (UUID format) and look up folderId
  let folderId = folderIdOrToken;
  if (/^[a-f0-9-]{36}$/i.test(folderIdOrToken)) {
    const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
    if (patientInfo && patientInfo.folderId) {
      folderId = patientInfo.folderId;
    } else {
      return null;
    }
  }
  
  // Validate folderId format
  if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
    return null;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
  const lastRow = dchrSheet.getLastRow();
  const tz = Session.getScriptTimeZone();
  
  if (lastRow < DCHR_START_ROW) {
    return null;
  }
  
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
      const apptDate = data[i][COL_APPT_DATE - 1];
      const apptTime = data[i][COL_APPT_TIME - 1];
      
      if (apptDate && apptTime) {
        // Format date - handle both Date objects and strings
        let formattedDate;
        if (apptDate instanceof Date) {
          formattedDate = Utilities.formatDate(apptDate, tz, 'EEE, MMM d, yyyy');
        } else {
          // Try to parse string date
          const parsedDate = new Date(apptDate);
          if (!isNaN(parsedDate.getTime())) {
            formattedDate = Utilities.formatDate(parsedDate, tz, 'EEE, MMM d, yyyy');
          } else {
            formattedDate = apptDate.toString();
          }
        }
        
        // Format time - handle time ranges like "10:30 AM - 11:00 AM" or Date objects
        let formattedTime;
        if (apptTime instanceof Date) {
          formattedTime = Utilities.formatDate(apptTime, tz, 'h:mm a');
        } else {
          // It's a string (likely a time range) - extract just the start time
          const timeStr = apptTime.toString();
          const dashIndex = timeStr.indexOf(' - ');
          if (dashIndex > -1) {
            formattedTime = timeStr.substring(0, dashIndex).trim();
          } else {
            formattedTime = timeStr.trim();
          }
        }
        
        return {
          date: formattedDate,
          time: formattedTime
        };
      }
      return null;
    }
  }
  
  return null;
}

function getOrCreateQuestionnaireResponsesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Questionnaire_Responses');
  
  if (!sheet) {
    // Create the sheet
    sheet = ss.insertSheet('Questionnaire_Responses');
    
    // Define headers
    const headers = [
      'Timestamp',
      'Patient ID',
      'First Name',
      'Last Name',
      'Patient DOB',
      // HEAD
      'Head Injury',
      'Loss of Consciousness',
      'Seizure',
      'Dizziness',
      'Fainting',
      'Headaches',
      'Migraines',
      // EARS
      'Ear Injury',
      'Ringing in Ears',
      'Decreased Hearing',
      'Hearing Loss',
      'Ruptured Eardrum',
      // EYES
      'Eye Injury',
      'Double Vision',
      'Blurred Vision',
      'Glasses',
      'Contacts',
      'Far Sighted',
      'Near Sighted',
      'One Eye Only',
      'Color Blind',
      // THROAT/NECK
      'Throat Injury',
      'Chronic Sore Throats',
      'Neck Injury',
      'Neck Masses',
      // CARDIOVASCULAR
      'Chest Pain/Tightness',
      'Heart Attack',
      'Palpitations',
      'Irregular Heart Beat',
      'High Blood Pressure',
      'Stroke',
      'Heart Murmur',
      // MEDICAL CONDITIONS
      'Diabetes',
      'Thyroid Disorder',
      'Cancer',
      'Bleeding Disorder',
      'Anemia',
      // PULMONARY/NOSE/SINUS
      'Asthma',
      'Shortness of Breath',
      'Lung Disease',
      'Nose Injury',
      'Nose Bleeds',
      'Sinus/Allergies',
      // ABDOMINAL
      'Abdominal Pain',
      'Cramps',
      'Diarrhea',
      'Nausea/Vomiting',
      'Bowel Problems',
      'Hepatitis',
      'Hernia',
      // MUSCULOSKELETAL
      'Joint Pain',
      'Weakness',
      'Arthritis',
      'Back Pain',
      'Back Surgery',
      'Herniated Disc',
      // FRACTURES
      'Fracture Shoulder',
      'Fracture Elbow',
      'Fracture Wrist',
      'Fracture Hand',
      'Fracture Fingers',
      'Fracture Hip',
      'Fracture Knee',
      'Fracture Ankle',
      'Fracture Foot',
      'Fracture Other',
      // NEUROLOGICAL
      'Tremors',
      'Numbness/Tingling',
      'Confusion',
      'Dizziness (Neuro)',
      'Convulsions',
      // KIDNEY/BLADDER
      'Kidney Injury',
      'Bladder Disorders',
      'Kidney Disorders',
      'Dark Urine',
      // MENTAL HEALTH
      'Memory Loss',
      'Depression',
      'Phobias',
      'Suicidal Thoughts',
      'Homicidal Thoughts',
      'Anxiety',
      'PTSD',
      'Decreased Alertness',
      'Unexplained Sleepiness',
      // SKIN
      'Rash',
      'Jaundice',
      // TEXT FIELDS
      'Yes Answers Explanation',
      'Hospitalizations/Operations/Injuries',
      // IMMUNIZATION
      'Hepatitis Vaccine',
      'TB Test Date',
      'Tetanus Shot Date',
      'History of Positive TB',
      'TB Treatment Dates',
      // CHILDHOOD DISEASES
      'Chicken Pox',
      'Mumps',
      'Measles',
      // SOCIAL HISTORY
      'Ever Smoked',
      'Packs Per Day',
      'Years Smoked',
      'Drinks Alcohol',
      'Alcohol Amount',
      // MEDICATIONS & ALLERGIES
      'Current Medications',
      'Drug Allergies',
      // SIGNATURE
      'Electronic Signature',
      'Submitted At'
    ];
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a5f7a');
    headerRange.setFontColor('#ffffff');
    headerRange.setWrap(true);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns (with a reasonable max width)
    for (let i = 1; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 120);
    }
    // Make text columns wider
    sheet.setColumnWidth(headers.indexOf('Yes Answers Explanation') + 1, 250);
    sheet.setColumnWidth(headers.indexOf('Hospitalizations/Operations/Injuries') + 1, 250);
    sheet.setColumnWidth(headers.indexOf('Current Medications') + 1, 200);
    sheet.setColumnWidth(headers.indexOf('Drug Allergies') + 1, 200);
  }
  
  return sheet;
}

function recordQuestionnaireResponse(patientId, questionnaireData, timestamp) {
  try {
    const sheet = getOrCreateQuestionnaireResponsesSheet();
    const tz = Session.getScriptTimeZone();
    
    // Build row data matching header order
    const rowData = [
      Utilities.formatDate(timestamp, tz, 'yyyy-MM-dd HH:mm:ss'),
      patientId || '',
      questionnaireData.firstName || '',
      questionnaireData.lastName || '',
      questionnaireData.patientDob || '',
      // HEAD
      questionnaireData.head_injury || '',
      questionnaireData.head_loc || '',
      questionnaireData.head_seizure || '',
      questionnaireData.head_dizziness || '',
      questionnaireData.head_fainting || '',
      questionnaireData.head_headaches || '',
      questionnaireData.head_migraines || '',
      // EARS
      questionnaireData.ears_injury || '',
      questionnaireData.ears_ringing || '',
      questionnaireData.ears_decreased || '',
      questionnaireData.ears_loss || '',
      questionnaireData.ears_ruptured || '',
      // EYES
      questionnaireData.eyes_injury || '',
      questionnaireData.eyes_double || '',
      questionnaireData.eyes_blurred || '',
      questionnaireData.eyes_glasses || '',
      questionnaireData.eyes_contacts || '',
      questionnaireData.eyes_far || '',
      questionnaireData.eyes_near || '',
      questionnaireData.eyes_oneeye || '',
      questionnaireData.eyes_color || '',
      // THROAT/NECK
      questionnaireData.throat_injury || '',
      questionnaireData.throat_sore || '',
      questionnaireData.neck_injury || '',
      questionnaireData.neck_masses || '',
      // CARDIOVASCULAR
      questionnaireData.cardio_chest || '',
      questionnaireData.cardio_attack || '',
      questionnaireData.cardio_palpitations || '',
      questionnaireData.cardio_irregular || '',
      questionnaireData.cardio_bp || '',
      questionnaireData.cardio_stroke || '',
      questionnaireData.cardio_murmur || '',
      // MEDICAL CONDITIONS
      questionnaireData.med_diabetes || '',
      questionnaireData.med_thyroid || '',
      questionnaireData.med_cancer || '',
      questionnaireData.med_bleeding || '',
      questionnaireData.med_anemia || '',
      // PULMONARY/NOSE/SINUS
      questionnaireData.pulm_asthma || '',
      questionnaireData.pulm_breath || '',
      questionnaireData.pulm_lung || '',
      questionnaireData.nose_injury || '',
      questionnaireData.nose_bleeds || '',
      questionnaireData.sinus_allergies || '',
      // ABDOMINAL
      questionnaireData.abd_pain || '',
      questionnaireData.abd_cramps || '',
      questionnaireData.abd_diarrhea || '',
      questionnaireData.abd_nausea || '',
      questionnaireData.abd_bowel || '',
      questionnaireData.abd_hepatitis || '',
      questionnaireData.abd_hernia || '',
      // MUSCULOSKELETAL
      questionnaireData.musc_joint || '',
      questionnaireData.musc_weakness || '',
      questionnaireData.musc_arthritis || '',
      questionnaireData.musc_back || '',
      questionnaireData.musc_backsurg || '',
      questionnaireData.musc_herniated || '',
      // FRACTURES
      questionnaireData.frac_shoulder || '',
      questionnaireData.frac_elbow || '',
      questionnaireData.frac_wrist || '',
      questionnaireData.frac_hand || '',
      questionnaireData.frac_fingers || '',
      questionnaireData.frac_hip || '',
      questionnaireData.frac_knee || '',
      questionnaireData.frac_ankle || '',
      questionnaireData.frac_foot || '',
      questionnaireData.frac_other || '',
      // NEUROLOGICAL
      questionnaireData.neuro_tremors || '',
      questionnaireData.neuro_numbness || '',
      questionnaireData.neuro_confusion || '',
      questionnaireData.neuro_dizziness || '',
      questionnaireData.neuro_convulsions || '',
      // KIDNEY/BLADDER
      questionnaireData.kidney_injury || '',
      questionnaireData.kidney_bladder || '',
      questionnaireData.kidney_disorders || '',
      questionnaireData.kidney_urine || '',
      // MENTAL HEALTH
      questionnaireData.mental_memory || '',
      questionnaireData.mental_depression || '',
      questionnaireData.mental_phobias || '',
      questionnaireData.mental_suicidal || '',
      questionnaireData.mental_homicidal || '',
      questionnaireData.mental_anxiety || '',
      questionnaireData.mental_ptsd || '',
      questionnaireData.mental_alertness || '',
      questionnaireData.mental_sleepiness || '',
      // SKIN
      questionnaireData.skin_rash || '',
      questionnaireData.skin_jaundice || '',
      // TEXT FIELDS
      questionnaireData.yesExplanation || '',
      questionnaireData.hospitalizations || '',
      // IMMUNIZATION
      questionnaireData.vaccine_hep || '',
      questionnaireData.tb_test_date || '',
      questionnaireData.tetanus_date || '',
      questionnaireData.tb_positive || '',
      questionnaireData.tb_treatment || '',
      // CHILDHOOD DISEASES
      questionnaireData.child_chickenpox || '',
      questionnaireData.child_mumps || '',
      questionnaireData.child_measles || '',
      // SOCIAL HISTORY
      questionnaireData.smoke || '',
      questionnaireData.smoke_packs || '',
      questionnaireData.smoke_years || '',
      questionnaireData.alcohol || '',
      questionnaireData.alcohol_amount || '',
      // MEDICATIONS & ALLERGIES
      questionnaireData.medications || '',
      questionnaireData.drugAllergies || '',
      // SIGNATURE
      questionnaireData.signature || '',
      questionnaireData.submittedAt || ''
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    return true;
  } catch (error) {
    Logger.log('Error recording questionnaire response: ' + error);
    return false;
  }
}

function saveQuestionnaire(folderIdOrToken, questionnaireData) {
  try {
    // Determine if this is a portal token (UUID format) or legacy folderId
    let folderId = folderIdOrToken;
    const isPortalToken = /^[a-f0-9-]{36}$/i.test(folderIdOrToken);
    
    if (isPortalToken) {
      const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
      if (!patientInfo || !patientInfo.folderId) {
        return { success: false, message: 'Invalid or expired portal link.' };
      }
      folderId = patientInfo.folderId;
    }
    
    // Validate folderId format
    if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
      return { success: false, message: 'Invalid folder reference.' };
    }
    
    // Rate limit check - prevent submission abuse (max 5 attempts per hour per folder)
    const cache = CacheService.getScriptCache();
    // Sanitize folderId for cache key (already validated above, but defense in depth)
    const sanitizedFolderIdForCache = folderId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
    const rateLimitKey = 'quest_rate_' + sanitizedFolderIdForCache;
    const currentCount = parseInt(cache.get(rateLimitKey) || '0');
    if (currentCount >= 100) {
      Logger.log('Questionnaire rate limit exceeded');
      return { success: false, message: 'Too many submission attempts. Please wait before trying again.' };
    }
    // Increment counter (expires in 1 hour)
    cache.put(rateLimitKey, (currentCount + 1).toString(), 3600);
    
    // Validate questionnaireData structure
    if (!questionnaireData || typeof questionnaireData !== 'object') {
      return { success: false, message: 'Invalid questionnaire data.' };
    }
    
    // Validate required fields - only first name and last name are required
    if (!questionnaireData.firstName || questionnaireData.firstName.trim() === '') {
      return { success: false, message: 'Please provide your first name.' };
    }
    if (!questionnaireData.lastName || questionnaireData.lastName.trim() === '') {
      return { success: false, message: 'Please provide your last name.' };
    }
    
    // Validate Yes/No fields format (if provided, must be Yes or No) - but not required
    const yesNoFields = [
      'head_injury', 'head_loc', 'head_seizure', 'head_dizziness', 'head_fainting', 'head_headaches', 'head_migraines',
      'ears_injury', 'ears_ringing', 'ears_decreased', 'ears_loss', 'ears_ruptured',
      'eyes_injury', 'eyes_double', 'eyes_blurred', 'eyes_glasses', 'eyes_contacts', 'eyes_far', 'eyes_near', 'eyes_oneeye', 'eyes_color',
      'throat_injury', 'throat_sore', 'neck_injury', 'neck_masses',
      'cardio_chest', 'cardio_attack', 'cardio_palpitations', 'cardio_irregular', 'cardio_bp', 'cardio_stroke', 'cardio_murmur',
      'med_diabetes', 'med_thyroid', 'med_cancer', 'med_bleeding', 'med_anemia',
      'pulm_asthma', 'pulm_breath', 'pulm_lung', 'nose_injury', 'nose_bleeds', 'sinus_allergies',
      'abd_pain', 'abd_cramps', 'abd_diarrhea', 'abd_nausea', 'abd_bowel', 'abd_hepatitis', 'abd_hernia',
      'musc_joint', 'musc_weakness', 'musc_arthritis', 'musc_back', 'musc_backsurg', 'musc_herniated',
      'kidney_injury', 'kidney_bladder', 'kidney_disorders', 'kidney_urine',
      'frac_shoulder', 'frac_elbow', 'frac_wrist', 'frac_hand', 'frac_fingers', 'frac_hip', 'frac_knee', 'frac_ankle', 'frac_foot', 'frac_other',
      'mental_memory', 'mental_depression', 'mental_phobias', 'mental_suicidal', 'mental_homicidal', 'mental_anxiety', 'mental_ptsd', 'mental_alertness', 'mental_sleepiness',
      'neuro_tremors', 'neuro_numbness', 'neuro_confusion', 'neuro_dizziness', 'neuro_convulsions',
      'skin_rash', 'skin_jaundice',
      'vaccine_hep', 'tb_positive',
      'child_chickenpox', 'child_mumps', 'child_measles',
      'smoke', 'alcohol'
    ];
    
    for (const field of yesNoFields) {
      if (questionnaireData[field] && questionnaireData[field] !== 'Yes' && questionnaireData[field] !== 'No') {
        return { success: false, message: 'Invalid value for ' + field + '. Must be Yes or No.' };
      }
    }
    
    // Limit text field lengths to prevent abuse
    const textFields = ['yesExplanation', 'hospitalizations', 'medications', 'drugAllergies', 'tb_treatment', 'tb_test_date', 'tetanus_date', 'smoke_packs', 'smoke_years', 'alcohol_amount', 'signature'];
    for (const field of textFields) {
      if (questionnaireData[field] && questionnaireData[field].length > 2000) {
        return { success: false, message: field + ' is too long (max 2000 characters).' };
      }
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
    const tz = Session.getScriptTimeZone();
    const lastRow = dchrSheet.getLastRow();
    
    // Validate folder ID belongs to a patient in our system (same as uploadFile)
    if (lastRow >= DCHR_START_ROW) {
      const folderLinks = dchrSheet.getRange(DCHR_START_ROW, COL_FOLDER_LINK, lastRow - DCHR_START_ROW + 1, 1).getValues();
      const expectedUrl = 'https://drive.google.com/drive/folders/' + folderId;
      let isValidFolder = false;
      
      for (let i = 0; i < folderLinks.length; i++) {
        if (folderLinks[i][0] === expectedUrl) {
          isValidFolder = true;
          break;
        }
      }
      
      if (!isValidFolder) {
        Logger.log('Questionnaire submission attempt to unauthorized folder');
        return { success: false, message: 'Invalid submission destination.' };
      }
    } else {
      return { success: false, message: 'System error: No patient records found.' };
    }
    
    // Check if already completed to prevent duplicates
    const existingStatus = getQuestionnaireStatus(folderId);
    if (existingStatus && existingStatus.completed) {
      return { success: false, message: 'Questionnaire has already been submitted.' };
    }
    
    // First find the patient record to get name and case number for filename
  const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
  const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
      // Get patient name and case number for filename
      const patientFirstName = data[i][COL_FIRST_NAME - 1] || '';
      const patientLastName = data[i][COL_LAST_NAME - 1] || '';
      const patientCaseNumber = data[i][COL_CASE_NUMBER - 1] || '';
      const safeQuestLastName = patientLastName.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      const safeQuestFirstName = patientFirstName.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      const safeQuestCaseNumber = patientCaseNumber.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      const questDateForFile = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
      
      // Generate questionnaire PDF
      const questionnaireHtml = generateQuestionnaireHtml(questionnaireData);
      const blob = Utilities.newBlob(questionnaireHtml, 'text/html', 'questionnaire.html');
      const pdfBlob = blob.getAs('application/pdf');
      pdfBlob.setName('Questionnaire_' + safeQuestLastName + '_' + safeQuestFirstName + '_' + safeQuestCaseNumber + '_' + questDateForFile + '.pdf');
      
      // Save to patient's folder
      const folder = DriveApp.getFolderById(folderId);
      const pdfFile = folder.createFile(pdfBlob);
      const pdfUrl = pdfFile.getUrl();
      const actualRow = DCHR_START_ROW + i;
      const timestamp = new Date();
      dchrSheet.getRange(actualRow, COL_LAST_QUESTIONNAIRE_LINK).setValue(pdfUrl);
      dchrSheet.getRange(actualRow, COL_LAST_QUESTIONNAIRE_AT).setValue(timestamp);
      
      // Audit log for HIPAA compliance
      const patientId = data[i][COL_PATIENT_ID - 1];
      logAuditEvent('QUESTIONNAIRE_SUBMIT', 'Patient Portal', patientId || 'Unknown', 'Health questionnaire submitted');
      
      // Record response to Questionnaire Responses sheet
      // Add patient info to questionnaireData for recording
      questionnaireData.patientDob = data[i][COL_DOB - 1] ? Utilities.formatDate(new Date(data[i][COL_DOB - 1]), tz, 'MM/dd/yyyy') : '';
      recordQuestionnaireResponse(patientId, questionnaireData, timestamp);
      
      return { 
        success: true, 
        timestamp: Utilities.formatDate(timestamp, tz, 'MMM d, yyyy h:mm a')
      };
    }
  }
  
  return { success: false, message: 'Patient record not found.' };
  } catch (error) {
    // Log error without exposing details (could contain PHI)
    Logger.log('saveQuestionnaire error occurred');
    return { success: false, message: 'Failed to save questionnaire. Please try again.' };
  }
}

function savePrivacyNotice(folderIdOrToken, signatureData) {
  try {
    // Determine if this is a portal token (UUID format) or legacy folderId
    let folderId = folderIdOrToken;
    const isPortalToken = /^[a-f0-9-]{36}$/i.test(folderIdOrToken);
    
    if (isPortalToken) {
      const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
      if (!patientInfo || !patientInfo.folderId) {
        return { success: false, message: 'Invalid or expired portal link.' };
      }
      folderId = patientInfo.folderId;
    }
    
    // Validate folderId format
    if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
      return { success: false, message: 'Invalid folder reference.' };
    }
    
    // Rate limit check - prevent submission abuse (max 5 attempts per hour per folder)
    const cache = CacheService.getScriptCache();
    const sanitizedFolderIdForCache = folderId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
    const rateLimitKey = 'privacy_rate_' + sanitizedFolderIdForCache;
    const currentCount = parseInt(cache.get(rateLimitKey) || '0');
    if (currentCount >= 5) {
      Logger.log('Privacy notice rate limit exceeded');
      return { success: false, message: 'Too many submission attempts. Please wait before trying again.' };
    }
    cache.put(rateLimitKey, (currentCount + 1).toString(), 3600);
    
    // Validate signatureData
    if (!signatureData || typeof signatureData !== 'object') {
      return { success: false, message: 'Invalid signature data.' };
    }
    
    // Validate signature is provided
    if (!signatureData.signature || signatureData.signature.trim() === '') {
      return { success: false, message: 'Please provide your signature.' };
    }
    
    // Limit signature length
    if (signatureData.signature.length > 200) {
      return { success: false, message: 'Signature is too long (max 200 characters).' };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
    const tz = Session.getScriptTimeZone();
    const lastRow = dchrSheet.getLastRow();
    
    // Validate folder ID belongs to a patient in our system
    if (lastRow >= DCHR_START_ROW) {
      const folderLinks = dchrSheet.getRange(DCHR_START_ROW, COL_FOLDER_LINK, lastRow - DCHR_START_ROW + 1, 1).getValues();
      const expectedUrl = 'https://drive.google.com/drive/folders/' + folderId;
      let isValidFolder = false;
      
      for (let i = 0; i < folderLinks.length; i++) {
        if (folderLinks[i][0] === expectedUrl) {
          isValidFolder = true;
          break;
        }
      }
      
      if (!isValidFolder) {
        Logger.log('Privacy notice submission attempt to unauthorized folder');
        return { success: false, message: 'Invalid submission destination.' };
      }
    } else {
      return { success: false, message: 'System error: No patient records found.' };
    }
    
    // Check if already completed to prevent duplicates
    const existingStatus = getPrivacyNoticeStatus(folderId);
    if (existingStatus && existingStatus.completed) {
      return { success: false, message: 'Privacy notice has already been acknowledged.' };
    }
    
    // Get full patient data for PDF generation
    const fullData = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
    const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
    
    for (let i = 0; i < fullData.length; i++) {
      if (fullData[i][COL_FOLDER_LINK - 1] === folderUrl) {
        const actualRow = DCHR_START_ROW + i;
        const timestamp = new Date();
        
        // Extract patient data for PDF
        const patientData = {
          firstName: fullData[i][COL_FIRST_NAME - 1] || '',
          lastName: fullData[i][COL_LAST_NAME - 1] || '',
          gender: fullData[i][COL_GENDER - 1] || '',
          dob: fullData[i][COL_DOB - 1] || '',
          email: fullData[i][COL_EMAIL - 1] || '',
          phone: fullData[i][COL_PHONE - 1] || '',
          address: fullData[i][COL_ADDRESS - 1] || '',
          city: fullData[i][COL_CITY - 1] || '',
          state: fullData[i][COL_STATE - 1] || '',
          zip: fullData[i][COL_ZIP - 1] || '',
          apptType: fullData[i][COL_APPT_TYPE - 1] || '',
          signature: signatureData.signature.trim(),
          signedDate: Utilities.formatDate(timestamp, tz, 'MMMM d, yyyy'),
          signedDateTime: Utilities.formatDate(timestamp, tz, 'MM/dd/yyyy h:mm a')
        };
        
        // Calculate age from DOB
        if (patientData.dob) {
          const dobDate = new Date(patientData.dob);
          if (!isNaN(dobDate.getTime())) {
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDiff = today.getMonth() - dobDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
              age--;
            }
            patientData.age = age;
            patientData.dobFormatted = Utilities.formatDate(dobDate, tz, 'MM/dd/yyyy');
          } else {
            patientData.age = '';
            patientData.dobFormatted = patientData.dob.toString();
          }
        } else {
          patientData.age = '';
          patientData.dobFormatted = '';
        }
        
        // Generate Privacy Notice PDF
        const privacyHtml = generatePrivacyNoticePdfHtml(patientData);
        const blob = Utilities.newBlob(privacyHtml, 'text/html', 'privacy.html');
        const pdfBlob = blob.getAs('application/pdf');
        const privacyCaseNumber = fullData[i][COL_CASE_NUMBER - 1] || '';
        const safePrivacyCaseNumber = privacyCaseNumber.toString().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        pdfBlob.setName('Privacy_Notice_' + patientData.lastName + '_' + patientData.firstName + '_' + safePrivacyCaseNumber + '_' + Utilities.formatDate(timestamp, tz, 'yyyyMMdd') + '.pdf');
        
        // Save to patient's folder
        const folder = DriveApp.getFolderById(folderId);
        const pdfFile = folder.createFile(pdfBlob);
        const pdfUrl = pdfFile.getUrl();
        
        // Update DCHR sheet
        dchrSheet.getRange(actualRow, COL_PRIVACY_SIGNED_AT).setValue(timestamp);
        dchrSheet.getRange(actualRow, COL_PRIVACY_SIGNATURE).setValue(signatureData.signature.trim());
        dchrSheet.getRange(actualRow, COL_PRIVACY_PDF_LINK).setValue(pdfUrl);
        
        // Audit log for HIPAA compliance
        const patientId = fullData[i][COL_PATIENT_ID - 1];
        logAuditEvent('PRIVACY_NOTICE_SIGNED', 'Patient Portal', patientId || 'Unknown', 'Privacy notice acknowledged and PDF generated');
        
        return { 
          success: true, 
          timestamp: Utilities.formatDate(timestamp, tz, 'MMM d, yyyy h:mm a')
        };
      }
    }
    
    return { success: false, message: 'Patient record not found.' };
  } catch (error) {
    Logger.log('savePrivacyNotice error occurred');
    return { success: false, message: 'Failed to save acknowledgement. Please try again.' };
  }
}

function getPrivacyNoticePdf() {
  try {
    const response = UrlFetchApp.fetch('https://www.pfcassociates.org/Documents/PFC_Patient_Comment_Form.pdf');
    const blob = response.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());
    return { success: true, data: base64 };
  } catch (error) {
    Logger.log('Error fetching privacy PDF: ' + error);
    return { success: false, message: 'Could not download PDF.' };
  }
}

function generatePrivacyNoticePdfHtml(data) {
  // Escape HTML to prevent injection
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  const safeFirstName = escapeHtml(data.firstName);
  const safeLastName = escapeHtml(data.lastName);
  const safeFullName = safeLastName + ', ' + safeFirstName;
  const safeGender = escapeHtml(data.gender);
  const safeAge = escapeHtml(data.age);
  const safeDob = escapeHtml(data.dobFormatted);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeAddress = escapeHtml(data.address);
  const safeCity = escapeHtml(data.city);
  const safeState = escapeHtml(data.state);
  const safeZip = escapeHtml(data.zip);
  const safeFullAddress = safeAddress + (safeCity ? ' ' + safeCity : '') + (safeState ? ' ' + safeState : '') + (safeZip ? ' ' + safeZip : '');
  const safeSignature = escapeHtml(data.signature);
  const safeSignedDate = escapeHtml(data.signedDate);
  const safeSignedDateTime = escapeHtml(data.signedDateTime || data.signedDate);
  const safeApptType = escapeHtml(data.apptType || '');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter;
      margin: 0.5in 0.75in;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
    }
    
    .header {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .header-title {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .header-address {
      font-size: 11pt;
      font-weight: bold;
    }
    
    .form-title {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin: 20px 0 15px 0;
      text-decoration: underline;
    }
    
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    .info-table td {
      border: 1px solid #000;
      padding: 6px 8px;
      vertical-align: top;
    }
    
    .info-label {
      font-weight: bold;
      font-size: 10pt;
    }
    
    .info-value {
      font-size: 10pt;
    }
    
    .consent-section {
      margin: 20px 0;
    }
    
    .consent-item {
      margin-bottom: 12px;
      font-size: 10pt;
    }
    
    .consent-item strong {
      font-size: 10pt;
    }
    
    .consent-bold {
      font-weight: bold;
    }
    
    .signature-section {
      margin-top: 25px;
    }
    
    .signature-title {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .legal-text {
      font-size: 9pt;
      text-align: justify;
      margin-bottom: 20px;
    }
    
    .date-line {
      text-align: center;
      font-size: 11pt;
      margin: 25px 0;
    }
    
    .signature-box {
      margin-top: 30px;
      border: 1px solid #000;
      min-height: 80px;
      padding: 10px;
      position: relative;
    }
    
    .signature-name {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 28pt;
      font-style: italic;
      font-weight: normal;
      color: #00008B;
      position: absolute;
      bottom: 15px;
      left: 20px;
      letter-spacing: 1px;
      transform: rotate(-2deg);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">D.C. POLICE AND FIRE CLINIC</div>
    <div class="header-address">PFC ASSOCIATES, LLC 920 Varnum Street, N.E., Washington, DC 20017</div>
  </div>
  
  <div class="form-title">CLINIC DATA RECORD CONSENTS</div>
  
  <table class="info-table">
    <tr>
      <td style="width: 25%;">
        <div class="info-label">Name</div>
        <div class="info-value">${safeFullName}</div>
      </td>
      <td style="width: 10%;">
        <div class="info-label">Sex</div>
        <div class="info-value">${safeGender}</div>
      </td>
      <td style="width: 10%;">
        <div class="info-label">Age</div>
        <div class="info-value">${safeAge}</div>
      </td>
      <td style="width: 20%;">
        <div class="info-label">Date Of Birth</div>
        <div class="info-value">${safeDob}</div>
      </td>
      <td style="width: 35%;">
        <div class="info-label">Email Address</div>
        <div class="info-value">${safeEmail}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div class="info-label">Department</div>
        <div class="info-value">&nbsp;</div>
      </td>
      <td>
        <div class="info-label">Rank</div>
        <div class="info-value">&nbsp;</div>
      </td>
      <td colspan="2">
        <div class="info-label">Assigned Unit</div>
        <div class="info-value">&nbsp;</div>
      </td>
      <td>
        <div class="info-label">Clinic in Duty status</div>
        <div class="info-value">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td colspan="3" rowspan="3">
        <div class="info-label">Home Address</div>
        <div class="info-value">${safeFullAddress}</div>
      </td>
      <td colspan="2">
        <div class="info-label">Work#</div>
        <div class="info-value">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="info-label">Cell#</div>
        <div class="info-value">${safePhone}</div>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="info-label">Home#</div>
        <div class="info-value">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td colspan="5">
        <div class="info-label">Appointment Type</div>
        <div class="info-value">${safeApptType}</div>
      </td>
    </tr>
  </table>
  
  <div class="consent-section">
    <div class="consent-item">
      <strong>I HEREBY CONSENT TO RECEIVE TREATMENT by the PFC Provider:</strong> Yes
    </div>
    
    <div class="consent-item">
      <strong class="consent-bold">NON FULL-DUTY MEMBERS ARE NOT ALLOWED TO ENGAGE IN ANY OUTSIDE EMPLOYMENT PER DEPARTMENTAL ORDERS</strong>
    </div>
    
    <div class="consent-item">
      I have received a copy of the Notice of Privacy Practices that details the Use and Disclosure of my Protected Health Information (PHI): Yes
    </div>
    
    <div class="consent-item">
      <strong class="consent-bold">MEMBERS ARE REQUIRED TO CHECK THEIR DC GOVERNMENT E-MAIL ACCOUNT DURING TOUR OF DUTY</strong>
    </div>
  </div>
  
  <div class="signature-section">
    <div class="signature-title">SIGNATURE, CERTIFICATION AND RELEASE OF INFORMATION</div>
    
    <div class="legal-text">
      Read the following carefully before you sign. I understand that making a false statement on this form or on materials submitted with this form may be punishable by civil and/or criminal penalties, and may result in the termination of my employment. I understand that any information that I submit may be investigated for validity as allowed by law. I certify that, to the best of my knowledge and belief, all of my statements on these form (s); and on the materials submitted with this form, are true, correct and complete.
    </div>
    
    <div class="date-line">Date: ${safeSignedDateTime}</div>
    
    <div class="signature-box">
      <span class="signature-name">${safeSignature}</span>
    </div>
  </div>
</body>
</html>
`;
}

function generateQuestionnaireHtml(data) {
  // Escape HTML to prevent injection
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
  
  // Helper function to render Yes/No checkboxes
  const renderYesNo = (value) => {
    const isYes = value === 'Yes';
    const isNo = value === 'No';
    return `<span class="cb ${isYes ? 'checked' : ''}">✓</span> <span class="cb ${isNo ? 'checked' : ''}">✓</span>`;
  };
  
  // Helper to create a condition row for PDF
  const conditionRow = (label, fieldName) => {
    const value = data[fieldName] || '';
    const yesChecked = value === 'Yes' ? '✓' : '';
    const noChecked = value === 'No' ? '✓' : '';
    return `<tr><td class="condition-label">${escapeHtml(label)}</td><td class="cb-cell">${yesChecked}</td><td class="cb-cell">${noChecked}</td></tr>`;
  };
  
  // Import Google Font for cursive signature
  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');`;
  
  // Escape all text fields
  const safeSignature = escapeHtml(data.signature || '');
  const safeYesExplanation = escapeHtml(data.yesExplanation || '');
  const safeHospitalizations = escapeHtml(data.hospitalizations || 'None');
  const safeMedications = escapeHtml(data.medications || 'None');
  const safeDrugAllergies = escapeHtml(data.drugAllergies || 'None');
  const safeTbTreatment = escapeHtml(data.tb_treatment || '');
  const safeTbTestDate = escapeHtml(data.tb_test_date || '');
  const safeTetanusDate = escapeHtml(data.tetanus_date || '');
  const safeSmokePacks = escapeHtml(data.smoke_packs || '');
  const safeSmokeYears = escapeHtml(data.smoke_years || '');
  const safeAlcoholAmount = escapeHtml(data.alcohol_amount || '');
  const safeSubmittedAt = escapeHtml(data.submittedAt || '');
  const safePatientName = escapeHtml(data.patientName || '');
  const safePatientDob = escapeHtml(data.patientDob || '');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter;
      margin: 0.4in;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 10px;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .header-info {
      font-size: 9px;
      text-align: right;
    }
    .subtitle {
      font-size: 11px;
      font-weight: bold;
      margin-top: 3px;
    }
    .two-column {
      display: flex;
      gap: 15px;
    }
    .column {
      flex: 1;
    }
    .section {
      margin-bottom: 8px;
    }
    .section-title {
      font-size: 9px;
      font-weight: bold;
      background: #e0e0e0;
      padding: 3px 5px;
      margin-bottom: 3px;
    }
    table.conditions {
      width: 100%;
      border-collapse: collapse;
      font-size: 8px;
    }
    table.conditions th {
      text-align: center;
      font-size: 7px;
      padding: 2px;
      border-bottom: 1px solid #999;
    }
    table.conditions td {
      padding: 2px 4px;
      border-bottom: 1px solid #ddd;
    }
    table.conditions td.condition-label {
      width: 70%;
    }
    table.conditions td.cb-cell {
      width: 15%;
      text-align: center;
      font-weight: bold;
    }
    .text-section {
      margin-top: 10px;
      padding: 8px;
      border: 1px solid #999;
      background: #fafafa;
    }
    .text-section-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 5px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 3px;
    }
    .text-content {
      font-size: 9px;
      white-space: pre-wrap;
      min-height: 30px;
    }
    .inline-section {
      margin-top: 8px;
    }
    .inline-row {
      display: flex;
      gap: 20px;
      margin-bottom: 4px;
      font-size: 8px;
    }
    .inline-label {
      font-weight: bold;
    }
    .signature-section {
      margin-top: 15px;
      padding: 10px;
      border: 2px solid #000;
      background: #fffde7;
    }
    .signature-text {
      font-size: 8px;
      margin-bottom: 8px;
    }
    .signature-line {
      border-bottom: 1px solid #333;
      min-height: 20px;
      padding: 5px 0;
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 20pt;
      font-style: italic;
      font-weight: normal;
      color: #00008B;
      letter-spacing: 1px;
    }
    .signature-label {
      font-size: 7px;
      color: #666;
      margin-top: 2px;
    }
    .footer {
      margin-top: 10px;
      text-align: center;
      font-size: 7px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <table width="100%">
      <tr>
        <td style="text-align:left;font-weight:bold;">Name: ${safePatientName}</td>
        <td style="text-align:center;"><span class="title">PFC Associates</span></td>
        <td style="text-align:right;">Date: ${safeSubmittedAt}</td>
      </tr>
    </table>
    <div class="subtitle">Applicant Medical Questionnaire</div>
    <div style="font-size:9px;">DOB: ${safePatientDob}</div>
  </div>
  
  <p style="font-size:8px;text-align:center;margin:5px 0;font-style:italic;">PAST MEDICAL HISTORY: Check any of the following conditions that you have now or have ever had:</p>
  
  <div class="two-column">
    <div class="column">
      <div class="section">
        <div class="section-title">HEAD</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Injury', 'head_injury')}
          ${conditionRow('Loss of Consciousness', 'head_loc')}
          ${conditionRow('Seizure', 'head_seizure')}
          ${conditionRow('Dizziness', 'head_dizziness')}
          ${conditionRow('Fainting', 'head_fainting')}
          ${conditionRow('Chronic Headaches', 'head_headaches')}
          ${conditionRow('Migraines', 'head_migraines')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">EARS</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Injury', 'ears_injury')}
          ${conditionRow('Ringing', 'ears_ringing')}
          ${conditionRow('Decreased Hearing', 'ears_decreased')}
          ${conditionRow('Hearing Loss', 'ears_loss')}
          ${conditionRow('Ruptured Ear Drum', 'ears_ruptured')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">EYES</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Injury', 'eyes_injury')}
          ${conditionRow('Double Vision', 'eyes_double')}
          ${conditionRow('Blurred Vision', 'eyes_blurred')}
          ${conditionRow('Glasses', 'eyes_glasses')}
          ${conditionRow('Contacts', 'eyes_contacts')}
          ${conditionRow('Decreased Far Vision', 'eyes_far')}
          ${conditionRow('Decreased Near Vision', 'eyes_near')}
          ${conditionRow('Vision in One Eye', 'eyes_oneeye')}
          ${conditionRow('Color Vision Disorder', 'eyes_color')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">THROAT / NECK</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Throat Injury', 'throat_injury')}
          ${conditionRow('Chronic Sore Throats', 'throat_sore')}
          ${conditionRow('Neck Injury', 'neck_injury')}
          ${conditionRow('Neck Masses', 'neck_masses')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">MUSCULOSKELETAL</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Joint Pain', 'musc_joint')}
          ${conditionRow('Muscle Weakness', 'musc_weakness')}
          ${conditionRow('Arthritis', 'musc_arthritis')}
          ${conditionRow('Back Injury or Pain', 'musc_back')}
          ${conditionRow('Back Surgery', 'musc_backsurg')}
          ${conditionRow('Herniated Disk', 'musc_herniated')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">FRACTURES OR INJURY</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Shoulder', 'frac_shoulder')}
          ${conditionRow('Elbow', 'frac_elbow')}
          ${conditionRow('Wrist', 'frac_wrist')}
          ${conditionRow('Hand', 'frac_hand')}
          ${conditionRow('Fingers', 'frac_fingers')}
          ${conditionRow('Hip', 'frac_hip')}
          ${conditionRow('Knee', 'frac_knee')}
          ${conditionRow('Ankle', 'frac_ankle')}
          ${conditionRow('Foot', 'frac_foot')}
          ${conditionRow('Other Joint', 'frac_other')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">NEUROLOGICAL</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Tremors', 'neuro_tremors')}
          ${conditionRow('Numbness/Weakness', 'neuro_numbness')}
          ${conditionRow('Confusion', 'neuro_confusion')}
          ${conditionRow('Dizziness', 'neuro_dizziness')}
          ${conditionRow('Convulsions', 'neuro_convulsions')}
        </table>
      </div>
    </div>
    
    <div class="column">
      <div class="section">
        <div class="section-title">CARDIOVASCULAR</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Chest Pain/Tightness', 'cardio_chest')}
          ${conditionRow('Heart Attack', 'cardio_attack')}
          ${conditionRow('Palpitations', 'cardio_palpitations')}
          ${conditionRow('Irregular Heart Beat', 'cardio_irregular')}
          ${conditionRow('High Blood Pressure', 'cardio_bp')}
          ${conditionRow('Stroke', 'cardio_stroke')}
          ${conditionRow('Heart Murmur', 'cardio_murmur')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">MEDICAL CONDITIONS</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Diabetes', 'med_diabetes')}
          ${conditionRow('Thyroid Disorder', 'med_thyroid')}
          ${conditionRow('Cancer', 'med_cancer')}
          ${conditionRow('Bleeding Disorder', 'med_bleeding')}
          ${conditionRow('Anemia', 'med_anemia')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">PULMONARY / NOSE / SINUS</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Asthma', 'pulm_asthma')}
          ${conditionRow('Shortness of Breath', 'pulm_breath')}
          ${conditionRow('Lung Disease/Problems', 'pulm_lung')}
          ${conditionRow('Nose Injury', 'nose_injury')}
          ${conditionRow('Chronic Nose Bleeds', 'nose_bleeds')}
          ${conditionRow('Sinus Allergies', 'sinus_allergies')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">ABDOMEN</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Chronic Abdominal Pain', 'abd_pain')}
          ${conditionRow('Abdominal Cramps', 'abd_cramps')}
          ${conditionRow('Diarrhea', 'abd_diarrhea')}
          ${conditionRow('Nausea/Vomiting', 'abd_nausea')}
          ${conditionRow('Bowel Problems', 'abd_bowel')}
          ${conditionRow('Hepatitis', 'abd_hepatitis')}
          ${conditionRow('Hernia', 'abd_hernia')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">KIDNEY</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Kidney Injury', 'kidney_injury')}
          ${conditionRow('Bladder Disorders', 'kidney_bladder')}
          ${conditionRow('Kidney Disorders', 'kidney_disorders')}
          ${conditionRow('Dark Urine', 'kidney_urine')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">MENTAL HEALTH</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Memory Loss', 'mental_memory')}
          ${conditionRow('Depression', 'mental_depression')}
          ${conditionRow('Phobias (incl. Claustrophobia)', 'mental_phobias')}
          ${conditionRow('Suicidal Thoughts', 'mental_suicidal')}
          ${conditionRow('Homicidal Thoughts', 'mental_homicidal')}
          ${conditionRow('Anxiety', 'mental_anxiety')}
          ${conditionRow('PTSD', 'mental_ptsd')}
          ${conditionRow('Decreased Alertness', 'mental_alertness')}
          ${conditionRow('Unexplained Sleepiness', 'mental_sleepiness')}
        </table>
      </div>
      
      <div class="section">
        <div class="section-title">SKIN</div>
        <table class="conditions">
          <tr><th></th><th>YES</th><th>NO</th></tr>
          ${conditionRow('Rash', 'skin_rash')}
          ${conditionRow('Jaundice', 'skin_jaundice')}
        </table>
      </div>
    </div>
  </div>
  
  <div class="text-section">
    <div class="text-section-title">ANSWERS TO YES: EXPLAIN (including dates and treatments)</div>
    <div class="text-content">${safeYesExplanation || 'N/A'}</div>
  </div>
  
  <div class="text-section">
    <div class="text-section-title">HOSPITALIZATIONS, OPERATIONS, INJURIES OR ILLNESS</div>
    <div class="text-content">${safeHospitalizations}</div>
  </div>
  
  <div class="inline-section">
    <div class="section-title">IMMUNIZATION HISTORY</div>
    <div class="inline-row">
      <span><span class="inline-label">Hepatitis Vaccine (3-shot series)?</span> ${data.vaccine_hep === 'Yes' ? '✓ YES' : ''} ${data.vaccine_hep === 'No' ? '✓ NO' : ''}</span>
    </div>
    <div class="inline-row">
      <span><span class="inline-label">T.B. Test Date:</span> ${safeTbTestDate || 'Not provided'}</span>
      <span><span class="inline-label">Tetanus Shot Date:</span> ${safeTetanusDate || 'Not provided'}</span>
    </div>
    <div class="inline-row">
      <span><span class="inline-label">History of Positive T.B. Test?</span> ${data.tb_positive === 'Yes' ? '✓ YES' : ''} ${data.tb_positive === 'No' ? '✓ NO' : ''}</span>
      <span><span class="inline-label">Treatment Dates:</span> ${safeTbTreatment || 'N/A'}</span>
    </div>
  </div>
  
  <div class="inline-section">
    <div class="section-title">CHILDHOOD DISEASES</div>
    <div class="inline-row">
      <span><span class="inline-label">Chicken Pox:</span> ${data.child_chickenpox === 'Yes' ? '✓ Yes' : '✓ No'}</span>
      <span><span class="inline-label">Mumps:</span> ${data.child_mumps === 'Yes' ? '✓ Yes' : '✓ No'}</span>
      <span><span class="inline-label">Measles:</span> ${data.child_measles === 'Yes' ? '✓ Yes' : '✓ No'}</span>
    </div>
  </div>
  
  <div class="inline-section">
    <div class="section-title">SOCIAL HISTORY</div>
    <div class="inline-row">
      <span><span class="inline-label">Have you ever smoked?</span> ${data.smoke === 'Yes' ? '✓ Yes' : '✓ No'}</span>
      <span><span class="inline-label">Packs per Day:</span> ${safeSmokePacks || 'N/A'}</span>
      <span><span class="inline-label">Years:</span> ${safeSmokeYears || 'N/A'}</span>
    </div>
    <div class="inline-row">
      <span><span class="inline-label">Do you drink alcohol?</span> ${data.alcohol === 'Yes' ? '✓ Yes' : '✓ No'}</span>
      <span><span class="inline-label">How much?</span> ${safeAlcoholAmount || 'N/A'}</span>
    </div>
  </div>
  
  <div class="text-section">
    <div class="text-section-title">LIST ALL MEDICATIONS (Medication, Dose, # Times Per Day)</div>
    <div class="text-content">${safeMedications}</div>
  </div>
  
  <div class="text-section">
    <div class="text-section-title">DRUG ALLERGIES</div>
    <div class="text-content">${safeDrugAllergies}</div>
  </div>
  
  <div class="signature-section">
    <div class="signature-text">I certify to the best of my knowledge that the above answers are correct and complete.</div>
    <div class="signature-line">${safeSignature}</div>
    <div class="signature-label">Applicant Signature and Date</div>
  </div>
  
  <div class="footer">
    PFC Associates, LLC • 920 Varnum St NE, Washington, DC 20017 • Submitted: ${safeSubmittedAt}
  </div>
</body>
</html>
`;
}

function getLastUploadTimestamp(folderIdOrToken) {
  // Check if this is a portal token (UUID format) and look up folderId
  let folderId = folderIdOrToken;
  if (/^[a-f0-9-]{36}$/i.test(folderIdOrToken)) {
    const patientInfo = lookupPatientByPortalToken(folderIdOrToken);
    if (patientInfo && patientInfo.folderId) {
      folderId = patientInfo.folderId;
    } else {
      return null;
    }
  }
  
  // Validate folderId format
  if (!folderId || typeof folderId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
    return null;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dchrSheet = ss.getSheetByName('DCHR_All_Categories');
const lastRow = dchrSheet.getLastRow();
const tz = Session.getScriptTimeZone();
if (lastRow < DCHR_START_ROW) {
return null;
}
const data = dchrSheet.getRange(DCHR_START_ROW, 1, lastRow - DCHR_START_ROW + 1, COL_FOLDER_LINK).getValues();
const folderUrl = 'https://drive.google.com/drive/folders/' + folderId;
for (let i = 0; i < data.length; i++) {
if (data[i][COL_FOLDER_LINK - 1] === folderUrl) {
const lastFileLink = data[i][COL_LAST_FILE_LINK - 1];
const lastUploadAt = data[i][COL_LAST_UPLOAD_AT - 1];
if (lastFileLink === 'NO_PROOF' && lastUploadAt) {
return 'NO_PROOF:' + Utilities.formatDate(new Date(lastUploadAt), tz, 'MMM d, yyyy h:mm a');
}
if (lastUploadAt) {
return Utilities.formatDate(new Date(lastUploadAt), tz, 'MMM d, yyyy h:mm a');
}
return null;
}
}
return null;
}
function combineDateTime(date, time) {
  const d = new Date(date);
  const t = new Date(time);
  
  // Validate that both parsed correctly
  if (isNaN(d.getTime()) || isNaN(t.getTime())) {
    throw new Error('Invalid date or time value for calendar event');
  }
  
  d.setHours(t.getHours(), t.getMinutes(), 0, 0);
  return d;
}
function openUrl() {
  var html = HtmlService.createHtmlOutput(
    '<html><body style="font-family:Arial;text-align:center;padding:20px;">' +
    '<div id="fallback" style="display:none;">' +
    '<p style="font-size:13px;color:#666;margin-bottom:12px;">Pop-up was blocked. Allow pop-ups for this site to open automatically next time.</p>' +
    '<a href="https://drive.google.com/file/d/1sTdsgVM75gE2mLmaDcimzJV7ihq0MUAz/view" target="_blank" onclick="google.script.host.close();" ' +
    'style="font-size:18px;color:#1a73e8;text-decoration:none;">Click here to open</a>' +
    '</div>' +
    '<script>' +
    'var w=window.open("https://drive.google.com/file/d/1sTdsgVM75gE2mLmaDcimzJV7ihq0MUAz/view","_blank");' +
    'if(w){setTimeout(function(){google.script.host.close();},500);}' +
    'else{document.getElementById("fallback").style.display="block";}' +
    '</script>' +
    '</body></html>'
  ).setWidth(350).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(html, 'Opening...');
}

function authorizeScript() {
DriveApp.getFolderById(PARENT_FOLDER_ID);
MailApp.getRemainingDailyQuota();
GmailApp.getDrafts();
CalendarApp.getDefaultCalendar();
SpreadsheetApp.getActiveSpreadsheet();
DocumentApp.create('authTest').saveAndClose();
UrlFetchApp.fetch('https://www.google.com');
ScriptApp.getOAuthToken();
Logger.log('Authorization complete!');
}
