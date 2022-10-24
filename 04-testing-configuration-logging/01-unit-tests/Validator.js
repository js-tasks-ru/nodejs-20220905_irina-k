module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (value === undefined) {
        errors.push({field, error: `Значение поля ${field} не задано`});
        return errors;
      }

      if (rules.type !== 'number' && rules.type !== 'string') {
        errors.push({field, error: `Неверный тип данных в конфигурации правил: ${rules.type}`});
        return errors;
      }

      if (rules.max <= 0 || rules.min <= 0) {
        errors.push({ field, error: `Максимальное и минимальное значения правил должны быть больше 0` });
        return errors;
      }

      if (rules.max < rules.min) {
        errors.push({ field, error: `Максимальное значение правил не должно быть меньше минимального` });
        return errors;
      }

      if (type !== rules.type) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value <= 0) {
            errors.push({ field, error: `Значение поля должно быть больше 0` });
            return errors;
          }
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.min}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
