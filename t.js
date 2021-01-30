const fs = require('fs')
const {parser} = require('./src/parser')
const commander = require('commander')
commander.parse(process.argv)
const filename = commander.args[0]
if (!fs.existsSync(filename)) {
    console.error(`${filename} not found.`)
    process.exit(1)
}
const s = fs.readFileSync(filename, {encoding: 'utf8'})
function makeTree(node, str) {
    let child = node.firstChild
    if (!child) {
        return {
            kind: node.name,
            value: str.substring(node.from, node.to)
        }
    }
    let ret = []
    while (child) {
        ret.push(makeTree(child, str))
        child = child.nextSibling
    }
    return {
        kind: node.name,
        value: ret
    }
}

console.log(JSON.stringify(makeTree(parser.parse(s).topNode, s), undefined, '  '))
