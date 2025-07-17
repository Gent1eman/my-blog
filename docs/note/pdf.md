# 导出 PDF

## 1 安装依赖

```shell
    pnpm install html2canvas
    pnpm install jsPDF
```

## 2 主要流程

1. 使用`html2canvas`将 HTML 元素渲染为 canvas
2. 根据 A4 页面尺寸和 canvas 尺寸，计算分页逻辑
3. 通过检测空白行，找到安全的分页点，防止内容截断
4. 将每页内容添加到 PDF，并保存文件

## 3 代码详解

### 3.1 初始化与 canvas 渲染

```ts
const exportToPDF = async () => {
    await nextTick(); // 确保DOM更新完成后再执行后续的逻辑，方法防止捕获到为渲染完成的HTML内容
    const content = previewRef.value?.resumeContentRef;
    if (!content) return;

    const canvas = await html2canvas(content, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
        allowTaint: true,
        dpi: window.devicePixelRatio * 4,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
        scrollX: 0,
        scrollY: 0,
    });
    // ...
};
```

-   `await nextTick()`确保 DOM 更新完成后再执行后续逻辑，防止捕获到未渲染完成的 HTML 内容。
-   `previewRef.value?.resumeContentRef`获取 DOM 元素（Vue 的 ref），表示需要导出的 HTML 内容。
-   `html2canvas`:
    -   将`content`渲染为 canvas 对象。
    -   配置参数：
        -   `scale: 3`放大 3 倍以提高清晰度
        -   `useCORS: true` 和 `allowTaint: true`：支持跨域资源（如图片）
        -   `backgroundColor: "#fff"`：设置 canvas 背景为白色。
        -   `dpi: window.devicePixelRatio * 4`：进一步提高分辨率。
        -   `windowWidth` 和 `windowHeight`：设置渲染窗口的尺寸为内容的滚动宽高，确保捕获完整内容。
        -   `scrollX: 0` 和 `scrollY: 0`：确保从内容左上角开始渲染。

### 3.2 A4 页面与缩放设置

```ts
const pdf = new jsPDF("p", "pt", "a4");
const margin = 13 * 2.83465;
const a4Width = 595.28;
const a4Height = 841.89;
const pageContentWidth = a4Width - margin * 2;
const pageContentHeight = a4Height - margin * 2;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const scale = pageContentWidth / canvasWidth;
const pagePixelHeight = pageContentHeight / scale;
```

-   A4 尺寸：
    -   A4 纸张标准尺寸为 210mm x 297mm，单位为点（pt），即 `595.28 x 841.89`（1mm ≈ 2.83465pt）。
    -   `margin = 13 \* 2.83465`：设置 13mm 的边距，转换为点（约 36.85pt）。
    -   `pageContentWidth` 和 `pageContentHeight`：计算 A4 页面内容区域的宽高，减去两侧边距。
-   缩放比例：
    -   `scale = pageContentWidth / canvasWidth`：根据 canvas 宽度和页面内容宽度，计算缩放比例，确保 canvas 内容适配 A4 页面宽度。
    -   `pagePixelHeight = pageContentHeight / scale`：计算一页 A4 在 canvas 中对应的高度（以像素为单位）。
-   变量：
    -   `canvasWidth` 和 `canvasHeight`：canvas 的实际宽高（像素）。
    -   `positionY`：当前处理的 canvas 垂直偏移量，初始为 0。

### 3.3 空白行检测函数

```ts
const isBlankLine = (y: number) => {
    const ctx = canvas.getContext("2d")!;
    for (let x = 0; x < canvas.width; x += 10) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[0] !== 255 || pixel[1] !== 255 || pixel[2] !== 255) {
            return false;
        }
    }
    return true;
};
```

