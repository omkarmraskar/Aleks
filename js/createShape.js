class Shape {
    constructor(x, y, mode, icon) {
      if (mode === "pencil") {
        this.element = document.createElementNS("http://www.w3.org/2000/svg","line");
        this.element.setAttribute("x1", x);
        this.element.setAttribute("y1", y);
        this.element.setAttribute("x2", x);
        this.element.setAttribute("y2", y);

        this.boardText = document.getElementById("board-text");
        const lines = document.querySelectorAll("line");
        for (let i = 0; i < lines.length; i++) {
          const x1Other = lines[i].getAttribute("x1");
          const y1Other = lines[i].getAttribute("y1");
          const x2Other = lines[i].getAttribute("x2");
          const y2Other = lines[i].getAttribute("y2");
          const distanceStart = Math.sqrt(
            (x - x1Other) ** 2 + (y - y1Other) ** 2
          );
          const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
          if (distanceStart <= 10) {
            this.element.setAttribute("x1", x1Other);
            this.element.setAttribute("y1", y1Other);
          }
          if (distanceEnd <= 10) {
            this.element.setAttribute("x1", x2Other);
            this.element.setAttribute("y1", y2Other);
          }
        }
      } 
      else {
        this.element = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.element.setAttribute("transform", `translate(${x}, ${y})`);
        const lines = document.querySelectorAll("line");
        for (const line of lines) {
          let x1Other = parseInt(line.getAttribute("x1"));
          let y1Other = parseInt(line.getAttribute("y1"));
          let x2Other = parseInt(line.getAttribute("x2"));
          let y2Other = parseInt(line.getAttribute("y2"));
          const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
          const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
          if (distanceStart <= 10) {
            this.element.removeAttribute("transform");
            let sine = this.getSine(x1Other, y1Other, x2Other, y2Other);
            let cosine = this.getCosine(x1Other, y1Other, x2Other, y2Other);
            if (x1Other < x2Other) {
              if (y1Other < y2Other) {
                x1Other = x1Other - 10 * sine;
                y1Other = y1Other - 10 * cosine;
              } 
              else {
                x1Other = x1Other - 10 * sine;
                y1Other = y1Other + 10 * cosine;
              }
            } 
            else {
              if (y1Other < y2Other) {
                x1Other = x1Other - 10 * sine;
                y1Other = y1Other + 10 * cosine;
              } 
              else {
                x1Other = x1Other - 10 * sine;
                y1Other = y1Other + 10 * cosine;
              }
            }
            this.element.setAttribute("transform",`translate(${x1Other}, ${y1Other})`);
          }
          if (distanceEnd <= 10) {
            this.element.removeAttribute("transform");
            let sine = this.getSine(x1Other, y1Other, x2Other, y2Other);
            let cosine = this.getCosine(x1Other, y1Other, x2Other, y2Other);
            if (x1Other < x2Other) {
              if (y1Other < y2Other) {
                x2Other = x2Other + 10 * sine;
                y2Other = y2Other + 10 * cosine;
              } 
              else {
                x2Other = x2Other + 10 * sine;
                y2Other = y2Other - 10 * cosine;
              }
            } else {
              if (y1Other < y2Other) {
                x2Other = x2Other - 10 * sine;
                y2Other = y2Other + 10 * cosine;
              } 
              else {
                x2Other = x2Other + 10 * sine;
                y2Other = y2Other - 10 * cosine;
              }
              // x2Other = x2Other - 10*sine;
              // y2Other = y2Other - 10*cosine;
            }
            this.element.setAttribute("transform",`translate(${x2Other}, ${y2Other})`);
          }
        }
        this.element.setAttribute("style", "position: absolute;");

        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.innerHTML = icon.textContent;
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("style", "user-select : none;");
        this.element.append(txt);
      }
    }

    getSine(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      let theta_x = Math.atan2(dy, dx);
      if (theta_x < 0) {
        theta_x *= -1;
      }
      const sine = Math.sin(theta_x);
      return sine;
    }

    getCosine(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const theta_y = Math.atan2(dx, dy);
      const cosine = Math.cos(theta_y);
      return cosine;
    }

    isClose(element, x, y) {
      const lines = document.querySelectorAll("line");
      for (const line of lines) {
        const x1Other = parseInt(line.getAttribute("x1"));
        const y1Other = parseInt(line.getAttribute("y1"));
        const x2Other = parseInt(line.getAttribute("x2"));
        const y2Other = parseInt(line.getAttribute("y2"));
        const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
        const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
        if (distanceStart <= 10) {
          element.removeAttribute("transform");
          element.setAttribute(
            "transform",
            `translate(${x1Other + 10}, ${y1Other + 10})`
          );
        }
        if (distanceEnd <= 10) {
          element.setAttribute(
            "transform",
            `translate(${x2Other + 100}, ${y2Other + 100})`
          );
        }
      }
    }

    addPoint(x, y, mode) {
      if (mode === "pencil") {
        this.element.setAttribute("x2", x);
        this.element.setAttribute("y2", y);
        this.boardText.setAttribute("style", "display: none;");
        const lines = document.querySelectorAll("line");
        for (let i = 0; i < lines.length; i++) {
          const x1Other = lines[i].getAttribute("x1");
          const y1Other = lines[i].getAttribute("y1");
          const x2Other = lines[i].getAttribute("x2");
          const y2Other = lines[i].getAttribute("y2");
          const distanceStart = Math.sqrt(
            (x - x1Other) ** 2 + (y - y1Other) ** 2
          );
          const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
          if (distanceStart <= 10) {
            this.element.setAttribute("x2", x1Other);
            this.element.setAttribute("y2", y1Other);
          }
          if (distanceEnd <= 10) {
            this.element.setAttribute("x2", x2Other);
            this.element.setAttribute("y2", y2Other);
          }
        }
      }
    }

    remove() {
      this.element.remove();
    }
  }