#!/usr/local/bin/php
<?php
try {
  $json = $_POST['json'];
  /* sanity check */
  if (json_decode($json) != null)
  {

    $decode = json_decode($json);
    try{
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
          //Image Annotation -- 
          $filename = "../user-study/incoming_user_data/imageA/" . $id . ".json";
          break;
      case 1:
          //Image Rating -- 
          $filename = "../user-study/incoming_user_data/imageR/" . $id . ".json";
          break;
      case 2:
          //text Annotation -- 
          $filename = "../user-study/incoming_user_data/textA/" . $id . ".json";
          break;
      case 3;
          //Text Rating -- 
          $filename = "../user-study/incoming_user_data/textR/" . $id . ".json";
          break;
      default;
        throw new Exception('task ID Provided is incorrect. Check t value', 512);
        break;
      }
      } catch (Exception $t){
        echo $t;
        exit;
      }

    // $filename = "./user_data/" . $id . ".json";
    $file = fopen($filename,'w+');
    fwrite($file, $json);
    fclose($file);
  }
  else
  {
    throw new Exception('json decode returned null',512);
  }
} catch(Exception $e){
  echo $e;
  exit;
}
?>