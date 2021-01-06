class Menu {
  constructor(items) {
    this.items = items;
    this.page = 0;
  }

  render() {
    ctx.font = '30px Determination Mono';

    for (let i = 0; i < Math.min(4, this.items.length - (this.page * 4)); i++) {
      const text = '* ' + this.items[i + (this.page * 4)].name;

      const isEven = i % 2 === 0;
      ctx.fillText(text, isEven ? 70 : 320, i < 2 ? 250 : 280);
    }
  }
}
