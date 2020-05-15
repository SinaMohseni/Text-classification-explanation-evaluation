<!-- This should be fine because users wouldn't be running this script unless they already passed the other checks. But if someone tries this twice they will end up overwriting their file I think. -->
<?php
  $json = $_POST['json'];
  /* sanity check */
  if (json_decode($json) != null)
  {
    $decode = json_decode($json);
    foreach($decode as $entry){
      $id = $entry->i;
      $task = $entry->t;
    break;
    }
    switch ($task) {
      case -1:
        $filename = "../user-study/incoming_user_data/temp/" . $id . ".json";
        break;
      case 0:
          //Image Annotation
          $filename = "../user-study/incoming_user_data/imageA/" . $id . ".json";
          break;
      case 1:
          //Image Rating
          $filename = "../user-study/incoming_user_data/imageR/" . $id . ".json";
          break;
      case 2:
          //text Annotation
          $filename = "../user-study/incoming_user_data/textA/" . $id . ".json";
          break;
      case 3;
          //Text Rating
          $filename = "../user-study/incoming_user_data/textR/" . $id . ".json";
          break;
        }
    // $filename = "./user_data/" . $id . ".json";
    $file = fopen($filename,'w+');
    fwrite($file, $json);
    fclose($file);
  }
  else
  {
    // user has posted invalid JSON, handle the error 
  }
?>