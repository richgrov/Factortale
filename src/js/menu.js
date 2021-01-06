class Menu {
  constructor(items) {
    this.items = items;
    this.selection = 0;
    this.page = 0;
    this.pageCount = Math.ceil(this.items.length / 4);
  }

  move(action) {
    switch (action) {
      case Action.LEFT:
        // Try moving to the previous page if heart is on the left side.
        if ((this.selection === 0 || this.selection === 2)) {
          if (this.page > 0) {
            this.selection++;
            this.page--;
          }
        } else {
          // If they're on the right, move to the left
          this.selection--;
        }
        break;

      case Action.RIGHT:
        // Try moving to the next page if heart is on the right side.
        if (this.selection === 1 || this.selection === 3) {
          if (this.page + 1 < this.pageCount) {
            // If there's an item on the bottom left of the next page, stay on the current row
            if (this.items.length > (this.pageCount * 4) - 1) {
              this.selection--;
            } else {
              // If not, go to the top left
              this.selection = 0;
            }
            this.page++;
          }
        } else {
          // If they're on the left, move to the right
          if (this.selection === 0) {
            this.selection = 1;
          } else if (this.selection === 2) {
            let hasBottomRight;
            if (this.page + 1 === this.pageCount) {
              hasBottomRight = this.items.length === this.pageCount * 4;
            } else {
              // If we're not on the last page, it's guaranteed that bottom items exist.
              hasBottomRight = true;
            }

            // If there is an item on the bottom right, go there
            if (hasBottomRight) {
              this.selection = 3;
            } else {
              // If not, jump to the top right.
              this.selection = 1;
            }
          }
        }
        break;

      case Action.UP:
        // Move the heart up if it's on the bottom
        if (this.selection > 1) {
          this.selection -= 2;
        }
        break;

      case Action.DOWN:
        let hasBottomLeft;
        let hasBottomRight;

        if (this.page + 1 === this.pageCount) {
          hasBottomLeft = this.items.length === (this.pageCount * 4) - 1;
          hasBottomRight = this.items.length === this.pageCount * 4;
        } else {
          // If we're not on the last page, it's guaranteed that bottom items exist.
          hasBottomLeft = true;
          hasBottomRight = true;
        }

        // If the heart is on the left, try jumping to the bottom left if it's available
        if (this.selection === 0) {
          if (hasBottomLeft) {
            this.selection = 2;
          }
        } else if (this.selection === 1) {
          // If the heart is on the right, try jumping to the bottom right. Try the bottom left is that fails
          if (hasBottomRight) {
            this.selection = 3;
          } else if (hasBottomLeft) {
            this.selection = 2;
          }
        }
        break;

      case Action.CONFIRM:
        this.items[(this.page * 4) + this.selection].callback();
        break;
    }
  }

  render() {
    ctx.font = '30px Determination Mono';

    // Draw the heart
    ctx.drawImage(textures.heart, this.selection % 2 === 0 ? 40 : 320, this.selection < 2 ? 257 : 287)

    for (let i = 0; i < Math.min(4, this.items.length - (this.page * 4)); i++) {
      const text = '* ' + this.items[i + (this.page * 4)].name;

      const isEven = i % 2 === 0;
      ctx.fillText(text, isEven ? 70 : 350, i < 2 ? 250 : 280);
    }
  }
}