-   检查 canvas 在指定`y`坐标的行是否为白色（空白行）。
-   使用`getImageData(x,y,1,1)`获取单个像素的 RGBA 值。
-   这里为了提高效率，每个 10 个像素检查一次（`x += 10`），而不是检查每一像素。
-   如果所有检查的像素均为`255`（白色），返回`true`，表示空白行；否则返回`false`。

### 3.4 寻找安全分页点

```ts
const findSafeSplitPosition = (startY: number, endY: number) => {
    let blankLineCount = 0;
    for (let y = Math.floor(endY); y >= Math.floor(startY); y--) {
        if (isBlankLine(y)) {
            blankLineCount++;
            if (blankLineCount >= 5) return y;
        } else {
            blankLineCount = 0;
        }
    }
    return endY;
};
```

-   再 `startY` 和 `endY`，从底部向上扫描，寻找连续 5 行空白的行（`blankLineCount >= 5`）。
-   如果寻找到连续 5 行空白，就返回该行 `y` 坐标作为安全分页点。
-   如果没有找到合适的空白区域，返回 `endY`（默认分页点）。
-   通过寻找连续空白行，确保分页点位于内容之间的空隙，避免文字或图片被切断。

### 3.5 分页与 PDF 输出

```ts
while (positionY < canvasHeight) {
    let currentPagePixelHeight = Math.min(
        pagePixelHeight,
        canvasHeight - positionY
    );

    if (positionY + currentPagePixelHeight < canvasHeight) {
        const safeY = findSafeSplitPosition(
            positionY,
            positionY + currentPagePixelHeight
        );
        currentPagePixelHeight = safeY - positionY;
        if (currentPagePixelHeight <= 0) {
            currentPagePixelHeight = pagePixelHeight;
        }
    }

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvasWidth;
    pageCanvas.height = currentPagePixelHeight;

    const ctx = pageCanvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    ctx.drawImage(
        canvas,
        0,
        positionY,
        canvasWidth,
        currentPagePixelHeight,
        0,
        0,
        canvasWidth,
        currentPagePixelHeight
    );

    if (positionY > 0) pdf.addPage();

    pdf.addImage(
        pageCanvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        margin,
        margin,
        pageContentWidth,
        pageContentHeight * (currentPagePixelHeight / pagePixelHeight)
    );

    positionY += currentPagePixelHeight;
}

pdf.save("resume.pdf");
```

-   分页循环：
    -   `while (positionY < canvasHeight)`：只要还有未处理的 canvas 高度，继续分页。
    -   `currentPagePixelHeight`：计算当前页的高度，取 `pagePixelHeight` 和剩余高度（`canvasHeight - positionY`）的最小值。
-   安全分页：
    -   如果当前页不是最后一页（`positionY + currentPagePixelHeight < canvasHeight`），调用 `findSafeSplitPosition` 寻找安全分页点。
    -   `currentPagePixelHeight = safeY - positionY`：调整当前页高度为安全分页点。
    -   如果 `currentPagePixelHeight <= 0`（极少数情况，如空白区域检测失败），恢复默认页高。
-   创建分页 canvas：
    -   创建一个临时 canvas（`pageCanvas`），尺寸为 `canvasWidth x currentPagePixelHeight`。
    -   设置背景为白色（`ctx.fillRect`），然后绘制原始 canvas 的指定区域（从 `positionY` 开始）。
-   添加到 PDF：
    -   将 `pageCanvas` 转换为 JPEG 格式，添加到 PDF。
    -   `pdf.addImage` 的参数：
        -   `margin, margin`：左右和上边距。
        -   `pageContentWidth`：图像宽度适配页面内容宽度。
        -   `pageContentHeight \* (currentPagePixelHeight / pagePixelHeight)`：按比例计算图像高度，确保纵向缩放一致。
    -   如果不是第一页（`positionY > 0`），调用 `pdf.addPage()` 添加新页面。
-   更新偏移量：
    -   `positionY += currentPagePixelHeight`：更新 canvas 的垂直偏移量。
    -   循环继续，直到 `positionY >= canvasHeight`。
