"sue strict";

class DataValidation {
  #allows
  /**
   * 
   * @param {Object | undefined} json 
   * @param {(string|Object)[]} json.allow
   * @param {string} json.allow[].data_type
   * @param {string[]} json.allow[].examples
   */
  constructor(json) {
    this.#allows = json.allow || undefined
  }

  #isInteger(value) {
    return /^[+-]?\d+$/.test(value)
  }

  #dataTypeTest(type, value) {
    switch (type) {
      case 'integer':
        return this.#isInteger(value)
    }
    return false
  }

  #isAllowedBy(condition, value) {
    if (typeof condition === "string") return condition === value
    if (condition.data_type) return this.#dataTypeTest(condition.data_type, value)
    if (condition.regex) return new RegExp(condition.regex).test(value)
    return false
  }
  /**
   * 
   * @param {string} value 
   * @returns {boolean} true if valus is valid for this rule
   */
  isValid(value) {
    if (!this.#allows) return true
    return this.#allows.some(c => this.#isAllowedBy(c, value))
  }
  #toExample(condition) {
    if (typeof condition === "string") return condition
    if (condition.examples) return condition.examples || []
  }
  /**
   * 
   * @returns {string[]} valid value samples
   */
  get examples() {
    const joinedList = this.#allows.flatMap(c => this.#toExample(c))
    const listUnique = Array.from(new Set(joinedList))
    const stringList = listUnique.map(item => typeof item === 'string' ? item : item.toString())
    return stringList
  }
}

export default DataValidation
