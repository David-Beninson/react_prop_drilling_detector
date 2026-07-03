const filterTree = (jsonTree) => {
    const filesToKeepREGEX = /\.(jsx|tsx|js|ts)$/i;
    const filteredFiles = {};

    Object.entries(jsonTree).forEach(([parent, children]) => {
        if (filesToKeepREGEX.test(parent)) {
            filteredFiles[parent] = children.filter(child => filesToKeepREGEX.test(child));
        }
    });
    return filteredFiles;
};

const createComponentMap = (filteredFiles) => {
    const componentMap = {};
    const addNodeToTree = (path) => {
        if (!componentMap[path]) {
            componentMap[path] = {
                id: path, name: path.split('/').pop(), children: []
            };
        };
    };

    Object.entries(filteredFiles).forEach(([parent, children]) => {
        addNodeToTree(parent);
        children.forEach(child => addNodeToTree(child));
    });

    return componentMap;
}


const linkChildren = (filteredFiles, componentMap, parentLookupMap) => {

    Object.entries(filteredFiles).forEach(([parentPath, childrenPaths]) => {
        const parentNode = componentMap[parentPath];
        if (!parentNode) return;

        childrenPaths.forEach(childPath => {
            const childNode = componentMap[childPath];
            if (!childNode) return;

            if (!parentNode.children.includes(childNode)) {
                parentNode.children.push(childNode);
            }

            if (!parentLookupMap[childPath]) {
                parentLookupMap[childPath] = [];
            }

            if (!parentLookupMap[childPath].includes(parentPath)) {
                parentLookupMap[childPath].push(parentPath);
            }
        });

    });

    const roots = Object.values(componentMap).filter(node => {
        const parents = parentLookupMap[node.id];
        return !parents || parents.length === 0;
    });

    return roots;

};

export const transformToHierarchy = (jsonObj) => {
    const filteredTree = filterTree(jsonObj);
    const componentMap = createComponentMap(filteredTree);
    const parentLookupMap = {}
    const hierarchy = linkChildren(filteredTree, componentMap, parentLookupMap);

    return { hierarchy: hierarchy, parentMap: parentLookupMap };
};


export const getLayoutedElements = (nodes, edges) => {
    const H_SPACING = 250;
    const V_SPACING = 150;

    const childrenMap = Object.fromEntries(nodes.map(n => [n.id, []]));
    const hasIncoming = new Set();

    edges.forEach(edge => {
        if (childrenMap[edge.source]) childrenMap[edge.source].push(edge.target);
        hasIncoming.add(edge.target);
    });

    const rootIds = nodes.filter(n => !hasIncoming.has(n.id)).map(n => n.id);
    if (!rootIds.length && nodes.length) rootIds.push(nodes[0].id);

    const nodeLevel = {};
    const primaryParent = {};
    const subtreeWidth = {};
    const visited = new Set();

    const buildTreeMetaData = (nodeId, level = 0) => {
        if (visited.has(nodeId)) return 0;
        visited.add(nodeId);

        nodeLevel[nodeId] = level;

        const primaryChildren = (childrenMap[nodeId] || []).filter(childId => {
            if (!visited.has(childId)) {
                primaryParent[childId] = nodeId;
                return true;
            }
            return false;
        });

        const width = primaryChildren.reduce((sum, childId) => sum + buildTreeMetaData(childId, level + 1), 0);
        subtreeWidth[nodeId] = Math.max(width, 1);
        return subtreeWidth[nodeId];
    };

    rootIds.forEach(id => buildTreeMetaData(id));

    const positions = {};
    const positionSubtree = (nodeId, xStart, xEnd) => {
        if (positions[nodeId]) return;

        const xCenter = (xStart + xEnd) / 2;
        positions[nodeId] = { x: xCenter, y: (nodeLevel[nodeId] ?? 0) * V_SPACING };

        const primaryChildren = (childrenMap[nodeId] || []).filter(c => primaryParent[c] === nodeId);

        const totalChildWidth = primaryChildren.reduce((sum, c) => sum + (subtreeWidth[c] || 1), 0);
        let currentX = xCenter - (totalChildWidth * H_SPACING) / 2;

        primaryChildren.forEach(childId => {
            const w = subtreeWidth[childId] || 1;
            positionSubtree(childId, currentX, currentX + w * H_SPACING);
            currentX += w * H_SPACING;
        });
    };

    const totalRootWidth = rootIds.reduce((sum, id) => sum + (subtreeWidth[id] || 1), 0);
    let startX = -(totalRootWidth * H_SPACING) / 2;

    rootIds.forEach(id => {
        const w = subtreeWidth[id] || 1;
        positionSubtree(id, startX, startX + w * H_SPACING);
        startX += w * H_SPACING;
    });

    const layoutedNodes = nodes.map(node => ({
        ...node,
        position: positions[node.id] || { x: 0, y: (nodeLevel[node.id] || 0) * V_SPACING },
    }));

    return { nodes: layoutedNodes, edges };
};
