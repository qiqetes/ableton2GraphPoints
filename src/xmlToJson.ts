// const xmlToJson = xml => {
//   // Create a new DOMParser
//   const parser = new DOMParser();

//   // Parse the XML string
//   const xmlDoc = parser.parseFromString(xml, 'text/xml');

//   // Helper function to convert XML node to JSON object
//   function xmlNodeToObj(node) {
//     // If it's a text node, just return its content
//     if (node.nodeType === Node.TEXT_NODE) {
//       return node.nodeValue.trim();
//     }

//     // Create an object to represent the node
//     const obj = {};

//     // Add attributes if any
//     if (node.attributes) {
//       for (let i = 0; i < node.attributes.length; i++) {
//         const attr = node.attributes[i];
//         obj[`${attr.nodeName}`] = attr.nodeValue;
//       }
//     }

//     // Process child nodes
//     for (let i = 0; i < node.childNodes.length; i++) {
//       const child = node.childNodes[i];
//       if (child.nodeType === Node.ELEMENT_NODE) {
//         if (obj[child.nodeName]) {
//           if (!Array.isArray(obj[child.nodeName])) {
//             obj[child.nodeName] = [obj[child.nodeName]];
//           }
//           obj[child.nodeName].push(xmlNodeToObj(child));
//         } else {
//           obj[child.nodeName] = xmlNodeToObj(child);
//         }
//       } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
//         if (Object.keys(obj).length === 0) {
//           return child.nodeValue.trim();
//         } else {
//           obj['#text'] = child.nodeValue.trim();
//         }
//       }
//     }

//     return obj;
//   }

//   // Start the conversion from the root element
//   return xmlNodeToObj(xmlDoc.documentElement);
// };
// export default xmlToJson;
