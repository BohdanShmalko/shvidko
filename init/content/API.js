module.exports = pages => {
    const imports = pages.map(page => 
        `const ${page} = require('./${page}API');\n`
    );
    const exports = pages.map(page => 
        `...${page}`
    )
    return `${imports.join('')} 
module.exports = [${exports}];`
}