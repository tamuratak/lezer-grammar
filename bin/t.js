const fs = require('fs')
let {parser} = require('../dist/parser')
const filename = process.argv.pop()
if (!fs.existsSync(filename)) {
    console.error(`${filename} not found.`)
    process.exit(1)
}
const s = fs.readFileSync(filename, {encoding: 'utf8'})
function makeTree(node, str) {
    if (node.type.isError) {
        console.log(str.substring(node.from-10, node.to+10))
        console.log('          ^')
        throw('Parser Error')
    }
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

//parser = parser.configure({strict: true})
const topNode = parser.parse(s).topNode
const ret = JSON.stringify(makeTree(topNode, s), undefined, '  ')
console.log(ret)
