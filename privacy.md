# Privacy Policy — Permission Security Guard

**Effective date:** December 24, 2025

## Summary
Permission Security Guard helps you inspect which apps on your Android device request sensitive permissions and shows per-app granted/denied states and screen-time (when enabled). The app processes all data locally on your device — nothing is uploaded to our servers.

## What we read and why
- Installed app metadata (package name, app label, icon)
  - Purpose: display a readable list of installed apps.
- Declared permissions of installed apps (e.g., `android.permission.CAMERA`)
  - Purpose: show which permissions each app requests and allow filtering.
- Per-app permission grant state (via `PackageManager.checkPermission`)
  - Purpose: show accurate Granted/Denied status for each permission.
- Usage statistics (foreground screen-time via `UsageStatsManager`) — optional
  - Purpose: if you enable Usage Access in system settings, the app sorts and surfaces apps by how much time you spend in them (last 7 days by default).

## Local processing & no-cloud promise
All inspection and processing are performed on-device. Permission Security Guard does not transmit app metadata, permission lists, usage statistics, or any other device data to external servers, analytics providers, or advertisers.

## Permissions used by this app
- `PACKAGE_USAGE_STATS` (Usage Access) — optional: requested only to enable sorting by screen-time. You are prompted with a clear explanation and the feature remains disabled until you grant it.
- The app reads package information and permission declarations using standard Android system APIs; these are read-only operations performed locally.

## Data sharing
We do not share the data inspected by this app with third parties. If you voluntarily export or share screenshots from your device, those images may contain information about apps and permissions — sharing is under your control.

## Data retention
The app does not upload or store your device data on remote servers. Any temporary local cache used for display performance is stored on your device and removed when the app is uninstalled or when you clear the app's cache/data from Android settings.

## Security
Because all processing is local, risk of remote exposure is minimized. Follow standard device security best practices (screen lock, OS updates). If you discover a vulnerability, contact us (see Contact below).

## Children
The app is informational. We do not knowingly collect personal data from children under the applicable age. If you believe a child has provided information, contact us and we will address the request.

## Legal requests
If required by law enforcement or similar legal processes, we will comply with valid legal requests. Since we do not store user data on servers, our ability to disclose historical data is limited.

## Short data-safety summary (for Play Console)
- Data accessed: Installed apps metadata, declared permissions, per-app permission grant state, optional aggregated usage stats when enabled.
- Transmission: None — local on-device processing only.
- Purpose: Permission auditing and usage-based sorting.

## Contact
For privacy questions, security reports, or requests, contact: privacy@yourdomain.example
(Replace the above email with your official developer contact before publishing.)

---

If you want, I can also:
- Add this file to the app's `assets` folder and display it in-app via a simple `WebView` or activity.
- Produce an HTML version suitable for hosting on a website.
- Update `AndroidManifest.xml` to point to a hosted privacy policy URL for Play Console.

Which would you like next?
