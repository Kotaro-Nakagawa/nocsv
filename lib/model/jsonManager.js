"use strict"

import JsonPath from "../common/jsonPath.js"

const jsonToModelConverter = (function () {
  const subDataConverter = (value) => {
    // 想定される value
    // 以下のいずれかが入力として想定される
    // ■ record
    // {
    //   colume1: value1,
    //   colume2: value2,
    // }
    // ■ subTable
    // {
    //   subTable名: [
    //     record または subTable
    //   ]
    // }
    const isSubtable = (v) => {
      const [k0, v0] = Object.entries(v)[0]
      return Array.isArray(v0)
    }
    if (isSubtable(value)) {
      const [title, datas] = Object.entries(value)[0]
      return {
        title: title,
        isFolding: false,
        datas: datas.map(e => subDataConverter(e))
      }
      // 想定される戻り値
      // {
      //   title: subTable名,
      //   isFolding: たたまれてるか否か、生成時は false 固定
      //   datas: [record または subTable]
      // }
    }
    return value
  }

  const mainTableConverter = (key, value) => {
    // 想定される key
    // mainTable名
    // 想定される value
    // {
    //   columns: column情報,
    //   datas: データ情報(Record と subtable が混在しうる配列),
    //   rules: ルール情報
    // }
    return {
      title: key,
      columns: value.columns,
      datas: value.datas.map(e => subDataConverter(e)),
      rules: value.rules
    }

    // 想定される戻り値
    // {
    //   title: key,
    //   columns: column情報,
    //   datas: データ情報,
    //   rules: ルール情報
    // }
  }

  const convert = (json) => {
    // 想定される Json 形式
    // {
    //   mainTable名1: mainTable情報1,
    //   mainTable名2: mainTable情報2,
    //   :
    // }
    return {
      tableList: Object.entries(json).map(([k, v]) => mainTableConverter(k, v))
    }
    // 想定される戻り値
    // {
    //   tableList: [
    //     mainTableModel,
    //     mainTableMode2,
    //     :
    //   ]
    // }
  }

  return {
    convert
  }
})()

const modelToJsonConverter = (function () {
  const subDataConverter = (value) => {
    const isSubtable = (v) => {
      if (v.hasOwnProperty('datas')) {
        return Array.isArray(v.datas)
      }
      return false
    }
    if (isSubtable(value)) {
      return {
        [value.title]: value.datas.map(e => subDataConverter(e))
      }
    }
    return value
  }

  const convert = (json) => {
    // 想定される Json 形式
    // {
    //   tableList: [
    //     mainTableModel1,
    //     mainTableModel2,
    //     :
    //   ]
    // }
    const ret = {}
    json.tableList.forEach(element => {
      ret[element.title] = {
        columns: element.columns,
        datas: element.datas.map(d => subDataConverter(d)),
        rules: element.rules
      }
    });
    return
    // 想定される戻り値
    // {
    //   mainTable名1: mainTable情報1,
    //   mainTable名2: mainTable情報2,
    //   :
    // }
  }

  return {
    convert
  }
})()


const jsonEditor = (function () {
  const editOrFollowPath = (subTree, currentPath, action) => {
    if (currentPath.isLastKey()) {
      action(subTree, currentPath.topKey)
      return
    }
    editOrFollowPath(subTree[currentPath.topKey], currentPath.getFollwingPath(), action)
  }

  const update = (target, path, source) => {
    const editFunc = (targetObj, targetKey) => { targetObj[targetKey] = source }
    editOrFollowPath(target, path, editFunc)
  }

  const insert = (target, path, source) => {
    const editFunc = (targetObj, targetKey) => {
      if (Array.isArray(targetObj)) {
        targetObj.splice(targetKey, 0, source)
      } else {
        targetObj[targetKey] = source
      }
    }
    editOrFollowPath(target, path, editFunc)
  }

  const deleteData = (target, path, source) => {
    const editFunc = (targetObj, targetKey) => {
      if (Array.isArray(targetPoint)) {
        targetPoint.splice(path.pop(), 1)
      } else {
        delete followPath(target)[path.pop()]
      }
    }
    editOrFollowPath(target, path, editFunc)
  }

  const getOrFollowPath = (subTree, currentPath, action) => {
    if (currentPath.isLastKey()) {
      return action(subTree, currentPath.topKey)
    }
    return getOrFollowPath(subTree[currentPath.topKey], currentPath.getFollwingPath(), action)
  }

  const getValue = (target, path) => {
    const getFunc = (targetObj, targetKey) => {
      return structuredClone(targetObj[targetKey])
    }
    return getOrFollowPath(target, path, getFunc)
  }

  return {
    update,
    insert,
    delete: deleteData,
    get: getValue
  }
})()

const jsonManager = (function () {
  let data = null
  const setData = (newData) => {
    data = jsonToModelConverter.convert(newData)
  }
  const getJson = () => {
    return modelToJsonConverter.convert(data)
  }
  const getData = () => {
    return structuredClone(data)
  }
  const getValue = (path) => {
    return jsonEditor.get(data, path)
  }
  const update = (path, value) => {
    console.log(`path ${JSON.stringify(path)} may update to ${value}`)
    jsonEditor.update(data, path, value)
  }
  const deleteData = (path) => {
    jsonEditor.delete(data, path)
  }
  return {
    setData,
    getData,
    getJson,
    update,
    getValue,
    delete: deleteData
  }
})()

export default jsonManager
