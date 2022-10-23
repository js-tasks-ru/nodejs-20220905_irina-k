const Validator = require('../Validator');
const expect = require('chai').expect;
const assert = require('assert');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    let stringValidator;
    let numberValidator;
    before(() => {
      stringValidator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });
      numberValidator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });
    });

    after(() => {
      stringValidator = null;
      numberValidator = null;
    });

    it('валидатор проверяет строковые поля', () => {
      const errors = stringValidator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет тип строкового поля', () => {
      const errors = stringValidator.validate({ name: 1111111111111 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет числовые поля', () => {
      const errors = numberValidator.validate({ age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });

    it('валидатор проверяет тип числового поля', () => {
      const data = { age: '17' };
      const errors = numberValidator.validate(data);

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет, задано ли передаваемое поле', () => {
      const validator = new Validator({
        age: {
          type: 'undefined',
          min: 18,
          max: 27,
        },
      });
      const errors = validator.validate({ age: undefined });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      assert.equal(errors[0].error, 'Значение поля age не задано');
    });

    it('валидатор проверяет, задан ли верный тип у правил', () => {
      const validator = new Validator({
        age: {
          type: 'null',
          min: 18,
          max: 27,
        },
      });
      const errors = validator.validate({ age: null });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      assert.equal(errors[0].error, 'Неверный тип данных в конфигурации правил: null');
    });

    it('валидатор проверяет корректность переданного возраста', () => {
      const errors = numberValidator.validate({ age: -1 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      assert.equal(errors[0].error, 'Значение поля должно быть больше 0');
    });

    it('валидатор проверяет корректность минимального значения правил', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: -2,
          max: 27,
        },
      });
      const errors = validator.validate({ age: 11 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      assert.equal(errors[0].error, 'Максимальное и минимальное значения правил должны быть больше 0');
    });

    it('валидатор проверяет корректность минимального и максимального значений', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 27,
          max: 18,
        },
      });
      const errors = validator.validate({ age: 19 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      assert.equal(errors[0].error, 'Максимальное значение правил не должно быть меньше минимального');
    });
  });
});