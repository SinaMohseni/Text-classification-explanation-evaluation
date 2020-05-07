<!-- This should be fine because users wouldn't be running this script unless they already passed the other checks. But if someone tries this twice they will end up overwriting their file I think. -->
<?php
  $json = $_POST['json'];
  /* sanity check */
  if (json_decode($json) != null)
  {
    $decode = json_decode($json);
    foreach($decode as $entry){
      $id = $entry->i;
    break;
    }
    $filename = "./user_data/" . $id . ".json";
    $file = fopen($filename,'w+');
    fwrite($file, $json);
    fclose($file);
  }
  else
  {
    // user has posted invalid JSON, handle the error 
  }
?>