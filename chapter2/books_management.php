class Book {
 
 function getTitle() {
     return "A Great Book";
 }

 function getAuthor() {
     return "John Doe";
 }

 function turnPage() {
     // pointer to next page
 }

 function getCurrentPage() {
     return "current page content";
 }

 function getLocation() {
     // returns the position in the library
     // ie. shelf number & room number
 }

 function save() {
     $filename = '/documents/'. $this->getTitle(). ' - ' . $this->getAuthor();
     file_put_contents($filename, serialize($this));
 }
}

interface Printer {

 function printPage($page);
}

class PlainTextPrinter implements Printer {

 function printPage($page) {
     echo $page;
 }

}

class HtmlPrinter implements Printer {

 function printPage($page) {
     echo '<div style="single-page">' . $page . '</div>';
 }
}

// the above code does not follow SRP as there are multiple responsibilites provided for the book class(data show, page manage, location manage)
//if logic for page management changes or turning pages changes then the whole class needs to be modified