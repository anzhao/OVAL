<?php
// ===================================================================================================
//                           _  __     _ _
//                          | |/ /__ _| | |_ _  _ _ _ __ _
//                          | ' </ _` | |  _| || | '_/ _` |
//                          |_|\_\__,_|_|\__|\_,_|_| \__,_|
//
// This file is part of the Kaltura Collaborative Media Suite which allows users
// to do with audio, video, and animation what Wiki platfroms allow them to do with
// text.
//
// Copyright (C) 2006-2011  Kaltura Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// @ignore
// ===================================================================================================

/**
 * @package Kaltura
 * @subpackage Client
 */
require_once(dirname(__FILE__) . "/../KalturaClientBase.php");
require_once(dirname(__FILE__) . "/../KalturaEnums.php");
require_once(dirname(__FILE__) . "/../KalturaTypes.php");

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentType
{
	const DOCUMENT = 11;
	const SWF = 12;
	const PDF = 13;
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentEntryOrderBy
{
	const NAME_ASC = "+name";
	const NAME_DESC = "-name";
	const MODERATION_COUNT_ASC = "+moderationCount";
	const MODERATION_COUNT_DESC = "-moderationCount";
	const CREATED_AT_ASC = "+createdAt";
	const CREATED_AT_DESC = "-createdAt";
	const UPDATED_AT_ASC = "+updatedAt";
	const UPDATED_AT_DESC = "-updatedAt";
	const RANK_ASC = "+rank";
	const RANK_DESC = "-rank";
	const TOTAL_RANK_ASC = "+totalRank";
	const TOTAL_RANK_DESC = "-totalRank";
	const START_DATE_ASC = "+startDate";
	const START_DATE_DESC = "-startDate";
	const END_DATE_ASC = "+endDate";
	const END_DATE_DESC = "-endDate";
	const PARTNER_SORT_VALUE_ASC = "+partnerSortValue";
	const PARTNER_SORT_VALUE_DESC = "-partnerSortValue";
	const RECENT_ASC = "+recent";
	const RECENT_DESC = "-recent";
	const WEIGHT_ASC = "+weight";
	const WEIGHT_DESC = "-weight";
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParamsOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParamsOutputOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParamsOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParamsOutputOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParamsOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParamsOutputOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParamsOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParamsOutputOrderBy
{
}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentEntry extends KalturaBaseEntry
{
	/**
	 * The type of the document
	 * 	 
	 *
	 * @var KalturaDocumentType
	 * @insertonly
	 */
	public $documentType = null;

	/**
	 * Comma separated asset params ids that exists for this media entry
	 * 	 
	 *
	 * @var string
	 * @readonly
	 */
	public $assetParamsIds = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentListResponse extends KalturaObjectBase
{
	/**
	 * 
	 *
	 * @var array of KalturaDocumentEntry
	 * @readonly
	 */
	public $objects;

	/**
	 * 
	 *
	 * @var int
	 * @readonly
	 */
	public $totalCount = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParams extends KalturaFlavorParams
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParams extends KalturaFlavorParams
{
	/**
	 * 
	 *
	 * @var int
	 */
	public $densityWidth = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $densityHeight = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $sizeWidth = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $sizeHeight = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $depth = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParams extends KalturaFlavorParams
{
	/**
	 * 
	 *
	 * @var bool
	 */
	public $readonly = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParams extends KalturaFlavorParams
{
	/**
	 * 
	 *
	 * @var int
	 */
	public $flashVersion = null;

	/**
	 * 
	 *
	 * @var bool
	 */
	public $poly2Bitmap = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaDocumentEntryBaseFilter extends KalturaBaseEntryFilter
{
	/**
	 * 
	 *
	 * @var KalturaDocumentType
	 */
	public $documentTypeEqual = null;

	/**
	 * 
	 *
	 * @var string
	 */
	public $documentTypeIn = null;

	/**
	 * 
	 *
	 * @var string
	 */
	public $assetParamsIdsMatchOr = null;

	/**
	 * 
	 *
	 * @var string
	 */
	public $assetParamsIdsMatchAnd = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParamsOutput extends KalturaFlavorParamsOutput
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParamsOutput extends KalturaFlavorParamsOutput
{
	/**
	 * 
	 *
	 * @var int
	 */
	public $densityWidth = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $densityHeight = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $sizeWidth = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $sizeHeight = null;

	/**
	 * 
	 *
	 * @var int
	 */
	public $depth = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParamsOutput extends KalturaFlavorParamsOutput
{
	/**
	 * 
	 *
	 * @var bool
	 */
	public $readonly = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParamsOutput extends KalturaFlavorParamsOutput
{
	/**
	 * 
	 *
	 * @var int
	 */
	public $flashVersion = null;

	/**
	 * 
	 *
	 * @var bool
	 */
	public $poly2Bitmap = null;


}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentEntryFilter extends KalturaDocumentEntryBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaDocumentFlavorParamsBaseFilter extends KalturaFlavorParamsFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaImageFlavorParamsBaseFilter extends KalturaFlavorParamsFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaPdfFlavorParamsBaseFilter extends KalturaFlavorParamsFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaSwfFlavorParamsBaseFilter extends KalturaFlavorParamsFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParamsFilter extends KalturaDocumentFlavorParamsBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParamsFilter extends KalturaImageFlavorParamsBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParamsFilter extends KalturaPdfFlavorParamsBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParamsFilter extends KalturaSwfFlavorParamsBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaDocumentFlavorParamsOutputBaseFilter extends KalturaFlavorParamsOutputFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaImageFlavorParamsOutputBaseFilter extends KalturaFlavorParamsOutputFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaPdfFlavorParamsOutputBaseFilter extends KalturaFlavorParamsOutputFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
abstract class KalturaSwfFlavorParamsOutputBaseFilter extends KalturaFlavorParamsOutputFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentFlavorParamsOutputFilter extends KalturaDocumentFlavorParamsOutputBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaImageFlavorParamsOutputFilter extends KalturaImageFlavorParamsOutputBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaPdfFlavorParamsOutputFilter extends KalturaPdfFlavorParamsOutputBaseFilter
{

}

/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaSwfFlavorParamsOutputFilter extends KalturaSwfFlavorParamsOutputBaseFilter
{

}


/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentsService extends KalturaServiceBase
{
	function __construct(KalturaClient $client = null)
	{
		parent::__construct($client);
	}

	function addFromUploadedFile(KalturaDocumentEntry $documentEntry, $uploadTokenId)
	{
		$kparams = array();
		$this->client->addParam($kparams, "documentEntry", $documentEntry->toParams());
		$this->client->addParam($kparams, "uploadTokenId", $uploadTokenId);
		$this->client->queueServiceActionCall("document_documents", "addFromUploadedFile", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentEntry");
		return $resultObject;
	}

	function addFromEntry($sourceEntryId, KalturaDocumentEntry $documentEntry = null, $sourceFlavorParamsId = null)
	{
		$kparams = array();
		$this->client->addParam($kparams, "sourceEntryId", $sourceEntryId);
		if ($documentEntry !== null)
			$this->client->addParam($kparams, "documentEntry", $documentEntry->toParams());
		$this->client->addParam($kparams, "sourceFlavorParamsId", $sourceFlavorParamsId);
		$this->client->queueServiceActionCall("document_documents", "addFromEntry", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentEntry");
		return $resultObject;
	}

	function addFromFlavorAsset($sourceFlavorAssetId, KalturaDocumentEntry $documentEntry = null)
	{
		$kparams = array();
		$this->client->addParam($kparams, "sourceFlavorAssetId", $sourceFlavorAssetId);
		if ($documentEntry !== null)
			$this->client->addParam($kparams, "documentEntry", $documentEntry->toParams());
		$this->client->queueServiceActionCall("document_documents", "addFromFlavorAsset", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentEntry");
		return $resultObject;
	}

	function convert($entryId, $conversionProfileId = null, array $dynamicConversionAttributes = null)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->addParam($kparams, "conversionProfileId", $conversionProfileId);
		if ($dynamicConversionAttributes !== null)
			foreach ($dynamicConversionAttributes as $index => $obj) {
				$this->client->addParam($kparams, "dynamicConversionAttributes:$index", $obj->toParams());
			}
		$this->client->queueServiceActionCall("document_documents", "convert", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "integer");
		return $resultObject;
	}

	function get($entryId, $version = -1)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->addParam($kparams, "version", $version);
		$this->client->queueServiceActionCall("document_documents", "get", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentEntry");
		return $resultObject;
	}

	function update($entryId, KalturaDocumentEntry $documentEntry)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->addParam($kparams, "documentEntry", $documentEntry->toParams());
		$this->client->queueServiceActionCall("document_documents", "update", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentEntry");
		return $resultObject;
	}

	function delete($entryId)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->queueServiceActionCall("document_documents", "delete", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "null");
		return $resultObject;
	}

	function listAction(KalturaDocumentEntryFilter $filter = null, KalturaFilterPager $pager = null)
	{
		$kparams = array();
		if ($filter !== null)
			$this->client->addParam($kparams, "filter", $filter->toParams());
		if ($pager !== null)
			$this->client->addParam($kparams, "pager", $pager->toParams());
		$this->client->queueServiceActionCall("document_documents", "list", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "KalturaDocumentListResponse");
		return $resultObject;
	}

	function upload($fileData)
	{
		$kparams = array();
		$kfiles = array();
		$this->client->addParam($kfiles, "fileData", $fileData);
		$this->client->queueServiceActionCall("document_documents", "upload", $kparams, $kfiles);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "string");
		return $resultObject;
	}

	function convertPptToSwf($entryId)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->queueServiceActionCall("document_documents", "convertPptToSwf", $kparams);
		if ($this->client->isMultiRequest())
			return $this->client->getMultiRequestResult();
		$resultObject = $this->client->doQueue();
		$this->client->throwExceptionIfError($resultObject);
		$this->client->validateObjectType($resultObject, "string");
		return $resultObject;
	}

	function serve($entryId, $flavorAssetId = null, $forceProxy = false)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->addParam($kparams, "flavorAssetId", $flavorAssetId);
		$this->client->addParam($kparams, "forceProxy", $forceProxy);
		$this->client->queueServiceActionCall('document_documents', 'serve', $kparams);
		$resultObject = $this->client->getServeUrl();
		return $resultObject;
	}

	function serveByFlavorParamsId($entryId, $flavorParamsId = null, $forceProxy = false)
	{
		$kparams = array();
		$this->client->addParam($kparams, "entryId", $entryId);
		$this->client->addParam($kparams, "flavorParamsId", $flavorParamsId);
		$this->client->addParam($kparams, "forceProxy", $forceProxy);
		$this->client->queueServiceActionCall('document_documents', 'serveByFlavorParamsId', $kparams);
		$resultObject = $this->client->getServeUrl();
		return $resultObject;
	}
}
/**
 * @package Kaltura
 * @subpackage Client
 */
class KalturaDocumentClientPlugin extends KalturaClientPlugin
{
	/**
	 * @var KalturaDocumentsService
	 */
	public $documents = null;

	protected function __construct(KalturaClient $client)
	{
		parent::__construct($client);
		$this->documents = new KalturaDocumentsService($client);
	}

	/**
	 * @return KalturaDocumentClientPlugin
	 */
	public static function get(KalturaClient $client)
	{
		return new KalturaDocumentClientPlugin($client);
	}

	/**
	 * @return array<KalturaServiceBase>
	 */
	public function getServices()
	{
		$services = array(
			'documents' => $this->documents,
		);
		return $services;
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return 'document';
	}
}