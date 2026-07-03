# Architecture Analyzer & Prop Drilling Detector

An interactive, offline-first visualization tool built with React and React Flow (`@xyflow/react`). It allows developers to analyze their React application's component hierarchy, dynamically manage component properties, and automatically detect **Prop Drilling** paths while identifying the optimal **State Source** (Lowest Common Ancestor) for shared state.

---

## 🌟 Key Features

*   **Interactive React Flow Graph**: Visualizes components as custom interactive nodes in a hierarchically-layouted tree.
*   **Prop-Drilling Detection**: Automatically highlights components that pass props down without consuming them, marking them with a `🔗 Drilled` badge.
*   **Optimal State-Source Indicator (`👑 State`)**: Uses a Lowest Common Ancestor (LCA) algorithm to suggest the exact component where state should be defined when shared among multiple components.
*   **Custom Prop Styling**: Easily add props with custom highlight colors to see exactly how they propagate down your application tree.
*   **Live Component Search**: Search and highlight components in real time using the search bar in the dashboard.
*   **Local Project Management**: Save, view, and delete analyzed projects. All projects are stored in `localStorage` for complete offline capability.

---

## 🚀 How to Use It

### Step 1: Generate Your Architecture File
To analyze a React project, you must first generate its dependency map using `madge`. Run one of the following commands in the root of the project you want to analyze:

#### Method 1: Local installation (Recommended)
```bash
# Install madge as a dev dependency
npm install -D madge

# Run madge to output components mapping
npx madge --extensions jsx,js,tsx,ts --json src/ > architecture.json
```

#### Method 2: On-demand run
```bash
npx -y madge --extensions jsx,js,tsx,ts --json src/ > architecture.json
```

---

### Step 2: Upload and Analyze
1. Start the Architecture Analyzer app (`npm run dev`).
2. Go to **Create Project** (`/newProject`).
3. Enter a custom name for your project.
4. Upload the generated `architecture.json` file.
5. Click **Submit** to open the project's interactive dashboard.

---

### Step 3: Interactive Prop Profiling
1. Click the `+` button on any component node to add a prop name and select a highlight color.
2. If the same prop name is added to two or more target components, the system automatically:
   * Identifies the **Lowest Common Ancestor (LCA)**.
   * Labels the LCA component with a `👑 State` badge.
   * Highlights the intermediate nodes/edges with a `🔗` icon, indicating the path where the prop is being drilled.
3. Click `×` to delete props or clean up assignments.

---

## 🛠️ Tech Stack

*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Graph Engine**: [React Flow (@xyflow/react)](https://reactflow.dev/)
*   **Analysis Utility**: [Madge](https://github.com/pahen/madge) (under-the-hood)
*   **State Management**: Context API + `useReducer`
*   **Persistence**: LocalStorage API
*   **Styling**: Pure CSS layout (flexbox, grid, custom responsive layouting)

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Common/          # Shared layout elements (Navbar, Footer, Layout Wrapper)
│   ├── ui/              # Reusable core UI inputs and buttons
│   └── ProjectGraph/    # Custom node cards, edges, and React Flow wrapper
├── context/             # Global Contexts (Projects context, Props reducer, Tree data)
├── hooks/               # Custom hooks wrapper (usePropsActions)
├── pages/               # Page views (Home, Dashboard, NewProject, NotFound)
└── utils/               # Utilities (LCA calculations, layout coordinates, local storage wrappers)
```

---

> [!NOTE]
> All project data is stored locally in your browser. No files or architecture structures are sent to any external server.
