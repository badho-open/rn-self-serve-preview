# Self-Serve Feature Previews for React Native

This repository contains the frontend reference implementation for a self-serve, on-demand feature preview system for React Native apps using Over-the-Air (OTA) updates.

## 🎥 Live Demo

Watch the video below to see the "Preview Selector" screen in action. You will see us switch instantly between the Production build and two active feature branches without reinstalling the app or downloading a new APK.

[Self Preview Feature Demo](https://github.com/user-attachments/assets/8c3bb545-01b2-424e-867a-ec34d01b1fac)

In the video, we demonstrate:

- **Instant Switching:** Selecting a branch triggers an immediate OTA update.
- **The Result:** The app restarts, and the Home Page background changes color, proving that the specific code for that feature branch has been loaded successfully.
- **Feature Branches Shown:**
  1. `DEVELOP-01`: Home Page background changes to a green gradient.
  2. `DEVELOP-02`: Home Page background changes to a pinkish gradient.

This workflow empowers Product Managers to preview in-development features without having to rely on developers.

---

## The Problem: The "Preview Bottleneck"

High-velocity mobile teams often face the "Preview Bottleneck":

- **Developers** spend excessive time generating builds and hosting demos, leading to constant context switching and lost productivity.
- **Product Managers** and stakeholders feel sidelined, unable to access in-development features without interrupting a developer. This dependency causes delays and late-stage feedback, resulting in rework and frustration.

## The Solution: Self-Serve, On-Demand Feature Previews

We built a system that allows anyone on the team to preview active feature branches on-demand. A PM can open our Staging App, see a list of feature branches, and tap a button to load that specific version of the app's code via an OTA update.

### Why OTA Bundles over Native Artefacts?

- **Speed:** Creating OTA bundles takes 3-4 minutes, while a native build (APK/IPA) can take 15-20 minutes.
- **Cost:** OTA bundles for iOS can be created on standard Linux runners in CI/CD, which are cheaper than the macOS runners required for full iOS builds.
- **The 95% Rule:** Most feature work in a mature app happens at the JavaScript level. We reserve native builds for the 5% of cases that involve native code changes and use OTA for the other 95%.

## Architecture

We use a feature-based OTA deployment architecture. Every feature branch gets its own deployment channel.

1.  A developer pushes code to a feature branch (e.g., `DEVELOP-123/feat/new-payment-flow`).
2.  GitHub Actions detects the push and triggers a workflow that bundles the JavaScript.
3.  The bundle is deployed to an OTA channel named after the branch (e.g., `DEVELOP-123/feat/new-payment-flow`).
4.  Stakeholders can then select this channel from the "Previews" screen in the Staging App to load the feature instantly.

## Implementation

This repository contains the React Native frontend implementation.

- **Backend Repository:** [rn-self-serve-preview-server](https://github.com/badho-open/rn-self-serve-preview-server)

The solution consists of three main parts:

1.  **Backend:** A simple Node.js/Express server that fetches the list of active OTA deployments from the cloud service (e.g., Revopush or CodePush) and serves them to the app.
2.  **Automation (CI/CD):** A GitHub Actions workflow that automatically builds and deploys the JS bundle to the correct OTA channel on every push to a feature branch.
3.  **Frontend (This App):** A "Preview Selector" screen (`screens/previews.tsx`) that lists available feature branches and allows the user to switch between them.

---

## Getting Started with this Project

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript bundler that ships with React Native.

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its own terminal. Open a new terminal from the root of your React Native project. Run the following command to start your Android or iOS app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see the app running in your Android Emulator or iOS Simulator.
