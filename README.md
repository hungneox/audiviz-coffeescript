# Audio visualizer in Coffee script 

# Usage 


> new Audiviz(canvasClass, audioPlayer, style);


## Sample

```html
<script type="text/javascript">
	$(document).ready(function(){
		var audiviz = new Audiviz(".visualizer", "myAudio", 'bars');
		audiviz.run();
	})
</script>
```

## Bars style
![Bars](images/demo.png)

## Dots style
![Dots](images/dots.png)

## Circle style
![Dots](images/circle.png)

# Install npm 

```
 curl https://npmjs.org/install.sh | sh
```

# Install dependencies

```
npm install
```

# Install and run http-server

```
 npm install http-server -g
```

```
http-server [path] [options]
```

## Sample

```
cd test
http-server .
```
